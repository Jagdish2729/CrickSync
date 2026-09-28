import "dotenv/config";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { prisma } from "./db";
import { hashOtp, normalizePhone, signToken, verifyToken } from "./auth";
import { sendOtp } from "./otp";
import { sendPushToUser } from "./push";

const app = express();
const port = Number(process.env.PORT ?? 4000);
app.use(cors());
app.use(express.json());

type AuthedRequest = Request & { userId?: string };

async function auth(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const header = req.header("authorization");
    if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
    req.userId = verifyToken(header.slice(7));
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.get("/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true, service: "cricksync-api" });
});

app.post("/auth/request-otp", async (req, res) => {
  try {
    const phone = normalizePhone(String(req.body.phone ?? ""));
    const recent = await prisma.otpChallenge.findFirst({ where: { phone, createdAt: { gt: new Date(Date.now() - 60_000) } }, orderBy: { createdAt: "desc" } });
    if (recent) return res.status(429).json({ error: "Please wait before requesting another OTP" });
    const otp = await sendOtp(phone);
    await prisma.otpChallenge.create({ data: { phone, codeHash: otp.codeHash, expiresAt: otp.expiresAt } });
    res.json({ ok: true, expiresInSeconds: 300 });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to send OTP" });
  }
});

app.post("/auth/verify-otp", async (req, res) => {
  try {
    const phone = normalizePhone(String(req.body.phone ?? ""));
    const code = String(req.body.code ?? "");
    if (!/^\d{6}$/.test(code)) return res.status(400).json({ error: "OTP must be 6 digits" });
    const challenge = await prisma.otpChallenge.findFirst({ where: { phone, consumedAt: null, expiresAt: { gt: new Date() } }, orderBy: { createdAt: "desc" } });
    if (!challenge) return res.status(400).json({ error: "OTP expired or not found" });
    if (challenge.attempts >= 5) return res.status(429).json({ error: "Too many attempts" });
    if (hashOtp(code) !== challenge.codeHash) {
      await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { attempts: { increment: 1 } } });
      return res.status(400).json({ error: "Invalid OTP" });
    }
    await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { consumedAt: new Date() } });
    const user = await prisma.user.upsert({ where: { phone }, update: {}, create: { phone } });
    res.json({ token: signToken(user.id), user });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to verify OTP" });
  }
});

app.get("/me", auth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user });
});

app.patch("/me", auth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.update({ where: { id: req.userId }, data: {
    name: typeof req.body.name === "string" ? req.body.name.trim() : undefined,
    city: typeof req.body.city === "string" ? req.body.city.trim() : undefined
  }});
  res.json({ user });
});

app.post("/push-tokens", auth, async (req: AuthedRequest, res) => {
  const token = String(req.body.token ?? "");
  const platform = String(req.body.platform ?? "unknown");
  if (!token) return res.status(400).json({ error: "Push token is required" });
  await prisma.pushToken.upsert({ where: { token }, update: { userId: req.userId!, platform }, create: { token, platform, userId: req.userId! } });
  res.json({ ok: true });
});

app.post("/teams", auth, async (req: AuthedRequest, res) => {
  const name = String(req.body.name ?? "").trim();
  if (!name) return res.status(400).json({ error: "Team name is required" });
  const team = await prisma.team.create({ data: { name, captainId: req.userId! } });
  res.status(201).json({ team });
});

app.get("/teams", auth, async (req: AuthedRequest, res) => {
  const teams = await prisma.team.findMany({
    where: { OR: [{ captainId: req.userId! }, { members: { some: { userId: req.userId!, status: "ACCEPTED" } } }] },
    include: { members: { include: { user: { select: { id: true, phone: true, name: true, city: true } } } } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ teams });
});

app.post("/teams/:teamId/members", auth, async (req: AuthedRequest, res) => {
  const team = await prisma.team.findFirst({ where: { id: req.params.teamId, captainId: req.userId! } });
  if (!team) return res.status(403).json({ error: "Only the captain can add players" });
  const phone = normalizePhone(String(req.body.phone ?? ""));
  const player = await prisma.user.findUnique({ where: { phone } });
  if (!player) return res.status(404).json({ error: "Player must create a CrickSync account first" });
  const member = await prisma.teamMember.upsert({
    where: { teamId_userId: { teamId: team.id, userId: player.id } },
    update: { status: "PENDING" },
    create: { teamId: team.id, userId: player.id, status: "PENDING" }
  });
  await sendPushToUser(player.id, { title: "Team invitation", body: team.name + " invited you to join the team.", data: { type: "TEAM_INVITE", teamId: team.id } }).catch(() => {});
  res.status(201).json({ member });
});

app.post("/teams/:teamId/respond", auth, async (req: AuthedRequest, res) => {
  const status = req.body.status === "ACCEPTED" ? "ACCEPTED" : req.body.status === "DECLINED" ? "DECLINED" : null;
  if (!status) return res.status(400).json({ error: "Invalid response" });
  const member = await prisma.teamMember.findUnique({ where: { teamId_userId: { teamId: req.params.teamId, userId: req.userId! } } });
  if (!member) return res.status(404).json({ error: "Team invitation not found" });
  const updated = await prisma.teamMember.update({ where: { id: member.id }, data: { status } });
  res.json({ member: updated });
});

app.post("/matches", auth, async (req: AuthedRequest, res) => {
  const startsAt = new Date(req.body.startsAt);
  const endsAt = new Date(req.body.endsAt);
  const ground = String(req.body.ground ?? "").trim();
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || startsAt >= endsAt || !ground) return res.status(400).json({ error: "Invalid match schedule" });
  const teamId = req.body.teamId ? String(req.body.teamId) : null;
  if (teamId) {
    const team = await prisma.team.findFirst({ where: { id: teamId, captainId: req.userId! } });
    if (!team) return res.status(403).json({ error: "Team not found" });
  }
  const match = await prisma.match.create({ data: {
    teamId, createdById: req.userId!,
    opponent: req.body.opponent ? String(req.body.opponent) : undefined,
    stage: req.body.stage ? String(req.body.stage) : undefined,
    startsAt, endsAt, ground,
    ball: req.body.ball === "RED" ? "RED" : "WHITE",
    overs: req.body.overs ? Number(req.body.overs) : undefined
  }});
  const playerIds = Array.isArray(req.body.playerIds) ? req.body.playerIds.map(String) : [];
  if (teamId && playerIds.length) {
    const acceptedMembers = await prisma.teamMember.findMany({ where: { teamId, userId: { in: playerIds }, status: "ACCEPTED" } });
    for (const member of acceptedMembers) {
      await prisma.matchInvitation.create({ data: { matchId: match.id, playerId: member.userId } });
      await sendPushToUser(member.userId, { title: "New match invite", body: (match.opponent ? "vs " + match.opponent : "You have been invited to a match") + " · " + match.ground, data: { type: "MATCH_INVITE", matchId: match.id } }).catch(() => {});
    }
  }
  res.status(201).json({ match });
});

app.get("/matches", auth, async (req: AuthedRequest, res) => {
  const matches = await prisma.match.findMany({
    where: { OR: [{ createdById: req.userId! }, { invitations: { some: { playerId: req.userId!, status: "ACCEPTED" } } }] },
    include: { team: true, invitations: { include: { player: { select: { id: true, name: true, phone: true } } } } },
    orderBy: { startsAt: "asc" }
  });
  res.json({ matches });
});

app.get("/match-invitations", auth, async (req: AuthedRequest, res) => {
  const invitations = await prisma.matchInvitation.findMany({
    where: { playerId: req.userId! },
    include: { match: { include: { team: true, createdBy: { select: { id: true, name: true, phone: true } } } } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ invitations });
});

app.post("/match-invitations/:id/respond", auth, async (req: AuthedRequest, res) => {
  const status = req.body.status === "ACCEPTED" ? "ACCEPTED" : req.body.status === "DECLINED" ? "DECLINED" : null;
  if (!status) return res.status(400).json({ error: "Invalid response" });
  const invitation = await prisma.matchInvitation.findFirst({ where: { id: req.params.id, playerId: req.userId! }, include: { match: true } });
  if (!invitation) return res.status(404).json({ error: "Invitation not found" });
  if (status === "ACCEPTED") {
    const clash = await prisma.match.findFirst({
      where: {
        OR: [{ createdById: req.userId! }, { invitations: { some: { playerId: req.userId!, status: "ACCEPTED" } } }],
        status: "SCHEDULED",
        startsAt: { lt: invitation.match.endsAt },
        endsAt: { gt: invitation.match.startsAt }
      }
    });
    if (clash) return res.status(409).json({ error: "MATCH_CONFLICT", conflictMatchId: clash.id });
  }
  const updated = await prisma.matchInvitation.update({ where: { id: invitation.id }, data: { status, respondedAt: new Date() } });
  res.json({ invitation: updated });
});

app.get("/captain/matches/:id/invitations", auth, async (req: AuthedRequest, res) => {
  const match = await prisma.match.findFirst({ where: { id: req.params.id, createdById: req.userId! } });
  if (!match) return res.status(404).json({ error: "Match not found" });
  const invitations = await prisma.matchInvitation.findMany({ where: { matchId: match.id }, include: { player: { select: { id: true, name: true, phone: true, city: true } } } });
  res.json({ invitations });
});

app.listen(port, () => console.log("CrickSync API running on port " + port));
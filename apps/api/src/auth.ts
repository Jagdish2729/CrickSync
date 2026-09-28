import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is required");

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return "91" + digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  throw new Error("Invalid Indian phone number");
}

export function createOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export function hashOtp(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): string {
  const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  if (!payload.sub || typeof payload.sub !== "string") throw new Error("Invalid token");
  return payload.sub;
}
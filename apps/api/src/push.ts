import { prisma } from "./db";

type PushMessage = { title: string; body: string; data?: Record<string, unknown> };

export async function sendPushToUser(userId: string, message: PushMessage): Promise<void> {
  const tokens = await prisma.pushToken.findMany({ where: { userId } });
  if (!tokens.length) return;

  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tokens.map(item => ({
      to: item.token,
      sound: "default",
      title: message.title,
      body: message.body,
      data: message.data
    })))
  });

  if (!response.ok) throw new Error("Push notification request failed");
}
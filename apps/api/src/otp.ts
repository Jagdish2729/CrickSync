import { createOtp, hashOtp } from "./auth";

export async function sendOtp(phone: string): Promise<{ codeHash: string; expiresAt: Date }> {
  const code = createOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  if (process.env.OTP_PROVIDER !== "msg91") {
    throw new Error("OTP_PROVIDER must be configured for production");
  }

  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;
  if (!authKey || !templateId) throw new Error("MSG91 OTP configuration is incomplete");

  const response = await fetch("https://control.msg91.com/api/v5/otp", {
    method: "POST",
    headers: { "Content-Type": "application/json", authkey: authKey },
    body: JSON.stringify({
      template_id: templateId,
      mobile: phone,
      otp: code
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error("OTP provider rejected request: " + body);
  }

  return { codeHash: hashOtp(code), expiresAt };
}
import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { createPasswordReset } from "../../../../db/admin-credentials";
import { hasValidMutationOrigin } from "../../../admin-auth";

const adminEmail = "tuanlinhnguyen765@gmail.com";

export async function POST(request: Request) {
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const token = await createPasswordReset();
  if (token) {
    const link = `${new URL(request.url).origin}/admin/reset-password?token=${encodeURIComponent(token)}`;
    const email = (env as unknown as { PASSWORD_RESET_EMAIL?: SendEmail }).PASSWORD_RESET_EMAIL;
    if (!email) return NextResponse.json({ message: "Password reset email is not configured." }, { status: 503 });
    await email.send({
      to: adminEmail,
      from: { email: "admin@cinemaxmx.com", name: "Porchlight Admin" },
      subject: "Reset your Porchlight Admin password",
      text: `Use this link within 30 minutes to reset your admin password:\n\n${link}\n\nIf you did not request this, ignore this email.`,
      html: `<p>Use the link below within 30 minutes to reset your Porchlight Admin password:</p><p><a href="${link}">Reset admin password</a></p><p>If you did not request this, ignore this email.</p>`,
    });
  }
  return NextResponse.json({ message: "If email delivery is available, a reset link has been sent to the administrator." });
}

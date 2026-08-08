import { NextResponse } from "next/server";
import { resetAdminPassword } from "../../../../db/admin-credentials";
import { hasValidMutationOrigin } from "../../../admin-auth";

export async function POST(request: Request) {
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const body = await request.json().catch(() => null) as { token?: unknown; password?: unknown } | null;
  if (!body || typeof body.token !== "string" || typeof body.password !== "string" || body.password.length < 8) return NextResponse.json({ message: "Use a password with at least 8 characters." }, { status: 400 });
  try {
    if (!await resetAdminPassword(body.token, body.password)) return NextResponse.json({ message: "This reset link is invalid or has expired." }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin password reset failed", error);
    return NextResponse.json({ message: "The server could not save the new password. Please request a new reset link and try again." }, { status: 500 });
  }
}

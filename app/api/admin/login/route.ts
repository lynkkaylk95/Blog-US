import { NextResponse } from "next/server";
import { adminCookieOptions, cookieName, createAdminToken, hasValidMutationOrigin } from "../../../admin-auth";
import { runtimeEnv } from "../../../runtime-env";
import { authenticateAdmin, primaryAdminUsername } from "../../../../db/admin-authentication";

export async function POST(request: Request) {
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const body = await request.json().catch(() => null) as { identifier?: unknown; email?: unknown; password?: unknown } | null;
  if (!body || typeof body.password !== "string") return NextResponse.json({ message: "Incorrect username or password." }, { status: 401 });
  const identifier = typeof body.identifier === "string" ? body.identifier : typeof body.email === "string" && body.email.trim() ? body.email : primaryAdminUsername;
  const authenticated = await authenticateAdmin(identifier, body.password).catch(() => false);
  if (!authenticated) return NextResponse.json({ message: "Incorrect username or password." }, { status: 401 });
  if (!runtimeEnv("ADMIN_SESSION_SECRET")) return NextResponse.json({ message: "Admin session signing is not configured." }, { status: 503 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, await createAdminToken(), adminCookieOptions());
  return response;
}

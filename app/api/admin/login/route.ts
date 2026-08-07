import { NextResponse } from "next/server";
import { adminCookieOptions, cookieName, createAdminToken, hasValidMutationOrigin, passwordsMatch } from "../../../admin-auth";
import { runtimeEnv } from "../../../runtime-env";
import { verifyStoredAdminPassword } from "../../../../db/admin-credentials";

export async function POST(request: Request) {
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const expected = runtimeEnv("ADMIN_PASSWORD");
  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  if (!body || typeof body.password !== "string") return NextResponse.json({ message: "Incorrect password." }, { status: 401 });
  const storedMatch = await verifyStoredAdminPassword(body.password).catch(() => null);
  const initialMatch = expected ? passwordsMatch(body.password, expected) : false;
  if (storedMatch === false || (storedMatch === null && !initialMatch)) return NextResponse.json({ message: "Incorrect password." }, { status: 401 });
  if (!runtimeEnv("ADMIN_SESSION_SECRET")) return NextResponse.json({ message: "Admin session signing is not configured." }, { status: 503 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, await createAdminToken(), adminCookieOptions());
  return response;
}

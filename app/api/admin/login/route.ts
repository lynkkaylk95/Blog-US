import { NextResponse } from "next/server";
import { adminCookieOptions, cookieName, createAdminToken, hasValidMutationOrigin, passwordsMatch } from "../../../admin-auth";
import { runtimeEnv } from "../../../runtime-env";
import { setStoredAdminPassword, verifyAdminUser, verifyStoredAdminPassword } from "../../../../db/admin-credentials";

export async function POST(request: Request) {
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const expected = runtimeEnv("ADMIN_PASSWORD");
  const body = await request.json().catch(() => null) as { email?: unknown; password?: unknown } | null;
  if (!body || typeof body.password !== "string") return NextResponse.json({ message: "Incorrect password." }, { status: 401 });
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const userMatch = email ? await verifyAdminUser(email, body.password).catch(() => false) : false;
  const storedMatch = email ? false : await verifyStoredAdminPassword(body.password).catch(() => null);
  const initialMatch = expected ? passwordsMatch(body.password, expected) : false;
  if (email ? !userMatch : !storedMatch && !initialMatch) return NextResponse.json({ message: "Incorrect email or password." }, { status: 401 });
  if (!runtimeEnv("ADMIN_SESSION_SECRET")) return NextResponse.json({ message: "Admin session signing is not configured." }, { status: 503 });
  if (!email && initialMatch && storedMatch !== true) await setStoredAdminPassword(body.password).catch(() => undefined);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, await createAdminToken(), adminCookieOptions());
  return response;
}

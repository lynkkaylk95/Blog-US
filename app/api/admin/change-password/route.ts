import { NextResponse } from "next/server";
import { getDb } from "../../../../db";
import { eq } from "drizzle-orm";
import { adminCredentials, adminUsers } from "../../../../db/schema";
import { createPasswordHash, verifyAdminUser, verifyStoredAdminPassword } from "../../../../db/admin-credentials";
import { hasValidMutationOrigin, isAdminAuthenticated, passwordsMatch } from "../../../admin-auth";
import { runtimeEnv } from "../../../runtime-env";

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const body = await request.json().catch(() => null) as { email?: unknown; currentPassword?: unknown; newPassword?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const current = typeof body?.currentPassword === "string" ? body.currentPassword : ""; const next = typeof body?.newPassword === "string" ? body.newPassword : "";
  if (next.length < 8) return NextResponse.json({ message: "New password must contain at least 8 characters." }, { status: 400 });
  const derived = await createPasswordHash(next); const now = new Date().toISOString();
  if (email) {
    if (!await verifyAdminUser(email, current).catch(() => false)) return NextResponse.json({ message: "Current email or password is incorrect." }, { status: 401 });
    await getDb().update(adminUsers).set(derived).where(eq(adminUsers.email, email));
    return NextResponse.json({ ok: true });
  }
  const stored = await verifyStoredAdminPassword(current).catch(() => null); const initial = runtimeEnv("ADMIN_PASSWORD");
  if (stored === false || (stored === null && (!initial || !passwordsMatch(current, initial)))) return NextResponse.json({ message: "Current password is incorrect." }, { status: 401 });
  await getDb().insert(adminCredentials).values({ id: 1, ...derived, updatedAt: now }).onConflictDoUpdate({ target: adminCredentials.id, set: { ...derived, updatedAt: now } });
  return NextResponse.json({ ok: true });
}

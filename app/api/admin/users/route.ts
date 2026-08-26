import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { createPasswordHash } from "../../../../db/admin-credentials";
import { adminUsers } from "../../../../db/schema";
import { hasValidMutationOrigin, isAdminAuthenticated } from "../../../admin-auth";
import { primaryAdminUsername } from "../../../../db/admin-authentication";

export async function GET() {
  if (!await isAdminAuthenticated()) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  const additionalUsers = await getDb().select({ id: adminUsers.id, name: adminUsers.name, email: adminUsers.email, active: adminUsers.active, createdAt: adminUsers.createdAt }).from(adminUsers).where(eq(adminUsers.active, true)).orderBy(asc(adminUsers.name));
  const users = [
    { id: "primary-admin", name: primaryAdminUsername, email: null, active: true, createdAt: null, role: "owner", deletable: false },
    ...additionalUsers.map((user) => ({ ...user, role: "manager", deletable: true })),
  ];
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const body = await request.json().catch(() => null) as { name?: unknown; email?: unknown; password?: unknown } | null;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return NextResponse.json({ message: "Enter a name, valid email and password of at least 8 characters." }, { status: 400 });
  try { const derived = await createPasswordHash(password); const user = await getDb().insert(adminUsers).values({ name, email, ...derived, createdAt: new Date().toISOString() }).returning({ id: adminUsers.id, name: adminUsers.name, email: adminUsers.email, active: adminUsers.active, createdAt: adminUsers.createdAt }); return NextResponse.json({ user: user[0] }, { status: 201 }); }
  catch { return NextResponse.json({ message: "This email already exists." }, { status: 409 }); }
}

export async function DELETE(request: Request) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const id = Number(new URL(request.url).searchParams.get("id")); if (!Number.isInteger(id)) return NextResponse.json({ message: "Invalid user." }, { status: 400 });
  await getDb().delete(adminUsers).where(eq(adminUsers.id, id)); return NextResponse.json({ ok: true });
}

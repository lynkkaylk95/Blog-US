import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { runtimeEnv } from "../app/runtime-env";
import { getDb } from "./index";
import { adminCredentials, adminPasswordResets, adminUsers } from "./schema";

const encoder = new TextEncoder();

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function digest(value: string) {
  return base64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value))));
}

async function deriveLegacyPassword(password: string, salt: string) {
  const pepper = runtimeEnv("ADMIN_SESSION_SECRET");
  if (!pepper) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const key = await crypto.subtle.importKey("raw", encoder.encode(pepper), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(`${salt}:${password}`))));
}

const passwordIterations = 100_000;

async function derivePassword(password: string, salt: string, iterations = passwordIterations) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: encoder.encode(salt), iterations }, key, 256);
  return base64Url(new Uint8Array(bits));
}

export async function createPasswordHash(password: string) {
  const saltBytes = new Uint8Array(24); crypto.getRandomValues(saltBytes);
  const salt = base64Url(saltBytes);
  return { passwordSalt: salt, passwordHash: `pbkdf2$${passwordIterations}$${await derivePassword(password, salt)}` };
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i++) mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return mismatch === 0;
}

export async function verifyStoredAdminPassword(password: string) {
  const credential = (await getDb().select().from(adminCredentials).where(eq(adminCredentials.id, 1)).limit(1))[0];
  if (!credential) return null;
  const match = await verifyPassword(password, credential.passwordSalt, credential.passwordHash);
  if (match && !credential.passwordHash.startsWith("pbkdf2$")) await setStoredAdminPassword(password);
  return match;
}

export async function verifyAdminUser(email: string, password: string) {
  const user = (await getDb().select().from(adminUsers).where(eq(adminUsers.email, email.trim().toLowerCase())).limit(1))[0];
  if (!user || !user.active) return false;
  const match = await verifyPassword(password, user.passwordSalt, user.passwordHash);
  if (match && !user.passwordHash.startsWith("pbkdf2$")) await getDb().update(adminUsers).set(await createPasswordHash(password)).where(eq(adminUsers.id, user.id));
  return match;
}

async function verifyPassword(password: string, salt: string, storedHash: string) {
  if (storedHash.startsWith("pbkdf2$")) {
    const [, iterationText, expected] = storedHash.split("$");
    const iterations = Number(iterationText);
    if (!expected || !Number.isInteger(iterations) || iterations < 100_000) return false;
    return safeEqual(await derivePassword(password, salt, iterations), expected);
  }
  return safeEqual(await deriveLegacyPassword(password, salt), storedHash);
}

export async function setStoredAdminPassword(password: string) {
  const derived = await createPasswordHash(password);
  const now = new Date().toISOString();
  await getDb().insert(adminCredentials).values({ id: 1, ...derived, updatedAt: now }).onConflictDoUpdate({ target: adminCredentials.id, set: { ...derived, updatedAt: now } });
}

export async function createPasswordReset() {
  const now = new Date();
  const recent = (await getDb().select().from(adminPasswordResets).orderBy(desc(adminPasswordResets.createdAt)).limit(1))[0];
  if (recent && now.getTime() - Date.parse(recent.createdAt) < 60_000) return null;
  const bytes = new Uint8Array(32); crypto.getRandomValues(bytes);
  const token = base64Url(bytes);
  await getDb().insert(adminPasswordResets).values({ tokenHash: await digest(token), createdAt: now.toISOString(), expiresAt: new Date(now.getTime() + 30 * 60_000).toISOString() });
  return token;
}

export async function resetAdminPassword(token: string, password: string) {
  const tokenHash = await digest(token);
  const now = new Date().toISOString();
  const reset = (await getDb().select().from(adminPasswordResets).where(and(eq(adminPasswordResets.tokenHash, tokenHash), isNull(adminPasswordResets.usedAt), gt(adminPasswordResets.expiresAt, now))).limit(1))[0];
  if (!reset) return false;
  await setStoredAdminPassword(password);
  await getDb().update(adminPasswordResets).set({ usedAt: now }).where(eq(adminPasswordResets.id, reset.id));
  return true;
}

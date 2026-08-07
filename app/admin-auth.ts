import { cookies, headers } from "next/headers";
import { runtimeEnv } from "./runtime-env";

const cookieName = "porchlight_admin";
const lifetimeSeconds = 60 * 60 * 12;

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signature(value: string) {
  const secret = runtimeEnv("ADMIN_SESSION_SECRET");
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return bytesToBase64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))));
}

export async function createAdminToken() {
  const payload = `${Date.now() + lifetimeSeconds * 1000}`;
  return `${payload}.${await signature(payload)}`;
}

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return false;
  const [expires, suppliedSignature] = token.split(".");
  if (!expires || !suppliedSignature || Number(expires) < Date.now()) return false;
  return suppliedSignature === await signature(expires);
}

export function adminCookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/", maxAge: lifetimeSeconds };
}

export { cookieName };

export async function hasValidMutationOrigin() {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const host = requestHeaders.get("host");
  if (!origin || !host) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}

export function passwordsMatch(candidate: string, expected: string) {
  if (candidate.length !== expected.length) return false;
  let mismatch = 0;
  for (let index = 0; index < candidate.length; index++) mismatch |= candidate.charCodeAt(index) ^ expected.charCodeAt(index);
  return mismatch === 0;
}

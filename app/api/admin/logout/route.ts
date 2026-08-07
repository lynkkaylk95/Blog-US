import { NextResponse } from "next/server";
import { cookieName, hasValidMutationOrigin } from "../../../admin-auth";

export async function POST() {
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, "", { path: "/", maxAge: 0 });
  return response;
}

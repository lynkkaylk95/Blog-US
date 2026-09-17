import { NextResponse } from "next/server";
import { hasValidMutationOrigin, isAdminAuthenticated } from "../../../../admin-auth";
import { splitSeries } from "../../series-input";

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  try {
    const input = await request.json() as { contentHtml?: unknown } | null;
    return NextResponse.json(splitSeries(input?.contentHtml));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not analyze chapters." }, { status: 400 });
  }
}

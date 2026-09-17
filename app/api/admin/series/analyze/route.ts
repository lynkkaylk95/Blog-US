import { NextResponse } from "next/server";
import { hasValidMutationOrigin, isAdminAuthenticated } from "../../../../admin-auth";
import { analyzeSeries } from "../../series-input";

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  try {
    const input = await request.json() as { contentHtml?: unknown } | null;
    const parts = analyzeSeries(input?.contentHtml).map(({ partNumber, title, words, readTime, preview }) => ({ partNumber, title, words, readTime, preview }));
    return NextResponse.json({ parts });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not analyze chapters." }, { status: 400 });
  }
}

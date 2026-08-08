import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: unknown; website?: unknown } | null;
  if (!body || typeof body.email !== "string" || !emailPattern.test(body.email) || body.email.length > 254) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }
  if (typeof body.website === "string" && body.website) {
    return NextResponse.json({ message: "You’re on the list." });
  }

  const endpoint = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!endpoint) {
    return NextResponse.json({ message: "Newsletter signup is being connected. Please try again soon." }, { status: 503 });
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: body.email.trim().toLowerCase(), source: "porchlight-stories" }),
  });

  if (!response.ok) {
    return NextResponse.json({ message: "We could not add you right now. Please try again later." }, { status: 502 });
  }
  return NextResponse.json({ message: "Thank you for joining Porchlight Stories." });
}

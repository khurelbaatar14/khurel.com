import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, message } = body;

  // Log for now — wire to email/Telegram later
  console.log("[contact]", { name, email, message });

  return NextResponse.json({ ok: true });
}

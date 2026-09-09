import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY not set");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const { name, email, message } = await req.json();
  const resend = new Resend(key);

  try {
    await resend.emails.send({
      from: "khurel.com <onboarding@resend.dev>",
      to: "khurel@oneplace.hr",
      subject: `New message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] resend error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const escapeHtml = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  try {
    // Created per request so `next build` doesn't need RESEND_API_KEY.
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "khurel.com <onboarding@resend.dev>",
      to: "khurel@oneplace.hr",
      subject: `New message from ${String(name ?? "")}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] resend error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

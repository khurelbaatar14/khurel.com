import { createClient } from "@supabase/supabase-js";
import { connection } from "next/server";

// Supabase pauses free projects after 7 days without database activity. A daily Vercel
// cron (vercel.json) runs this one cheap query so the login never goes to sleep.
export async function GET() {
  await connection();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return Response.json({ ok: false, error: "Supabase is not configured" }, { status: 503 });

  const { error } = await createClient(url, key).from("enrollments").select("course").limit(1);
  if (error) console.error("[keepalive]", error.message);
  return Response.json({ ok: !error }, { status: error ? 500 : 200 });
}

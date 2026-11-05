import { cache } from "react";
import { createClient, isConfigured } from "@/lib/supabase/server";

/** The signed-in visitor (JWT verified), or null. Looked up once per request. */
export const getUser = cache(async () => {
  if (!isConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return null;
  return { id: data.claims.sub, email: data.claims.email as string | undefined };
});

/** Where to go after signing in or out: same-site paths only, so ?next= can't leave the site. */
export function safeNext(next: unknown, fallback = "/courses") {
  return typeof next === "string" && /^\/(?![/\\])/.test(next) ? next : fallback;
}

export const loginHref = (next: string) => `/login?next=${encodeURIComponent(next)}`;

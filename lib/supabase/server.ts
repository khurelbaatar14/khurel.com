import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** False until the Supabase env vars are set; the site then behaves as if nobody is signed in. */
export const isConfigured = Boolean(url && key);

/** Client acting as the visitor, so row-level security applies. Create one per request. */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(url!, key!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Pages can't write cookies; proxy.ts refreshes the session before they render.
        }
      },
    },
  });
}

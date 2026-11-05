import { createClient } from "@supabase/supabase-js";

/**
 * Client with the secret key: bypasses row-level security. Server-only, and only for writes
 * visitors mustn't make themselves (orders, enrollments).
 */
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

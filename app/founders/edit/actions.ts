"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";
import { defaults } from "@/lib/copy";
import { createClient } from "@/lib/supabase/server";

/** Saves edited landing texts; row-level security lets only editors write. */
export async function saveCopy(changes: Record<string, string>): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getUser();
  if (!user) return { ok: false, error: "Дахин нэвтэрнэ үү." };

  const rows = Object.entries(changes)
    .filter(([key, value]) => key in defaults && typeof value === "string")
    .map(([key, value]) => ({ key, value: value.trim().slice(0, 4000), updated_by: user.id, updated_at: new Date().toISOString() }));
  if (!rows.length) return { ok: true };
  if (rows.some((row) => !row.value)) return { ok: false, error: "Хоосон текст хадгалахгүй — ядаж нэг үг бич." };

  const supabase = await createClient();
  const { error } = await supabase.from("site_copy").upsert(rows);
  if (error) {
    // 42501: row-level security refused the write, so this user isn't an editor.
    return { ok: false, error: error.code === "42501" ? "Энэ хуудсыг засах эрх алга." : "Хадгалж чадсангүй. Дахин оролдоно уу." };
  }

  revalidatePath("/founders");
  return { ok: true };
}

"use server";

import { redirect } from "next/navigation";
import { safeNext } from "@/lib/auth";
import { createClient, isConfigured } from "@/lib/supabase/server";

export type LoginState = { step: "email" | "code"; email: string; error?: string };

/**
 * Two-step sign-in: email → 6-digit code (Supabase email OTP, sent through Resend).
 * The submit button's `intent` picks the step: send, verify, or restart with another email.
 */
export async function login(_: LoginState, form: FormData): Promise<LoginState> {
  const intent = form.get("intent");
  const email = String(form.get("email") ?? "").trim().toLowerCase();

  if (intent === "restart") return { step: "email", email };

  if (!isConfigured) return { step: "email", email, error: "Нэвтрэх систем одоогоор ажиллахгүй байна." };
  const supabase = await createClient();

  if (intent === "verify") {
    const token = String(form.get("code") ?? "").replace(/\D/g, "");
    const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    if (error) return { step: "code", email, error: "Код буруу эсвэл хугацаа нь дууссан байна." };
    redirect(safeNext(form.get("next")));
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { step: "email", email, error: "Имэйл хаягаа зөв оруулна уу." };
  }
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) {
    console.error("[login] send code:", error.status, error.message);
    return {
      // "Код дахин авах" is pressed on the code step, which has a code field; stay there.
      step: form.has("code") ? "code" : "email",
      email,
      error:
        error.status === 429
          ? "Хэт олон оролдлого. Түр хүлээгээд дахин оролдоно уу."
          : "Код илгээж чадсангүй. Дахин оролдоно уу.",
    };
  }
  return { step: "code", email };
}

export async function logout(form: FormData) {
  if (isConfigured) await (await createClient()).auth.signOut();
  redirect(safeNext(form.get("next")));
}

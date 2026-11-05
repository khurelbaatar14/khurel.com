"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isEnrolled } from "@/lib/access";
import { getUser, loginHref } from "@/lib/auth";
import { getCourse } from "@/lib/courses";
import { isOrderId, openOrder, settleOrder } from "@/lib/orders";
import { isQPayConfigured } from "@/lib/qpay";
import { createClient } from "@/lib/supabase/server";

/** "Худалдаж авах": signs the visitor in if needed, then opens a QPay invoice for the course. */
export async function buy(_: { error?: string }, form: FormData): Promise<{ error?: string }> {
  const course = await getCourse(String(form.get("course")));
  if (!course) redirect("/courses");

  const here = `/courses/${course.slug}`;
  const user = await getUser();
  if (!user) redirect(loginHref(here));
  if (course.price === 0 || (await isEnrolled(course)) || !isQPayConfigured) redirect(here);

  // QPay calls back to whichever host served this request (production or a preview).
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;

  let orderId: string;
  try {
    orderId = await openOrder(user.id, course, origin);
  } catch (err) {
    console.error("[checkout] open order:", err);
    return { error: "Нэхэмжлэл үүсгэж чадсангүй. Дахин оролдоно уу." };
  }
  redirect(`/checkout/${orderId}`);
}

/**
 * Status of one of the visitor's orders. `ask` also checks with QPay (throttled); without it
 * only the database is read, which picks up payments QPay's callback has already confirmed.
 */
export async function orderStatus(orderId: string, ask: boolean) {
  if (!isOrderId(orderId)) return null;

  // Row-level security: visitors only see their own orders.
  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("status").eq("id", orderId).maybeSingle();
  if (!data) return null;
  if (data.status === "paid" || !ask) return data.status as "pending" | "paid";

  try {
    return await settleOrder(orderId, { throttle: true });
  } catch (err) {
    console.error("[checkout] settle:", err);
    return "pending";
  }
}

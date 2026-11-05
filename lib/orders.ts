import type { Course } from "@/lib/courses";
import { checkInvoice, createInvoice } from "@/lib/qpay";
import { createAdminClient } from "@/lib/supabase/admin";

// Checkout: an order row (supabase/migrations: `orders`) with its own QPay invoice. When QPay
// confirms the invoice is paid, the buyer gets an `enrollments` row and the lessons unlock.

/** A pending order made this recently is reused, so double clicks don't create extra invoices. */
const REUSE_MS = 30 * 60_000;
/** QPay asks merchants not to call payment/check often. */
const CHECK_EVERY_MS = 10_000;

export const isOrderId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id);

/** Returns the ID of a pending order, with a QPay invoice, for this buyer and course. */
export async function openOrder(userId: string, course: Course, origin: string) {
  const db = createAdminClient();

  const { data: recent } = await db
    .from("orders")
    .select("id")
    .eq("user_id", userId)
    .eq("course", course.slug)
    .eq("amount", course.price)
    .eq("status", "pending")
    .not("invoice_id", "is", null)
    .gte("created_at", new Date(Date.now() - REUSE_MS).toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (recent) return recent.id as string;

  const { data: order, error } = await db
    .from("orders")
    .insert({ user_id: userId, course: course.slug, amount: course.price })
    .select("id")
    .single();
  if (error) throw error;

  const invoice = await createInvoice({
    orderId: order.id,
    amount: course.price,
    description: course.title,
    callbackUrl: `${origin}/api/qpay/callback?order=${order.id}`,
  });
  const { error: saveError } = await db
    .from("orders")
    .update({
      invoice_id: invoice.invoice_id,
      qr_image: invoice.qr_image,
      qr_text: invoice.qr_text,
      links: invoice.urls ?? [],
    })
    .eq("id", order.id);
  if (saveError) throw saveError;

  return order.id as string;
}

/**
 * Asks QPay whether an order is paid and, if it is, enrolls the buyer. Safe to call any number
 * of times. Null for an unknown order. `throttle` is for buyer-triggered checks; QPay's own
 * callback must never be skipped, or a payment could go unrecorded.
 */
export async function settleOrder(
  orderId: string,
  { throttle = false } = {},
): Promise<"pending" | "paid" | null> {
  const db = createAdminClient();
  const { data: order } = await db
    .from("orders")
    .select("id, user_id, course, amount, status, invoice_id, checked_at")
    .eq("id", orderId)
    .maybeSingle();
  if (!order?.invoice_id) return null;
  if (order.status === "paid") return "paid";
  if (throttle && order.checked_at && Date.now() - Date.parse(order.checked_at) < CHECK_EVERY_MS) {
    return "pending";
  }

  await db.from("orders").update({ checked_at: new Date().toISOString() }).eq("id", order.id);
  const { paid, paymentId } = await checkInvoice(order.invoice_id);
  if (paid < order.amount) return "pending";

  // Enroll first: if marking the order paid fails, the next check finishes the job.
  const { error } = await db
    .from("enrollments")
    .upsert({ user_id: order.user_id, course: order.course, source: "qpay" }, { ignoreDuplicates: true });
  if (error) throw error;
  await db
    .from("orders")
    .update({ status: "paid", payment_id: paymentId, paid_at: new Date().toISOString() })
    .eq("id", order.id);

  return "paid";
}

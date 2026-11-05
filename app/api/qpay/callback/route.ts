import type { NextRequest } from "next/server";
import { isOrderId, settleOrder } from "@/lib/orders";

// QPay notifies callback_url (set per invoice in lib/orders.ts) after a payment. The request
// itself proves nothing, so settleOrder asks QPay's payment/check before unlocking anything.
// QPay doesn't document the method, so both GET and POST are accepted.
async function handle(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order") ?? "";
  if (!isOrderId(orderId)) return new Response("unknown order", { status: 404 });

  try {
    const status = await settleOrder(orderId);
    if (!status) return new Response("unknown order", { status: 404 });
    return new Response("SUCCESS");
  } catch (err) {
    console.error("[qpay callback]", err);
    return new Response("error", { status: 500 });
  }
}

export { handle as GET, handle as POST };

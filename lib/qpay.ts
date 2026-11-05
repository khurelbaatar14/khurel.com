// QPay Merchant API v2 (developer.qpay.mn). Sandbox and production differ only by host:
// https://merchant-sandbox.qpay.mn vs https://merchant.qpay.mn. The public docs don't describe
// responses, so the shapes below are what the API returns in practice; check them against
// real sandbox responses when credentials arrive.

const host = process.env.QPAY_URL ?? "https://merchant.qpay.mn";
const username = process.env.QPAY_USERNAME;
const password = process.env.QPAY_PASSWORD;
const invoiceCode = process.env.QPAY_INVOICE_CODE;

export const isQPayConfigured = Boolean(username && password && invoiceCode && process.env.SUPABASE_SECRET_KEY);

export type BankLink = { name: string; description: string; logo: string; link: string };

type Invoice = { invoice_id: string; qr_text: string; qr_image: string; urls?: BankLink[] };
type PaymentCheck = { rows?: { payment_id: string; payment_status: string; payment_amount: number | string }[] };

let token: { value: string; expiresAt: number } | null = null;

// QPay asks merchants not to fetch tokens over and over, so one is reused until just before it expires.
async function accessToken() {
  if (token && Date.now() < token.expiresAt) return token.value;

  const res = await fetch(`${host}/v2/auth/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`QPay auth: ${res.status} ${await res.text()}`);
  const data = await res.json();

  // `expires_in` isn't documented; accept a unix timestamp or seconds from now.
  const expiresIn = Number(data.expires_in) || 3600;
  const expiresAt = expiresIn > 1e9 ? expiresIn * 1000 : Date.now() + expiresIn * 1000;
  token = { value: data.access_token, expiresAt: expiresAt - 60_000 };
  return token.value;
}

async function call<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${host}/v2${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${await accessToken()}` },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`QPay ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

/** `orderId` doubles as QPay's sender_invoice_no, which must be unique per invoice. */
export function createInvoice(input: { orderId: string; amount: number; description: string; callbackUrl: string }) {
  return call<Invoice>("/invoice", {
    invoice_code: invoiceCode,
    sender_invoice_no: input.orderId,
    invoice_receiver_code: "terminal",
    invoice_description: input.description.slice(0, 100),
    amount: input.amount,
    callback_url: input.callbackUrl,
  });
}

/** How much has been paid on an invoice so far, and the first payment's ID. */
export async function checkInvoice(invoiceId: string) {
  const data = await call<PaymentCheck>("/payment/check", {
    object_type: "INVOICE",
    object_id: invoiceId,
    offset: { page_number: 1, page_limit: 100 },
  });
  const paid = (data.rows ?? []).filter((row) => row.payment_status === "PAID");
  return {
    paid: paid.reduce((sum, row) => sum + Number(row.payment_amount), 0),
    paymentId: paid[0]?.payment_id,
  };
}

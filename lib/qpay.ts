// QPay Quick QR: the vendor API benzin.mn takes payments through in production; its
// backend/qpay.py is where the request and answer shapes below come from (QPay's public docs
// don't describe them).
//
// QPAY_QUICKQR holds the login as one JSON value, the same shape as benzin's `benzin-qpay`
// secret: {base_url, username, password, terminal_id, branch_code, merchant_id, mcc}.
// Every invoice names the bank account the money goes to (QPAY_PAYOUT_*), and an invoice
// QPay binds to any other account is cancelled before its QR is shown.

const KEYS = ["base_url", "username", "password", "terminal_id", "branch_code", "merchant_id", "mcc"] as const;
type Config = Record<(typeof KEYS)[number], string>;

function readConfig(): Config | null {
  try {
    const conf = JSON.parse(process.env.QPAY_QUICKQR ?? "");
    return KEYS.every((k) => String(conf?.[k] ?? "").trim()) ? conf : null;
  } catch {
    return null;
  }
}

const conf = readConfig();
const payout = {
  account_bank_code: process.env.QPAY_PAYOUT_BANK_CODE?.trim() ?? "",
  account_number: process.env.QPAY_PAYOUT_ACCOUNT?.trim() ?? "",
  account_name: process.env.QPAY_PAYOUT_NAME?.trim() ?? "",
};
// A plain bank number, never an IBAN: QPay given an IBAN can bind a different beneficiary.
const payoutValid =
  /^\d{6}$/.test(payout.account_bank_code) && /^\d{5,12}$/.test(payout.account_number) && payout.account_name !== "";

export const isQPayConfigured = Boolean(conf && payoutValid && process.env.SUPABASE_SECRET_KEY);

export type BankLink = { name: string; description: string; logo: string; link: string };

type Invoice = {
  id?: string;
  invoice_id?: string;
  qr_image?: string;
  qr_text?: string;
  qr_code?: string;
  urls?: BankLink[];
  invoice_bank_accounts?: { account_bank_code: string; account_number: string }[];
};
type PaymentCheck = { payments?: { id: string; payment_status: string; amount: string | number }[] };

let token: { value: string; expiresAt: number } | null = null;

// QPay asks merchants not to fetch tokens over and over; they last about twelve hours.
async function accessToken(stale?: string) {
  if (token && token.value !== stale && Date.now() < token.expiresAt) return token.value;

  const res = await fetch(`${conf!.base_url.replace(/\/$/, "")}/v2/auth/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${conf!.username}:${conf!.password}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ terminal_id: conf!.terminal_id }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`QPay token: ${res.status}`);
  const value = String((await res.json()).access_token ?? "");
  if (!value) throw new Error("QPay token: no access_token");

  token = { value, expiresAt: Date.now() + 11 * 3600_000 };
  return value;
}

async function call<T>(method: "POST" | "DELETE", path: string, body?: unknown): Promise<T> {
  if (!conf) throw new Error("QPay is not configured");
  const url = `${conf.base_url.replace(/\/$/, "")}/v2${path}`;

  let bearer = await accessToken();
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${bearer}` },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
    // A token that went stale early: one new one, one more try.
    if (res.status === 401 && attempt === 1) {
      bearer = await accessToken(bearer);
      continue;
    }
    // Only the status: a created invoice's body carries the QR.
    if (!res.ok) throw new Error(`QPay ${method} ${path.split("/")[1]}: ${res.status}`);
    const text = await res.text();
    return (text ? JSON.parse(text) : {}) as T;
  }
}

export function cancelInvoice(invoiceId: string) {
  return call("DELETE", `/invoice/${encodeURIComponent(invoiceId)}`);
}

export async function createInvoice(input: { amount: number; description: string; callbackUrl: string }) {
  const invoice = await call<Invoice>("POST", "/invoice", {
    merchant_id: conf!.merchant_id,
    amount: input.amount,
    currency: "MNT",
    customer_name: "khurel.com",
    callback_url: input.callbackUrl,
    description: input.description.replace(/\s+/g, " ").slice(0, 120),
    branch_code: conf!.branch_code,
    mcc_code: conf!.mcc,
    bank_accounts: [{ ...payout, is_default: true }],
  });

  const invoiceId = String(invoice.id ?? invoice.invoice_id ?? "");
  if (!invoiceId) throw new Error("QPay invoice: no id");

  const bound = invoice.invoice_bank_accounts;
  if (
    bound &&
    !(bound.length === 1 &&
      bound[0].account_bank_code === payout.account_bank_code &&
      bound[0].account_number === payout.account_number)
  ) {
    await cancelInvoice(invoiceId).catch((err) => console.error("[qpay] cancel:", err));
    throw new Error(`QPay invoice ${invoiceId} bound another bank account; cancelled`);
  }

  return {
    invoiceId,
    qrImage: invoice.qr_image ?? "",
    qrText: invoice.qr_text ?? invoice.qr_code ?? "",
    links: invoice.urls ?? [],
  };
}

/** How much has been paid on an invoice so far, and the first payment's ID. */
export async function checkInvoice(invoiceId: string) {
  const data = await call<PaymentCheck>("POST", "/payment/check", { invoice_id: invoiceId });
  const paid = (data.payments ?? []).filter((p) => p.payment_status === "SUCCESS");
  return {
    // Amounts come back as strings ("5000.00").
    paid: paid.reduce((sum, p) => sum + (Math.floor(Number(p.amount)) || 0), 0),
    paymentId: paid[0]?.id,
  };
}

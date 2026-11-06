"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { orderStatus } from "@/app/checkout/actions";
import { Button } from "@/components/ui/button";

// Watches a pending order until it's paid, then re-renders the page in its paid state.
// Every few seconds it reads the database (QPay's callback flips the status); every third
// time, and whenever the buyer presses the button or comes back from their bank app, it also
// asks QPay, in case the callback is late. When the QR expires the page re-renders to offer a
// new one; a payment that lands after that still counts.
const POLL_MS = 4000;
const ASK_EVERY = 3;

export default function PaymentWatcher({ orderId, expiresAt }: { orderId: string; expiresAt?: number }) {
  const router = useRouter();
  const [checking, startCheck] = useTransition();
  const [notYet, setNotYet] = useState(false);

  const check = useCallback(
    async (ask: boolean) => {
      const status = await orderStatus(orderId, ask);
      if (status === "paid") router.refresh();
      return status;
    },
    [orderId, router],
  );

  useEffect(() => {
    let tick = 0;
    const timer = setInterval(() => check(++tick % ASK_EVERY === 0), POLL_MS);
    const expiry = expiresAt ? setTimeout(() => router.refresh(), Math.max(0, expiresAt - Date.now())) : undefined;
    const onVisible = () => document.visibilityState === "visible" && check(true);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      clearTimeout(expiry);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [check, expiresAt, router]);

  return (
    <div className="space-y-2 text-center">
      <p className="text-sm text-muted-foreground animate-pulse">Төлбөр хүлээж байна…</p>
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        disabled={checking}
        onClick={() =>
          startCheck(async () => {
            setNotYet((await check(true)) !== "paid");
          })
        }
      >
        {checking ? "Шалгаж байна…" : "Төлбөрөө шалгах"}
      </Button>
      {notYet && !checking && (
        <p className="text-xs text-muted-foreground">Төлбөр хараахан ороогүй байна. Хэдэн секундын дараа дахин шалгаарай.</p>
      )}
    </div>
  );
}

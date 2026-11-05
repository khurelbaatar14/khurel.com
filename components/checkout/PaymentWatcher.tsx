"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { orderStatus } from "@/app/checkout/actions";
import { Button } from "@/components/ui/button";

// Watches a pending order until it's paid, then re-renders the page in its paid state.
// The cheap database read runs every few seconds (QPay's callback flips the status); QPay
// itself is only asked when the buyer presses the button or comes back from their bank app.
const POLL_MS = 4000;

export default function PaymentWatcher({ orderId }: { orderId: string }) {
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
    const timer = setInterval(() => check(false), POLL_MS);
    const onVisible = () => document.visibilityState === "visible" && check(true);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [check]);

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

"use client";

import { useActionState } from "react";
import { buy } from "@/app/checkout/actions";
import { Button } from "@/components/ui/button";

export default function BuyButton({ course, label = "Худалдаж авах" }: { course: string; label?: string }) {
  const [state, action, pending] = useActionState(buy, {});

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="course" value={course} />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Нэхэмжлэл үүсгэж байна…" : label}
      </Button>
      {state.error && (
        <p role="alert" className="text-xs text-destructive text-center">
          {state.error}
        </p>
      )}
    </form>
  );
}

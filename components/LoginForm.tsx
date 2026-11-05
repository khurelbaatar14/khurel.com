"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initial: LoginState = { step: "email", email: "" };
const link = "text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      {state.step === "email" ? (
        <>
          <label className="block space-y-2">
            <span className="text-sm font-medium">Имэйл хаяг</span>
            <Input
              name="email"
              type="email"
              required
              autoFocus
              autoComplete="email"
              defaultValue={state.email}
              placeholder="name@example.com"
              className="h-11"
            />
          </label>
          <Button type="submit" name="intent" value="send" size="lg" className="w-full h-11" disabled={pending}>
            {pending ? "Илгээж байна…" : "Код авах"}
          </Button>
        </>
      ) : (
        <>
          <input type="hidden" name="email" value={state.email} />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{state.email}</span> хаяг руу нэвтрэх код илгээлээ.
            Ирэхгүй бол Spam хавтсаа шалгаарай.
          </p>
          <label className="block space-y-2">
            <span className="text-sm font-medium">Код</span>
            <Input
              name="code"
              required
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6,10}"
              maxLength={10}
              className="h-12 text-center text-2xl font-semibold tracking-[0.4em]"
            />
          </label>
          {/* First submit button, so Enter verifies. */}
          <Button type="submit" name="intent" value="verify" size="lg" className="w-full h-11" disabled={pending}>
            {pending ? "Шалгаж байна…" : "Нэвтрэх"}
          </Button>
          <div className="flex justify-between text-sm">
            <button type="submit" name="intent" value="restart" formNoValidate disabled={pending} className={link}>
              Өөр имэйл ашиглах
            </button>
            <button type="submit" name="intent" value="send" formNoValidate disabled={pending} className={link}>
              Код дахин авах
            </button>
          </div>
        </>
      )}

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}

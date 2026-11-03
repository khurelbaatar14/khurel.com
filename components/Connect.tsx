"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function Connect() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.ok) {
        setSubmitted(true);
        reset();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Холбоо барих</h2>
        <p className="text-muted-foreground text-lg">
          Бичээрэй — ирсэн мессеж бүрийг би өөрөө уншдаг.
        </p>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <CheckCircle className="w-14 h-14 text-emerald-500" />
          <p className="text-xl font-semibold">Мессеж хүлээн авлаа!</p>
          <p className="text-muted-foreground">Удахгүй хариу бичнэ.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-sm text-primary hover:underline mt-2"
          >
            Дахин мессеж илгээх
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-lg flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Нэр
            </label>
            <Input
              id="name"
              placeholder="Таны нэр"
              {...register("name", { required: "Нэрээ оруулна уу" })}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Имэйл
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Имэйлээ оруулна уу",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Зөв имэйл хаяг оруулна уу",
                },
              })}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-sm font-medium">
              Мессеж
            </label>
            <Textarea
              id="message"
              placeholder="Юу бодож байна?"
              rows={5}
              {...register("message", { required: "Мессежээ бичнэ үү" })}
              className={errors.message ? "border-destructive" : ""}
            />
            {errors.message && (
              <p className="text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>

          <Button type="submit" disabled={submitting} className="w-full gap-2">
            <Send className="w-4 h-4" />
            {submitting ? "Илгээж байна…" : "Илгээх"}
          </Button>

          {error && (
            <p className="text-sm text-destructive text-center">
              Алдаа гарлаа. Дахин оролдох эсвэл шууд имэйлээр бичнэ үү:{" "}
              <a href="mailto:khurel@oneplace.hr" className="underline">
                khurel@oneplace.hr
              </a>
            </p>
          )}
        </form>
      )}
    </div>
  );
}

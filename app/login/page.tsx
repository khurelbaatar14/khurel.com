import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import { getUser, safeNext } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Нэвтрэх | Хүрэлбаатар",
  robots: { index: false },
};

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const next = safeNext((await searchParams).next);
  if (await getUser()) redirect(next);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-sm mx-auto px-6 py-16">
        <Link
          href={next}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Буцах
        </Link>

        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Нэвтрэх</h1>
          <p className="text-muted-foreground">Имэйл хаягаа оруулаад, ирсэн кодоор нэвтэрнэ. Нууц үг хэрэггүй.</p>
        </div>

        <LoginForm next={next} />
      </div>
    </main>
  );
}

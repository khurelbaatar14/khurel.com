import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-sm font-semibold tracking-widest text-muted-foreground">404</p>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Хуудас олдсонгүй</h1>
      <p className="text-muted-foreground">Таны хайсан хуудас байхгүй эсвэл зөөгдсөн байна.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Нүүр хуудас руу буцах
      </Link>
    </main>
  );
}

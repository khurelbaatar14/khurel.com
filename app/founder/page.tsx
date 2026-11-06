import type { Metadata } from "next";
import { Onest } from "next/font/google";
import FounderPath from "@/components/founder/FounderPath";

// Modern display face for headings. Checked to have the Mongolian letters Ө and Ү, which many
// display fonts lack.
const onest = Onest({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Founder Path | Хүрэлбаатар",
  description:
    "Hacker, hipster эсвэл hustler — үүргээ сонгоод стартапдаа яг одоо юу хийхээ алхам алхмаар мэд.",
};

export default function FounderPage() {
  return (
    <main className={onest.variable}>
      <FounderPath />
    </main>
  );
}

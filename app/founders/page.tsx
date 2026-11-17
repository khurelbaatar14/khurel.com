import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import FounderPath from "@/components/founder/FounderPath";

// Tight, heavy grotesk for the whole app. Its cyrillic-ext subset has the Mongolian Ө and Ү.
const font = Inter_Tight({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "DIIL for startups",
  description: "Үүргээ сонго, стартапынхаа шатыг сонго — видео үзэж, даалгавар хийж, оч цуглуулаад үүсгэн байгуулагчидтай уулз.",
};

export default function FounderPage() {
  return (
    <main className={font.variable}>
      <FounderPath />
    </main>
  );
}

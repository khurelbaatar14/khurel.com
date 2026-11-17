import { Inter_Tight } from "next/font/google";

// Tight, heavy grotesk for the whole app. Its cyrillic-ext subset has the Mongolian Ө and Ү.
const font = Inter_Tight({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-display",
});

export default function FoundersLayout({ children }: { children: React.ReactNode }) {
  return <main className={font.variable}>{children}</main>;
}

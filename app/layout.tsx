import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://khurel.com"),
  title: "Khurelbaatar",
  description: "Engineer. Entrepreneur. — Personal site of Khurelbaatar.",
  openGraph: {
    siteName: "Khurelbaatar",
    images: [{ url: "/photos/avatar.png" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        {children}
      </body>
      <GoogleAnalytics gaId="G-MNHP2PT5XP" />
    </html>
  );
}

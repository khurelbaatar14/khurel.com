import type { Metadata } from "next";
import Link from "next/link";
import Connect from "@/components/Connect";
import { Mail, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — Khurelbaatar",
  description:
    "Reach out to Khurelbaatar. Product ideas, intros, partnerships, or just to say hello.",
  openGraph: {
    title: "Contact — Khurelbaatar",
    description:
      "Reach out to Khurelbaatar. Product ideas, intros, partnerships, or just to say hello.",
    images: [{ url: "/photos/avatar.png" }],
  },
  twitter: { card: "summary_large_image" },
};

const LinkedInIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const channels = [
  {
    label: "Email",
    handle: "khurel@oneplace.hr",
    href: "mailto:khurel@oneplace.hr",
    icon: <Mail className="w-4 h-4" aria-hidden="true" />,
  },
  {
    label: "LinkedIn",
    handle: "khurelbaatarba",
    href: "https://www.linkedin.com/in/khurelbaatarba/",
    icon: <LinkedInIcon />,
  },
  {
    label: "Instagram",
    handle: "@khurelbb",
    href: "https://www.instagram.com/khurelbb",
    icon: <InstagramIcon />,
  },
];

export default function ContactPage() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="w-full max-w-3xl mx-auto px-6 pt-10 pb-24 flex flex-col gap-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <Connect />

        <div className="w-full flex flex-col gap-5">
          <p className="text-sm font-medium tracking-wide uppercase text-muted-foreground text-center">
            Or find me here
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {channels.map(({ label, handle, href, icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5 hover:border-foreground/40 hover:bg-muted/40 transition-all"
                >
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                    {icon}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium truncate">{handle}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

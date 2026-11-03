import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { categories, formatDate, getArticle, getSlugs } from "@/lib/articles";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { meta } = await getArticle((await params).slug);
  return {
    title: `${meta.title} | Khurelbaatar`,
    description: meta.description,
    openGraph: meta.cover ? { images: [{ url: meta.cover }] } : undefined,
    twitter: { card: "summary_large_image" },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { meta, Content } = await getArticle((await params).slug);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <header className="mb-12 space-y-4">
          <span
            className={`text-xs font-semibold tracking-widest uppercase ${categories[meta.category].text}`}
          >
            {meta.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">{meta.title}</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">{meta.description}</p>
          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
              K
            </div>
            <div>
              <p className="text-sm font-medium">Khurelbaatar</p>
              <p className="text-xs text-muted-foreground">{formatDate(meta.date)}</p>
            </div>
          </div>
        </header>

        <article className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-base prose-headings:font-bold prose-headings:tracking-tight">
          <Content />
        </article>

        <hr className="border-border mt-12 mb-8" />

        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all articles
        </Link>
      </div>
    </main>
  );
}

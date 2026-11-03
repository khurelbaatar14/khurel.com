import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import { getArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Writing | Khurelbaatar",
  description: "Articles by Khurelbaatar on startups, policy and building in Mongolia.",
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>

        <div className="mb-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Writing</h1>
          <p className="text-muted-foreground text-lg">Things I think about and write about</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </main>
  );
}

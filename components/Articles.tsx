import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import { getArticles } from "@/lib/articles";

const HOME_LIMIT = 6;

export default async function Articles() {
  const articles = await getArticles();

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center gap-10 px-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Writing</h2>
        <p className="text-muted-foreground text-lg">Things I think about and write about</p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.slice(0, HOME_LIMIT).map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      <Link
        href="/articles"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        All articles
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { categories, formatDate, type ArticleSummary } from "@/lib/articles";

export default function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group rounded-2xl border border-border/60 overflow-hidden bg-background hover:border-border hover:shadow-md transition-all duration-200 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="aspect-[16/9] bg-muted overflow-hidden">
        {article.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <span className="text-white/20 text-4xl font-black select-none">01</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-5 flex-1">
        <div className="flex items-center justify-between">
          <Badge className={`${categories[article.category].badge} border-0 font-medium text-xs`}>
            {article.category}
          </Badge>
          <span className="text-xs text-muted-foreground">{formatDate(article.date)}</span>
        </div>
        <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {article.description}
        </p>
      </div>
    </Link>
  );
}

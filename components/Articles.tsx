import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Article = {
  badge: string;
  badgeClass: string;
  title: string;
  description: string;
  date: string;
  url: string;
  thumbnail?: string;
};

const articles: Article[] = [
  {
    badge: "Ecosystem",
    badgeClass: "bg-orange-500/10 text-orange-600",
    title: "Mongolia's Startup Policy Is Years Behind. Here's the Data.",
    description:
      "Kazakhstan built a functioning startup ecosystem with clear tax policy and measurable targets. Mongolia has neither. The gap is widening.",
    date: "Jun 12, 2025",
    url: "/articles/mongolia-startup-ecosystem",
    thumbnail: "/photos/astana1.jpeg",
  },
  {
    badge: "Ecosystem",
    badgeClass: "bg-orange-500/10 text-orange-600",
    title: "I Presented This Slide to the Prime Minister",
    description:
      "59% vs 0%. I showed Mongolia's Prime Minister exactly how far behind we are on startup tax burden — and asked him to fix it.",
    date: "Aug 26, 2025",
    url: "/articles/presenting-to-the-prime-minister",
    thumbnail: "/photos/pm-slide.png",
  },
  {
    badge: "Ecosystem",
    badgeClass: "bg-orange-500/10 text-orange-600",
    title: "I Asked Parliament to Do One Thing",
    description:
      "Mongolia's Social Security contribution drains startups before they reach revenue. I asked Parliament to fix just this — one clause, this year.",
    date: "April 2026",
    url: "/articles/parliament-social-security",
    thumbnail: undefined,
  },
  {
    badge: "Ecosystem",
    badgeClass: "bg-orange-500/10 text-orange-600",
    title: "We Became an IT Park Uzbekistan Resident. Here's Why That Indicts Mongolia.",
    description:
      "OnePlaceHR Technologies now pays zero tax until 2040 through IT Park Uzbekistan. The business logic for routing investment there instead of Mongolia writes itself.",
    date: "Nov 6, 2025",
    url: "/articles/itpark-uzbekistan",
    thumbnail: "/photos/itparkuz1.png",
  },
  {
    badge: "Politics",
    badgeClass: "bg-emerald-500/10 text-emerald-600",
    title: "The Morning I Felt Power Belong to the People",
    description:
      "After ex-PM Oyun-Erdene stepped down, I stood in Sukhbaatar Square until midnight. This is what I saw — and what it made me believe.",
    date: "May 2024",
    url: "/articles/the-protest",
    thumbnail: "/photos/protest2.png",
  },
];

export default function Articles() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center gap-10 px-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Writing</h2>
        <p className="text-muted-foreground text-lg">Things I think about and write about</p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article) => (
          <Link
            key={article.url}
            href={article.url}
            className="group rounded-2xl border border-border/60 overflow-hidden bg-background hover:border-border hover:shadow-md transition-all duration-200 flex flex-col"
          >
            {/* Thumbnail */}
            <div className="aspect-[16/9] bg-muted overflow-hidden">
              {article.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.thumbnail}
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
                <Badge className={`${article.badgeClass} border-0 font-medium text-xs`}>
                  {article.badge}
                </Badge>
                <span className="text-xs text-muted-foreground">{article.date}</span>
              </div>
              <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                {article.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

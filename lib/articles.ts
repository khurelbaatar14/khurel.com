import fs from "node:fs";
import path from "node:path";

// Articles live in content/articles/<slug>.mdx. Each file exports `meta`;
// adding a file is all it takes to publish (the URL is /articles/<slug>).

export const categories = {
  "Стартап экосистем": { badge: "bg-orange-500/10 text-orange-600", text: "text-orange-500" },
  "Улс төр": { badge: "bg-emerald-500/10 text-emerald-600", text: "text-emerald-600" },
};

export type ArticleMeta = {
  title: string;
  description: string;
  /** YYYY, YYYY-MM or YYYY-MM-DD; shown at the precision given. */
  date: string;
  category: keyof typeof categories;
  /** Card thumbnail and social preview image. */
  cover?: string;
};

export type ArticleSummary = ArticleMeta & { slug: string };

const dir = path.join(process.cwd(), "content", "articles");

export function getSlugs() {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.slice(0, -".mdx".length));
}

export async function getArticle(slug: string) {
  const mod = await import(`@/content/articles/${slug}.mdx`);
  return { slug, meta: mod.meta as ArticleMeta, Content: mod.default as React.ComponentType };
}

/** Newest first. */
export async function getArticles(): Promise<ArticleSummary[]> {
  const all = await Promise.all(getSlugs().map(getArticle));
  return all
    .map(({ slug, meta }) => ({ slug, ...meta }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** "2025-06-12" → "2025 оны 6-р сарын 12", "2026-04" → "2026 оны 4-р сар", "2026" → "2026". */
export function formatDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  if (!m) return String(y);
  return d ? `${y} оны ${m}-р сарын ${d}` : `${y} оны ${m}-р сар`;
}

import { createClient } from "@supabase/supabase-js";
import { perks } from "@/lib/diil";
import { founderTypes } from "@/lib/founder";
import { modules } from "@/lib/founder-course";

// The texts on the /founders landing that can be edited in the browser at /founders/edit, without a
// deploy (stored in the site_copy table). These defaults show until a text is saved, and whenever
// the database can't be reached. Words wrapped in *stars* are highlighted.

export type Copy = Record<string, string>;

const first = modules.find((m) => m.id === "startup")!;

export const defaults: Copy = {
  "hero.badge": "DIIL for startups",
  "hero.title": "Чиний стартапыг *дараагийн шатанд* гаргая",
  "hero.sub": "Өөрийн бизнесээ эхлүүлж гайхалтай түүх эндээс эхлүүлээрэй.",
  "hero.start": "Эхлэх",
  "hero.watch": "Эхний хичээл үзэх",
  "roles.title": "Чиний роль юу вэ?",
  "roles.sub": "Нэгийг нь сонго — чамд тохирсон замыг гаргаад өгье. Дараа нь сольж болно.",
  "roles.pick": "Сонгох",
  ...Object.fromEntries(founderTypes.map((t) => [`role.${t.id}`, t.strength])),
  "lesson.title": "Хамгийн эхний хичээл үзэх",
  "lesson.sub": `${first.title} ${first.promise}`,
  ...Object.fromEntries(first.points.map((point, i) => [`lesson.point.${i + 1}`, point])),
  "lesson.cta": "Роль сонгоод үргэлжлүүл",
  "perks.title": "Бусад давуу тал",
  "perks.sub": "Хичээлээс гадна. Оч цуглуулах тусам шинэ боломж нээгдэнэ.",
  ...Object.fromEntries(perks.flatMap((p) => [[`perk.${p.id}.title`, p.title], [`perk.${p.id}.body`, p.body]])),
};

/** The landing's texts: the saved ones over the defaults. */
export async function getCopy(): Promise<Copy> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return defaults;
  try {
    // No cookies: anyone may read the copy, and the public page stays static.
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase.from("site_copy").select("key, value");
    if (error || !data) return defaults;
    const saved = Object.fromEntries(data.filter((row) => row.key in defaults).map((row) => [row.key, row.value]));
    return { ...defaults, ...saved };
  } catch {
    return defaults;
  }
}

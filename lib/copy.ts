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
  // The four stages as stairs, below the role cards. Amounts are rough guides.
  "stairs.title": "Стартапын 4 шат",
  "stairs.sub": "Шат бүрт чиний зорилго — *дараагийн шат руу гарах*. Шат бүрт өөр ур чадвар, өөр баг, өөр хэмжээний хөрөнгө хэрэгтэй.",
  "stairs.note": "Хөрөнгийн дүн нь ойролцоо жишиг.",
  "stair.1.name": "Idea",
  "stair.1.desc": "Толгойд чинь санаа байна. Хэн, ямар асуудалтай байгааг ойлгохын тулд хүмүүстэй ярьж байна.",
  "stair.1.goal": "Шалгасан санаагаа MVP болгох.",
  "stair.1.skills": "Хүмүүстэй ярих, асуудал олох, таамаглал шалгах",
  "stair.1.team": "1–3 үүсгэн байгуулагч",
  "stair.1.money": "Өөрийн мөнгө · 0–5 сая₮",
  "stair.2.name": "MVP / Prototype",
  "stair.2.desc": "Санаагаа хамгийн жижиг, ажилладаг хувилбар болгоод хүмүүст үзүүлж байна.",
  "stair.2.goal": "Анхны төлбөртэй хэрэглэгчдээ олох.",
  "stair.2.skills": "Хурдан бүтээх, дизайн, хэрэглэгчийн санал сонсох",
  "stair.2.team": "Үүсгэн байгуулагчид + 1–2 хөгжүүлэгч, дизайнер",
  "stair.2.money": "Найз, гэр бүл, сахиусан тэнгэр · 10–100 сая₮",
  "stair.3.name": "PMF / Анхны борлуулалт",
  "stair.3.desc": "Хүмүүс мөнгөө төлж авч эхэлсэн. Бүтээгдэхүүн чинь хэрэгтэй гэдэг нь батлагдаж байна.",
  "stair.3.goal": "Дахин дахин зарж болдог аргаа олох.",
  "stair.3.skills": "Борлуулалт, үнэ тогтоох, хэрэглэгчээ баярлуулах",
  "stair.3.team": "5–10 хүн: борлуулалт, хэрэглэгчийн туслах",
  "stair.3.money": "Сахиусан тэнгэр, seed хөрөнгө · 100 сая–1 тэрбум₮",
  "stair.4.name": "Scale",
  "stair.4.desc": "Зарах арга чинь давтагддаг болсон. Одоо хурдан томорч, олон хүнд хүрэх үе.",
  "stair.4.goal": "Зах зээлээ тэргүүлж, шинэ зах зээлд гарах.",
  "stair.4.skills": "Баг удирдах, систем бүтээх, хөрөнгө босгох",
  "stair.4.team": "10+ хүн, чиглэл бүрт эзэн",
  "stair.4.money": "Venture capital · 1 тэрбум₮+",
  "lesson.title": "Хамгийн эхний хичээл үзэх",
  "lesson.sub": `${first.title} ${first.promise}`,
  ...Object.fromEntries(first.points.map((point, i) => [`lesson.point.${i + 1}`, point])),
  "lesson.cta": "Роль сонгоод үргэлжлүүл",
  "perks.title": "Бусад давуу тал",
  "perks.sub": "Хичээлээс гадна. Оноо цуглуулах тусам шинэ боломж нээгдэнэ.",
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

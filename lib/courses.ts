import fs from "node:fs";
import path from "node:path";

// Courses live in content/courses/<course>/. index.mdx exports the course `meta` and holds the
// landing-page copy; every NN-<lesson>.mdx next to it is a lesson, ordered by NN.
// The URL drops the number: 01-intro.mdx → /courses/<course>/intro.

export type CourseMeta = {
  title: string;
  description: string;
  /** In MNT; 0 makes every lesson free. */
  price: number;
  /** Card thumbnail and social preview image. */
  cover?: string;
  /** Only `next dev` shows it, so unfinished courses stay off the live site. */
  draft?: boolean;
};

export type LessonMeta = {
  title: string;
  /** "m:ss" or "h:mm:ss". */
  duration: string;
  /** Bunny Stream video ID; leave out until the video is uploaded. */
  video?: string;
  /** Free preview: anyone can watch it without buying the course. */
  free?: boolean;
};

export type Lesson = LessonMeta & { slug: string; number: number; file: string };
export type Course = NonNullable<Awaited<ReturnType<typeof getCourse>>>;

const dir = path.join(process.cwd(), "content", "courses");
const showDrafts = process.env.NODE_ENV === "development";

// Slugs come from the URL, so check them before they reach the filesystem.
const isSlug = (s: string) => /^[a-z0-9-]+$/.test(s);

const load = (course: string, file: string) => import(`@/content/courses/${course}/${file}.mdx`);

function lessonFiles(course: string) {
  return fs
    .readdirSync(path.join(dir, course))
    .filter((f) => /^\d+-[a-z0-9-]+\.mdx$/.test(f))
    .map((f) => f.slice(0, -".mdx".length))
    .sort((a, b) => parseInt(a) - parseInt(b));
}

/** Null for unknown courses, and for drafts outside `next dev`. */
export async function getCourse(slug: string) {
  if (!isSlug(slug) || !fs.existsSync(path.join(dir, slug, "index.mdx"))) return null;

  const mod = await load(slug, "index");
  const meta = mod.meta as CourseMeta;
  if (meta.draft && !showDrafts) return null;

  const lessons: Lesson[] = await Promise.all(
    lessonFiles(slug).map(async (file, i) => ({
      ...((await load(slug, file)).meta as LessonMeta),
      slug: file.replace(/^\d+-/, ""),
      number: i + 1,
      file,
    })),
  );

  return { slug, ...meta, lessons, Content: mod.default as React.ComponentType };
}

export async function getCourses() {
  const all = await Promise.all(fs.readdirSync(dir).map(getCourse));
  return all.filter((c) => c !== null);
}

export async function getLesson(courseSlug: string, lessonSlug: string) {
  const course = await getCourse(courseSlug);
  const i = course?.lessons.findIndex((l) => l.slug === lessonSlug) ?? -1;
  if (!course || i < 0) return null;

  const lesson = course.lessons[i];
  const mod = await load(course.slug, lesson.file);
  return {
    course,
    lesson,
    Content: mod.default as React.ComponentType,
    prev: course.lessons[i - 1],
    next: course.lessons[i + 1],
  };
}

const seconds = (duration: string) => duration.split(":").reduce((s, n) => s * 60 + Number(n), 0);

/** Total running time: "1 цаг 25 мин", "45 мин". */
export function totalDuration(lessons: Lesson[]) {
  const minutes = Math.round(lessons.reduce((s, l) => s + seconds(l.duration), 0) / 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} мин`;
  return m ? `${h} цаг ${m} мин` : `${h} цаг`;
}

/** 149000 → "149,000₮", 0 → "Үнэгүй". */
export function formatPrice(mnt: number) {
  return mnt ? `${mnt.toLocaleString("en-US")}₮` : "Үнэгүй";
}

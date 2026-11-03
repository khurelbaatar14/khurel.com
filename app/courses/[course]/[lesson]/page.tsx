import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft, ArrowRight, Clapperboard, Lock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import LessonList from "@/components/course/LessonList";
import { canWatch } from "@/lib/access";
import { signedEmbedUrl } from "@/lib/bunny";
import { getLesson } from "@/lib/courses";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ course: string; lesson: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course, lesson } = await params;
  const found = await getLesson(course, lesson);
  if (!found) return {};
  return {
    title: `${found.lesson.title} — ${found.course.title} | Хүрэлбаатар`,
    description: found.course.description,
  };
}

/** Dark 16:9 box that stands in for the player. */
function Screen({ icon: Icon, title, children }: { icon: typeof Lock; title: string; children?: React.ReactNode }) {
  return (
    <div className="aspect-video rounded-xl bg-zinc-900 text-white flex flex-col items-center justify-center gap-3 px-6 text-center">
      <Icon className="w-8 h-8 text-white/60" />
      <p className="font-semibold">{title}</p>
      {children}
    </div>
  );
}

export default async function LessonPage({ params }: Props) {
  // Player URLs are signed per request and expire, so this page is never prerendered.
  await connection();

  const { course: courseSlug, lesson: lessonSlug } = await params;
  const found = await getLesson(courseSlug, lessonSlug);
  if (!found) notFound();

  const { course, lesson, Content, prev, next } = found;
  const allowed = await canWatch(course, lesson);
  const src = allowed && lesson.video ? signedEmbedUrl(lesson.video) : null;
  const lessonHref = (slug: string) => `/courses/${course.slug}/${slug}`;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link
          href={`/courses/${course.slug}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {course.title}
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_340px] items-start">
          <div className="min-w-0 space-y-8">
            {!allowed ? (
              <Screen icon={Lock} title="Энэ хичээл түгжээтэй">
                <p className="text-sm text-white/60">Сургалтыг худалдаж авснаар бүх хичээлийг үзэх боломжтой.</p>
                <Link
                  href={`/courses/${course.slug}#buy`}
                  className={cn(buttonVariants({ variant: "secondary" }), "mt-2")}
                >
                  Сургалтын тухай
                </Link>
              </Screen>
            ) : src ? (
              <iframe
                src={src}
                title={lesson.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="w-full aspect-video rounded-xl bg-black border-0"
              />
            ) : (
              <Screen icon={Clapperboard} title="Видео удахгүй нэмэгдэнэ" />
            )}

            <header className="space-y-2">
              <p className="text-xs font-semibold tracking-widest uppercase text-orange-500">
                Хичээл {lesson.number} · {lesson.duration}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">{lesson.title}</h1>
            </header>

            {allowed && (
              <article className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-tight">
                <Content />
              </article>
            )}

            <nav className="flex justify-between gap-4 border-t border-border pt-6 text-sm">
              {prev ? (
                <Link href={lessonHref(prev.slug)} className="group flex flex-col gap-1 min-w-0">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Өмнөх
                  </span>
                  <span className="font-medium group-hover:text-primary truncate">{prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={lessonHref(next.slug)} className="group flex flex-col items-end gap-1 min-w-0 text-right">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    Дараах
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  <span className="font-medium group-hover:text-primary truncate">{next.title}</span>
                </Link>
              )}
            </nav>
          </div>

          <aside className="lg:sticky lg:top-8 space-y-4">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
              Хичээлийн хөтөлбөр
            </h2>
            <LessonList course={course} current={lesson.slug} />
          </aside>
        </div>
      </div>
    </main>
  );
}

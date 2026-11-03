import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, PlayCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import LessonList from "@/components/course/LessonList";
import { formatPrice, getCourse, getCourses, totalDuration } from "@/lib/courses";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ course: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCourses()).map((c) => ({ course: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse((await params).course);
  if (!course) return {};
  return {
    title: `${course.title} | Хүрэлбаатар`,
    description: course.description,
    openGraph: course.cover ? { images: [{ url: course.cover }] } : undefined,
    twitter: { card: "summary_large_image" },
  };
}

export default async function CoursePage({ params }: Props) {
  const course = await getCourse((await params).course);
  if (!course) notFound();

  const { Content } = course;
  const preview = course.price === 0 ? course.lessons[0] : course.lessons.find((l) => l.free);
  const lessonHref = (slug: string) => `/courses/${course.slug}/${slug}`;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Бүх сургалт
        </Link>

        <header className="mb-10 space-y-4 max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-orange-500">Сургалт</span>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">{course.description}</p>
          <p className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4" />
              {course.lessons.length} хичээл
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {totalDuration(course.lessons)}
            </span>
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_300px] items-start">
          {/* Comes first on phones so the price is visible without scrolling. */}
          <aside id="buy" className="lg:order-2 lg:sticky lg:top-8 rounded-2xl border border-border p-6 space-y-4">
            <p className="text-3xl font-bold">{formatPrice(course.price)}</p>

            {course.price === 0 ? (
              preview && (
                <Link href={lessonHref(preview.slug)} className={cn(buttonVariants({ size: "lg" }), "w-full")}>
                  Үзэж эхлэх
                </Link>
              )
            ) : (
              <>
                <button disabled className={cn(buttonVariants({ size: "lg" }), "w-full")}>
                  Худалдаж авах
                </button>
                <p className="text-xs text-muted-foreground text-center">Төлбөр (QPay) удахгүй нээгдэнэ.</p>
                {preview && (
                  <Link
                    href={lessonHref(preview.slug)}
                    className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
                  >
                    Үнэгүй хичээл үзэх
                  </Link>
                )}
              </>
            )}
          </aside>

          <div className="lg:order-1 min-w-0 space-y-12">
            {course.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.cover} alt={course.title} className="w-full rounded-2xl aspect-video object-cover" />
            )}

            <article className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-tight">
              <Content />
            </article>

            <section className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Хичээлийн хөтөлбөр</h2>
              <LessonList course={course} />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { getCourses } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Сургалт | Хүрэлбаатар",
  description: "Хүрэлбаатарын стартап, бизнесийн тухай онлайн сургалтууд.",
};

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Нүүр
        </Link>

        <div className="mb-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Сургалт</h1>
          <p className="text-muted-foreground text-lg">Өөрийн туршлагаасаа хуваалцдаг зүйлс</p>
        </div>

        {courses.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border px-6 py-16 text-center text-muted-foreground">
            Анхны сургалт бэлтгэгдэж байна. Тун удахгүй.
          </p>
        )}
      </div>
    </main>
  );
}

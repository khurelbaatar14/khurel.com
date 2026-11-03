import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { getCourses } from "@/lib/courses";

const HOME_LIMIT = 3;

/** Home page section; renders nothing until a course is published. */
export default async function Courses() {
  const courses = await getCourses();
  if (!courses.length) return null;

  return (
    <section id="courses" className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-10 px-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Сургалт</h2>
          <p className="text-muted-foreground text-lg">Өөрийн туршлагаасаа хуваалцдаг зүйлс</p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.slice(0, HOME_LIMIT).map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        {courses.length > HOME_LIMIT && (
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Бүх сургалт
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </section>
  );
}

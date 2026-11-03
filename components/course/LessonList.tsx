import Link from "next/link";
import { Lock, PlayCircle } from "lucide-react";
import { canWatch } from "@/lib/access";
import type { Course } from "@/lib/courses";
import { cn } from "@/lib/utils";

/** Course curriculum; every row links to its lesson, locked ones show why they're locked. */
export default async function LessonList({ course, current }: { course: Course; current?: string }) {
  const unlocked = await Promise.all(course.lessons.map((l) => canWatch(course, l)));

  return (
    <ol className="rounded-xl border border-border divide-y divide-border overflow-hidden">
      {course.lessons.map((lesson, i) => {
        const Icon = unlocked[i] ? PlayCircle : Lock;
        const active = lesson.slug === current;
        return (
          <li key={lesson.slug}>
            <Link
              href={`/courses/${course.slug}/${lesson.slug}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                active ? "bg-muted" : "hover:bg-muted/50",
              )}
            >
              <Icon
                className={cn("w-4 h-4 shrink-0", unlocked[i] ? "text-orange-500" : "text-muted-foreground")}
              />
              <span className="flex-1 min-w-0">
                <span className="text-muted-foreground mr-1.5">{lesson.number}.</span>
                <span className={cn(active && "font-semibold")}>{lesson.title}</span>
              </span>
              {lesson.free && course.price > 0 && (
                <span className="text-xs font-medium text-orange-600 shrink-0">Үнэгүй</span>
              )}
              <span className="text-xs text-muted-foreground tabular-nums shrink-0">{lesson.duration}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

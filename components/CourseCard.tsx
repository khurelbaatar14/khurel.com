import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, totalDuration, type Course } from "@/lib/courses";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group rounded-2xl border border-border/60 overflow-hidden bg-background hover:border-border hover:shadow-md transition-all duration-200 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] bg-muted overflow-hidden">
        {course.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.cover}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-white/70" />
          </div>
        )}
        {course.draft && (
          <Badge className="absolute top-3 left-3 bg-black/70 text-white border-0">Ноорог</Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-5 flex-1">
        <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {course.description}
        </p>
        <div className="flex items-center justify-between pt-2 text-sm">
          <span className="text-muted-foreground">
            {course.lessons.length} хичээл · {totalDuration(course.lessons)}
          </span>
          <span className="font-semibold">{formatPrice(course.price)}</span>
        </div>
      </div>
    </Link>
  );
}

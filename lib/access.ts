import { cache } from "react";
import { getUser } from "@/lib/auth";
import type { Course, Lesson } from "@/lib/courses";
import { createClient } from "@/lib/supabase/server";

/**
 * Slugs of the courses the visitor has bought (supabase/migrations: `enrollments`).
 * Row-level security limits the query to their own rows. Looked up once per request.
 */
const getEnrolledCourses = cache(async () => {
  const user = await getUser();
  if (!user) return new Set<string>();

  const supabase = await createClient();
  const { data, error } = await supabase.from("enrollments").select("course");
  if (error) console.error("[access] enrollments:", error.message);
  return new Set((data ?? []).map((row) => row.course as string));
});

export async function isEnrolled(course: Course) {
  return (await getEnrolledCourses()).has(course.slug);
}

/** Free courses and free previews are open to everyone; the rest need an enrollment. */
export async function canWatch(course: Course, lesson: Lesson) {
  if (course.price === 0 || lesson.free) return true;
  return isEnrolled(course);
}

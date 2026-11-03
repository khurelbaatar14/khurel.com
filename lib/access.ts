import type { Course, Lesson } from "@/lib/courses";

/**
 * Whether the current visitor may watch a lesson. For now only free courses and free
 * previews are open; enrolled buyers get the rest once accounts and QPay are in.
 */
export async function canWatch(course: Course, lesson: Lesson) {
  return course.price === 0 || Boolean(lesson.free);
}

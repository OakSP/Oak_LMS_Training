import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/helpers";
import { LessonPlayerClient } from "@/components/lesson/lesson-player-client";
import { getAdjacentLessons, getCourseById, getCourseLessons, getLessonById, getQuizForLesson } from "@/mock/learning";

export default async function LearnLessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  await requireUser();
  const { courseId, lessonId } = await params;
  const course = getCourseById(courseId);
  const lesson = getLessonById(courseId, lessonId);

  if (!course || !lesson) notFound();

  const lessons = getCourseLessons(courseId);
  const adjacent = getAdjacentLessons(courseId, lessonId);
  const quizIdsByLessonId = Object.fromEntries(
    lessons
      .map((item) => [item.id, getQuizForLesson(courseId, item.id)?.id] as const)
      .filter((entry): entry is readonly [string, string] => Boolean(entry[1])),
  );

  return (
    <LessonPlayerClient
      course={course}
      lesson={lesson}
      lessons={lessons}
      previousLesson={adjacent.previous}
      nextLesson={adjacent.next}
      quizIdsByLessonId={quizIdsByLessonId}
    />
  );
}

import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/helpers";
import { QuizPlayerClient } from "@/components/quiz/quiz-player-client";
import { getCourseForQuiz } from "@/mock/learning";

export default async function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  await requireUser();
  const { quizId } = await params;
  const { quiz, course, lesson } = getCourseForQuiz(quizId);

  if (!quiz || !course || !lesson) notFound();

  return <QuizPlayerClient quiz={quiz} course={course} lesson={lesson} />;
}

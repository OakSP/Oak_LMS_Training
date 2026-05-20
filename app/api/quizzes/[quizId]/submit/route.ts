import { NextResponse } from "next/server";
import { z } from "zod";
import { getQuizById } from "@/mock/learning";

const submitSchema = z.object({
  answers: z.array(z.number().int()),
});

export async function POST(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const quiz = getQuizById(quizId);

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  const body = submitSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.issues[0].message }, { status: 400 });
  }

  const correctCount = quiz.questions.reduce((sum, question, index) => {
    return sum + (body.data.answers[index] === question.correctIndex ? 1 : 0);
  }, 0);
  const score = Math.round((correctCount / quiz.questions.length) * 100);

  return NextResponse.json({
    data: {
      quizId,
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
      isPassed: score >= quiz.passPercent,
      submittedAt: new Date().toISOString(),
    },
    score,
    correctCount,
    totalQuestions: quiz.questions.length,
    isPassed: score >= quiz.passPercent,
  });
}

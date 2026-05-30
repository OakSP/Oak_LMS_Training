import { NextResponse } from "next/server";
import { z } from "zod";
import { apiRequireAuth } from "@/lib/auth/helpers";
import { getQuizById } from "@/mock/learning";

const submitSchema = z.object({
  answers: z.array(z.number().int()),
});

export async function POST(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;

  const body = submitSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.issues[0].message }, { status: 400 });
  }

  const hasDatabase = Boolean(process.env.DATABASE_URL);

  if (!hasDatabase) {
    const quiz = getQuizById(quizId);
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    const correctCount = quiz.questions.reduce((sum, q, i) =>
      sum + (body.data.answers[i] === q.correctIndex ? 1 : 0), 0
    );
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const isPassed = score >= quiz.passPercent;

    return NextResponse.json({
      data: { quizId, score, correctCount, totalQuestions: quiz.questions.length, isPassed, submittedAt: new Date().toISOString() },
      score, correctCount, totalQuestions: quiz.questions.length, isPassed,
    });
  }

  // DB mode — require auth
  const { user, error } = await apiRequireAuth();
  if (error) return error;

  const { prisma } = await import("@/lib/db/prisma");

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  const correctCount = quiz.questions.reduce((sum, q, i) =>
    sum + (body.data.answers[i] === q.correctIndex ? 1 : 0), 0
  );
  const score = (correctCount / quiz.questions.length) * 100;
  const isPassed = score >= quiz.passPercent;

  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId,
      userId: user!.id,
      score,
      isPassed,
      submittedAt: new Date(),
    },
  });

  return NextResponse.json({
    data: {
      quizId,
      score: Math.round(score),
      correctCount,
      totalQuestions: quiz.questions.length,
      isPassed,
      submittedAt: attempt.submittedAt?.toISOString() ?? new Date().toISOString(),
    },
    score: Math.round(score),
    correctCount,
    totalQuestions: quiz.questions.length,
    isPassed,
  });
}

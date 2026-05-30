import { NextResponse } from "next/server";
import { apiRequireAuth } from "@/lib/auth/helpers";
import { getQuizById } from "@/mock/learning";

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function POST(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const body = await request.json().catch(() => ({})) as { randomize?: boolean };
  const randomize = body.randomize !== false;

  const hasDatabase = Boolean(process.env.DATABASE_URL);

  if (!hasDatabase) {
    const quiz = getQuizById(quizId);
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    const questions = randomize ? shuffleArray(quiz.questions) : quiz.questions;
    return NextResponse.json({
      data: {
        id: `attempt-${Date.now()}`,
        quizId,
        startedAt: new Date().toISOString(),
        maxAttempts: quiz.maxAttempts,
        questions,
        mode: "local-demo",
      },
    }, { status: 201 });
  }

  // DB mode — require auth + enforce attempt limit
  const { user, error } = await apiRequireAuth();
  if (error) return error;

  const { prisma } = await import("@/lib/db/prisma");

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  // Count how many times this user has already submitted this quiz
  const attemptCount = await prisma.quizAttempt.count({
    where: { quizId, userId: user!.id },
  });

  if (attemptCount >= quiz.maxAttempts) {
    return NextResponse.json({
      error: `ถึงจำนวนครั้งสูงสุดแล้ว (${quiz.maxAttempts} ครั้ง) — ไม่สามารถทำ Quiz นี้ได้อีก`,
      code: "MAX_ATTEMPTS_REACHED",
      attemptsUsed: attemptCount,
      maxAttempts: quiz.maxAttempts,
    }, { status: 403 });
  }

  const questions = randomize ? shuffleArray(quiz.questions) : quiz.questions;

  return NextResponse.json({
    data: {
      id: `attempt-${Date.now()}`,
      quizId,
      startedAt: new Date().toISOString(),
      attemptsUsed: attemptCount,
      attemptsRemaining: quiz.maxAttempts - attemptCount,
      maxAttempts: quiz.maxAttempts,
      questions,
    },
  }, { status: 201 });
}

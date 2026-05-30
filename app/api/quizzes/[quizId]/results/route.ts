import { NextResponse } from "next/server";
import { apiRequireAuth } from "@/lib/auth/helpers";
import { getQuizById } from "@/mock/learning";

export async function GET(_request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;

  const hasDatabase = Boolean(process.env.DATABASE_URL);

  if (!hasDatabase) {
    const quiz = getQuizById(quizId);
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    return NextResponse.json({
      data: {
        quizId,
        attempts: [],
        latestAttempt: null,
        attemptsUsed: 0,
        maxAttempts: quiz.maxAttempts,
        message: "Results stored in localStorage (demo mode). Connect Neon DB for persistent history.",
      },
    });
  }

  const { user, error } = await apiRequireAuth();
  if (error) return error;

  const { prisma } = await import("@/lib/db/prisma");

  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  const attempts = await prisma.quizAttempt.findMany({
    where: { quizId, userId: user!.id },
    orderBy: { startedAt: "desc" },
    select: {
      id: true,
      score: true,
      isPassed: true,
      startedAt: true,
      submittedAt: true,
    },
  });

  const latestAttempt = attempts[0] ?? null;

  return NextResponse.json({
    data: {
      quizId,
      passPercent: quiz.passPercent,
      maxAttempts: quiz.maxAttempts,
      attemptsUsed: attempts.length,
      attemptsRemaining: Math.max(0, quiz.maxAttempts - attempts.length),
      latestAttempt: latestAttempt
        ? {
            ...latestAttempt,
            score: Number(latestAttempt.score),
            startedAt: latestAttempt.startedAt.toISOString(),
            submittedAt: latestAttempt.submittedAt?.toISOString() ?? null,
          }
        : null,
      attempts: (attempts as { id: string; score: unknown; isPassed: boolean; startedAt: Date; submittedAt: Date | null }[]).map((a) => ({
        ...a,
        score: Number(a.score),
        startedAt: a.startedAt.toISOString(),
        submittedAt: a.submittedAt?.toISOString() ?? null,
      })),
    },
  });
}

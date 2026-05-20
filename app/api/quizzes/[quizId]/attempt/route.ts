import { NextResponse } from "next/server";
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
  const quiz = getQuizById(quizId);

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({})) as { randomize?: boolean };
  const randomize = body.randomize !== false; // default true

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

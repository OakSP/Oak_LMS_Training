import { NextResponse } from "next/server";
import { getQuizById } from "@/mock/learning";

export async function GET(_request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const quiz = getQuizById(quizId);

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      quizId,
      latestAttempt: null,
      message: "Results are stored locally in this MVP demo until Neon is configured.",
    },
  });
}

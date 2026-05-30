import { NextResponse } from "next/server";
import { QUIZZES } from "@/mock/learning";
import { apiRequireRole } from "@/lib/auth/helpers";
import { createQuizSchema, createQuestionSchema } from "@/lib/validations/quiz";
import { z } from "zod";

export async function GET() {
  return NextResponse.json({ data: QUIZZES, total: QUIZZES.length });
}

const createQuizWithQuestionsSchema = createQuizSchema.extend({
  questions: z.array(createQuestionSchema).min(1, "At least one question required"),
});

export async function POST(request: Request) {
  const { user, error } = await apiRequireRole(["instructor", "admin", "super_admin"]);
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = createQuizWithQuestionsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const hasDatabase = Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL?.includes("placeholder");
    if (!hasDatabase) {
      const demoQuiz = {
        id: `quiz-demo-${Date.now()}`,
        ...parsed.data,
        questions: parsed.data.questions.map((q, i) => ({
          id: `q-demo-${Date.now()}-${i}`,
          ...q,
        })),
        createdBy: user!.id,
        mode: "local-demo",
      };
      return NextResponse.json({ data: demoQuiz, message: "Demo mode: quiz not persisted" }, { status: 201 });
    }

    const { prisma } = await import("@/lib/db/prisma");
    const { questions, lessonId, ...quizData } = parsed.data;

    const quiz = await prisma.quiz.create({
      data: {
        ...quizData,
        lessonId,
        questions: {
          create: questions.map((q) => ({
            type: q.type,
            text: q.text,
            options: q.options,
            correctIndex: q.correctIndex,
          })),
        },
      },
      include: { questions: true },
    });

    return NextResponse.json({ data: quiz }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}

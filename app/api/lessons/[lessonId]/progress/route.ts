import { NextResponse } from "next/server";
import { z } from "zod";
import { apiRequireAuth } from "@/lib/auth/helpers";
import { getLessonById } from "@/mock/learning";

const progressSchema = z.object({
  courseId: z.string().min(1),
  watchTime: z.number().int().min(0),
  durationSec: z.number().int().positive(),
  isCompleted: z.boolean().optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const body = progressSchema.safeParse(await request.json());

  if (!body.success) {
    return NextResponse.json({ error: body.error.issues[0].message }, { status: 400 });
  }

  const { courseId, watchTime, durationSec } = body.data;
  const watchTimeClamped = Math.min(watchTime, durationSec);
  const isCompleted = body.data.isCompleted ?? watchTimeClamped >= Math.round(durationSec * 0.9);

  const hasDatabase = Boolean(process.env.DATABASE_URL);

  if (!hasDatabase) {
    const lesson = getLessonById(courseId, lessonId);
    if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    return NextResponse.json({
      data: {
        courseId, lessonId,
        watchTime: watchTimeClamped, durationSec, isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : null,
        mode: "local-demo",
      },
    });
  }

  const { user, error } = await apiRequireAuth();
  if (error) return error;

  const { prisma } = await import("@/lib/db/prisma");

  // Fetch existing progress to avoid overwriting higher watchTime or un-completing
  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: user!.id, lessonId } },
  });

  const finalWatchTime = Math.max(watchTimeClamped, existing?.watchTime ?? 0);
  const wasCompleted = existing?.isCompleted ?? false;
  const finalCompleted = wasCompleted || isCompleted;
  const finalCompletedAt = wasCompleted
    ? existing!.completedAt
    : isCompleted ? new Date() : null;

  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user!.id, lessonId } },
    update: { watchTime: finalWatchTime, isCompleted: finalCompleted, completedAt: finalCompletedAt },
    create: { userId: user!.id, lessonId, watchTime: finalWatchTime, isCompleted: finalCompleted, completedAt: finalCompletedAt },
  });

  // If just completed — check if all lessons in course are done → mark enrollment completed
  if (finalCompleted && !wasCompleted) {
    const [totalLessons, completedCount] = await Promise.all([
      prisma.lesson.count({ where: { courseId } }),
      prisma.lessonProgress.count({ where: { userId: user!.id, isCompleted: true, lesson: { courseId } } }),
    ]);

    if (totalLessons > 0 && completedCount >= totalLessons) {
      await prisma.enrollment.updateMany({
        where: { userId: user!.id, courseId, completedAt: null },
        data: { completedAt: new Date() },
      });
    }
  }

  return NextResponse.json({
    data: { ...progress, completedAt: progress.completedAt?.toISOString() ?? null },
  });
}

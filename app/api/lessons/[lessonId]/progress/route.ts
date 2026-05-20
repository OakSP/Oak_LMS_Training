import { NextResponse } from "next/server";
import { z } from "zod";
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

  const lesson = getLessonById(body.data.courseId, lessonId);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const isCompleted = body.data.isCompleted ?? body.data.watchTime >= Math.round(body.data.durationSec * 0.9);

  return NextResponse.json({
    data: {
      courseId: body.data.courseId,
      lessonId,
      watchTime: Math.min(body.data.watchTime, body.data.durationSec),
      durationSec: body.data.durationSec,
      isCompleted,
      completedAt: isCompleted ? new Date().toISOString() : null,
      mode: "local-demo",
    },
  });
}

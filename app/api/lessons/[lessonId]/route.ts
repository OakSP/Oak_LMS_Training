import { NextResponse } from "next/server";
import { apiRequireRole } from "@/lib/auth/helpers";
import { updateCourseSchema } from "@/lib/validations/course";
import { z } from "zod";

const updateLessonSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  type: z.enum(["video", "pdf", "text", "quiz", "youtube"]).optional(),
  contentUrl: z.string().url().optional().nullable(),
  durationSec: z.coerce.number().min(0).optional().nullable(),
  isFree: z.boolean().optional(),
  position: z.coerce.number().min(0).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { user, error } = await apiRequireRole(["instructor", "admin", "super_admin"]);
  if (error) return error;

  const { lessonId } = await params;

  try {
    const body = await request.json();
    const parsed = updateLessonSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const hasDatabase = Boolean(process.env.DATABASE_URL);
    if (!hasDatabase) {
      return NextResponse.json({
        data: { id: lessonId, ...parsed.data },
        message: "Demo mode: lesson not persisted",
      });
    }

    const { prisma } = await import("@/lib/db/prisma");

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });
    if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    if (lesson.course.instructorId !== user!.id && !["admin", "super_admin"].includes(user!.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: parsed.data as any,
    });

    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { user, error } = await apiRequireRole(["instructor", "admin", "super_admin"]);
  if (error) return error;

  const { lessonId } = await params;
  const hasDatabase = Boolean(process.env.DATABASE_URL);

  if (!hasDatabase) {
    return NextResponse.json({ message: "Demo mode: lesson deletion simulated" });
  }

  const { prisma } = await import("@/lib/db/prisma");

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  if (lesson.course.instructorId !== user!.id && !["admin", "super_admin"].includes(user!.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.lesson.delete({ where: { id: lessonId } });
  return NextResponse.json({ message: "Lesson deleted" });
}

// suppress unused import warning
void updateCourseSchema;

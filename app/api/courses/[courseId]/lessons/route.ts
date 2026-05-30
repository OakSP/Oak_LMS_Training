import { NextResponse } from "next/server";
import { getCourseById, getCourseLessons } from "@/mock/learning";
import { apiRequireRole } from "@/lib/auth/helpers";
import { createLessonSchema } from "@/lib/validations/course";

export async function GET(_request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = getCourseById(courseId);

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const lessons = getCourseLessons(courseId);
  return NextResponse.json({ data: lessons, total: lessons.length });
}

export async function POST(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const { user, error } = await apiRequireRole(["instructor", "admin", "super_admin"]);
  if (error) return error;

  const { courseId } = await params;

  try {
    const body = await request.json();
    const parsed = createLessonSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const hasDatabase = Boolean(process.env.DATABASE_URL);
    if (!hasDatabase) {
      return NextResponse.json({
        data: { id: `demo-${Date.now()}`, courseId, ...parsed.data, durationSec: parsed.data.durationSec ?? null },
        message: "Demo mode: lesson not persisted",
      });
    }

    const { prisma } = await import("@/lib/db/prisma");

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    if (course.instructorId !== user!.id && !["admin", "super_admin"].includes(user!.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const lesson = await prisma.lesson.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { courseId, ...parsed.data } as any,
    });

    return NextResponse.json({ data: lesson }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { apiRequireAuth } from "@/lib/auth/helpers";
import { getCourseById } from "@/mock/learning";

export async function POST(_request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const { user, error } = await apiRequireAuth();
  if (error) return error;

  const { courseId } = await params;

  const hasDatabase = Boolean(process.env.DATABASE_URL);

  if (!hasDatabase) {
    const course = getCourseById(courseId);
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json({
      data: { courseId, userId: user!.id, enrolledAt: new Date().toISOString(), mode: "local-demo" },
    });
  }

  const { prisma } = await import("@/lib/db/prisma");

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user!.id, courseId } },
  });
  if (existing) return NextResponse.json({ data: existing });

  const enrollment = await prisma.enrollment.create({
    data: { userId: user!.id, courseId },
  });

  return NextResponse.json({ data: enrollment }, { status: 201 });
}

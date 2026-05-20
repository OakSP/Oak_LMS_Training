import { NextResponse } from "next/server";
import { apiRequireRole } from "@/lib/auth/helpers";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { user, error } = await apiRequireRole(["instructor", "admin", "super_admin"]);
  if (error) return error;

  const { courseId } = await params;
  const hasDatabase = Boolean(process.env.DATABASE_URL);

  if (!hasDatabase) {
    return NextResponse.json({
      data: { id: courseId, isPublished: true },
      message: "Demo mode: publish simulated",
    });
  }

  const { prisma } = await import("@/lib/db/prisma");

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  if (course.instructorId !== user!.id && !["admin", "super_admin"].includes(user!.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.course.update({
    where: { id: courseId },
    data: { isPublished: !course.isPublished },
  });

  return NextResponse.json({ data: updated });
}

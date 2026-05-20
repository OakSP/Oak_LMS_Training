import { NextResponse } from "next/server";
import { COURSES } from "@/mock/courses";
import { apiRequireRole } from "@/lib/auth/helpers";
import { updateCourseSchema } from "@/lib/validations/course";

export async function GET(_req: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = COURSES.find((c) => c.id === courseId);
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: course });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { user, error } = await apiRequireRole(["instructor", "admin", "super_admin"]);
  if (error) return error;

  const { courseId } = await params;

  try {
    const body = await request.json();
    const parsed = updateCourseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const hasDatabase = Boolean(process.env.DATABASE_URL);
    if (!hasDatabase) {
      return NextResponse.json({
        data: { id: courseId, ...parsed.data },
        message: "Demo mode: changes not persisted",
      });
    }

    const { prisma } = await import("@/lib/db/prisma");
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (course.instructorId !== user!.id && !["admin", "super_admin"].includes(user!.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.course.update({ where: { id: courseId }, data: parsed.data });
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { user, error } = await apiRequireRole(["instructor", "admin", "super_admin"]);
  if (error) return error;

  const { courseId } = await params;
  const hasDatabase = Boolean(process.env.DATABASE_URL);

  if (!hasDatabase) {
    return NextResponse.json({ message: "Demo mode: deletion simulated" });
  }

  const { prisma } = await import("@/lib/db/prisma");
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (course.instructorId !== user!.id && !["admin", "super_admin"].includes(user!.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.course.delete({ where: { id: courseId } });
  return NextResponse.json({ message: "Course deleted" });
}

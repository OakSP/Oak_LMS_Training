import { NextResponse } from "next/server";
import { apiRequireRole } from "@/lib/auth/helpers";
import { reorderLessonsSchema } from "@/lib/validations/course";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { user, error } = await apiRequireRole(["instructor", "admin", "super_admin"]);
  if (error) return error;

  const { courseId } = await params;

  try {
    const body = await request.json();
    const parsed = reorderLessonsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const hasDatabase = Boolean(process.env.DATABASE_URL);
    if (!hasDatabase) {
      return NextResponse.json({ message: "Demo mode: order saved locally" });
    }

    const { prisma } = await import("@/lib/db/prisma");

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    if (course.instructorId !== user!.id && !["admin", "super_admin"].includes(user!.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Promise.all(
      parsed.data.orderedIds.map((id, index) =>
        prisma.lesson.updateMany({
          where: { id, courseId },
          data: { position: index },
        })
      )
    );

    return NextResponse.json({ message: "Lessons reordered" });
  } catch {
    return NextResponse.json({ error: "Failed to reorder lessons" }, { status: 500 });
  }
}

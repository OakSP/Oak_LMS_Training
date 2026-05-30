import { NextResponse } from "next/server";
import { apiRequireAuth } from "@/lib/auth/helpers";
import { COURSES } from "@/mock/courses";
import { getCourseLessons } from "@/mock/learning";

export async function GET() {
  const { user, error } = await apiRequireAuth();
  if (error) return error;

  const hasDatabase = Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL?.includes("placeholder");

  if (!hasDatabase) {
    return NextResponse.json({
      data: COURSES.slice(0, 3).map((course) => ({
        courseId: course.id,
        title: course.title,
        totalLessons: getCourseLessons(course.id).length,
        completedLessons: 0,
        percent: 0,
        mode: "local-demo-client-progress",
      })),
      message: "Client progress is stored in localStorage. Connect Neon DB for persistent sync.",
    });
  }

  const { prisma } = await import("@/lib/db/prisma");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user!.id },
    include: {
      course: {
        include: {
          lessons: { select: { id: true } },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const progressRecords = await prisma.lessonProgress.findMany({
    where: { userId: user!.id, isCompleted: true },
    select: { lessonId: true, lesson: { select: { courseId: true } } },
  });

  const completedByCoureId: Record<string, number> = {};
  for (const p of progressRecords) {
    const cid = p.lesson.courseId;
    completedByCoureId[cid] = (completedByCoureId[cid] ?? 0) + 1;
  }

  const data = enrollments.map((en) => {
    const totalLessons = en.course.lessons.length;
    const completedLessons = completedByCoureId[en.courseId] ?? 0;
    const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      courseId: en.courseId,
      title: en.course.title,
      totalLessons,
      completedLessons,
      percent,
      isCompleted: en.completedAt !== null,
      enrolledAt: en.enrolledAt.toISOString(),
      completedAt: en.completedAt?.toISOString() ?? null,
    };
  });

  return NextResponse.json({ data, total: data.length });
}

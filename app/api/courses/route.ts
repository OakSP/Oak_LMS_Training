import { NextResponse } from "next/server";
import { COURSES } from "@/mock/courses";
import { apiRequireRole } from "@/lib/auth/helpers";
import { createCourseSchema } from "@/lib/validations/course";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang");
  const q    = searchParams.get("q")?.toLowerCase();
  const level = searchParams.get("level")?.toLowerCase();
  const price = searchParams.get("price");
  const sort = searchParams.get("sort");

  let courses = COURSES;
  if (lang) courses = courses.filter((c) => c.lang === lang);
  if (level) courses = courses.filter((c) => c.level.toLowerCase().includes(level));
  if (price === "free") courses = courses.filter((c) => c.price === 0);
  if (price === "paid") courses = courses.filter((c) => c.price > 0);
  if (q) {
    courses = courses.filter((c) =>
      c.title.en.toLowerCase().includes(q) ||
      c.title.th.toLowerCase().includes(q) ||
      c.teacher.toLowerCase().includes(q) ||
      c.tags.en.some((tag) => tag.toLowerCase().includes(q)) ||
      c.tags.th.some((tag) => tag.toLowerCase().includes(q))
    );
  }
  if (sort === "rating") courses = [...courses].sort((a, b) => b.rating - a.rating);
  if (sort === "new") courses = [...courses].sort((a, b) => (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0));
  if (sort === "pop") courses = [...courses].sort((a, b) => b.enrolled - a.enrolled);

  return NextResponse.json({ data: courses, total: courses.length });
}

export async function POST(request: Request) {
  const { user, error } = await apiRequireRole(["instructor", "admin", "super_admin"]);
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = createCourseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const hasDatabase = Boolean(process.env.DATABASE_URL);
    if (!hasDatabase) {
      return NextResponse.json({
        data: { id: `demo-${Date.now()}`, ...parsed.data, instructorId: user!.id },
        message: "Demo mode: course not persisted",
      }, { status: 201 });
    }

    const { prisma } = await import("@/lib/db/prisma");
    const course = await prisma.course.create({
      data: { ...parsed.data, instructorId: user!.id },
    });
    return NextResponse.json({ data: course }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}

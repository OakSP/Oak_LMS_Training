import { NextResponse } from "next/server";
import { COURSES } from "@/mock/courses";
import { apiRequireRole } from "@/lib/auth/helpers";
import { createCourseSchema } from "@/lib/validations/course";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang  = searchParams.get("lang");
  const q     = searchParams.get("q")?.toLowerCase();
  const level = searchParams.get("level")?.toLowerCase();
  const price = searchParams.get("price");
  const sort  = searchParams.get("sort");

  const hasDatabase = Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL?.includes("placeholder");

  if (hasDatabase) {
    const { prisma } = await import("@/lib/db/prisma");

    const where: Record<string, unknown> = { isPublished: true };
    if (lang) where.lang = lang;
    if (price === "free") where.isFree = true;
    if (price === "paid") where.isFree = false;

    const orderBy = sort === "new"
      ? { createdAt: "desc" as const }
      : { createdAt: "desc" as const };

    const dbCourses = await prisma.course.findMany({
      where,
      orderBy,
      include: {
        instructor: { select: { name: true } },
        _count: { select: { enrollments: true, lessons: true } },
      },
    });

    const normalized = dbCourses
      .filter((c) => !q || c.title.toLowerCase().includes(q) || c.instructor.name.toLowerCase().includes(q))
      .map((c) => ({
        id: c.id,
        title: { th: c.title, en: c.title },
        desc: { th: c.description ?? "", en: c.description ?? "" },
        lang: c.lang,
        price: Number(c.price),
        isFree: c.isFree,
        isPublished: c.isPublished,
        teacher: c.instructor.name,
        teacherRole: { th: "ผู้สอน", en: "Instructor" },
        enrolled: c._count.enrollments,
        lessons: c._count.lessons,
        hours: 0,
        rating: 0,
        ratings: 0,
        level: "All Levels",
        badge: null,
        oldPrice: null,
        tags: { th: [], en: [] },
        coverUrl: c.coverUrl ?? null,
        chapters: [],
        learn: { th: [], en: [] },
        source: "db" as const,
      }));

    return NextResponse.json({ data: normalized, total: normalized.length });
  }

  // Demo mode — mock data with filters
  let courses = COURSES;
  if (lang) courses = courses.filter((c) => c.lang === lang);
  if (level) courses = courses.filter((c) => c.level.toLowerCase().includes(level ?? ""));
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

    const hasDatabase = Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL?.includes("placeholder");
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

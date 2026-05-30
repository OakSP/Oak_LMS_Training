import Link from "next/link";
import { requireRole } from "@/lib/auth/helpers";

const DEMO_COURSES = [
  { id: "demo-1", title: "English for Beginners", lang: "en", isPublished: true, enrolled: 124, price: 0 },
  { id: "demo-2", title: "Business English Intensive", lang: "en", isPublished: false, enrolled: 0, price: 1490 },
];

export default async function InstructorCoursesPage() {
  const user = await requireRole(["instructor", "admin", "super_admin"]);

  const hasDatabase = Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL?.includes("placeholder");

  type CourseRow = { id: string; title: string; lang: string; isPublished: boolean; enrolled: number; price: number };
  let courses: CourseRow[] = [];

  if (hasDatabase) {
    try {
      const { prisma } = await import("@/lib/db/prisma");
      const isAdmin = ["admin", "super_admin"].includes(user.role as string);
      const dbCourses = await prisma.course.findMany({
        where: isAdmin ? {} : { instructorId: user.id },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { enrollments: true } } },
      });
      courses = (dbCourses as { id: string; title: string; lang: string; isPublished: boolean; price: unknown; _count: { enrollments: number } }[]).map((c) => ({
        id: c.id,
        title: c.title,
        lang: c.lang,
        isPublished: c.isPublished,
        enrolled: c._count.enrollments,
        price: Number(c.price),
      }));
    } catch {
      courses = [];
    }
  } else {
    courses = DEMO_COURSES;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--color-ink)]">My Courses</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">
            Manage and publish your courses
          </p>
        </div>
        <Link
          href="/dashboard/instructor/courses/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[color:var(--color-primary-2)] transition-colors"
        >
          + New Course
        </Link>
      </div>

      {!hasDatabase && (
        <div className="mb-6 rounded-xl border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/5 p-4 text-sm text-[color:var(--color-accent)]">
          Demo mode — courses below are mock data. Connect Neon DB to manage real courses.
        </div>
      )}

      <div className="space-y-3">
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 h-16 w-16 rounded-2xl bg-[color:var(--color-line-2)] flex items-center justify-center text-2xl">
              📚
            </div>
            <h2 className="text-lg font-semibold text-[color:var(--color-ink)]">No courses yet</h2>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">Create your first course to get started.</p>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center gap-4 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-card)] p-4 hover:border-[color:var(--color-primary)]/30 transition-colors"
            >
              <div className="h-14 w-20 rounded-xl bg-[color:var(--color-line-2)] shrink-0 flex items-center justify-center text-xl">
                {course.lang === "en" ? "🇬🇧" : course.lang === "zh" ? "🇨🇳" : "🇯🇵"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[color:var(--color-ink)] truncate">{course.title}</h3>
                <p className="text-xs text-[color:var(--color-muted)] mt-0.5">
                  {course.enrolled} enrolled · {course.price === 0 ? "Free" : `฿${course.price.toLocaleString()}`}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                course.isPublished
                  ? "bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]"
                  : "bg-[color:var(--color-muted-2)]/10 text-[color:var(--color-muted)]"
              }`}>
                {course.isPublished ? "Published" : "Draft"}
              </span>
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/dashboard/instructor/courses/${course.id}`}
                  className="rounded-lg border border-[color:var(--color-line)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-line-2)] transition-colors"
                >
                  Edit
                </Link>
                <Link
                  href={`/dashboard/instructor/courses/${course.id}/lessons`}
                  className="rounded-lg border border-[color:var(--color-line)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-line-2)] transition-colors"
                >
                  Lessons
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";
import { getCourseById, getCourseLessons } from "@/mock/learning";

export async function GET(_request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = getCourseById(courseId);

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const lessons = getCourseLessons(courseId);
  return NextResponse.json({ data: lessons, total: lessons.length });
}

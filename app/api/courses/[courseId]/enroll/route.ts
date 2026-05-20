import { NextResponse } from "next/server";
import { getCourseById } from "@/mock/learning";

export async function POST(_request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = getCourseById(courseId);

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      courseId,
      enrolledAt: new Date().toISOString(),
      mode: "local-demo",
    },
  });
}

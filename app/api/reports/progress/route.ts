import { NextResponse } from "next/server";
import { COURSES } from "@/mock/courses";
import { getCourseLessons } from "@/mock/learning";

export async function GET() {
  return NextResponse.json({
    data: COURSES.slice(0, 3).map((course) => ({
      courseId: course.id,
      title: course.title,
      totalLessons: getCourseLessons(course.id).length,
      completedLessons: 0,
      percent: 0,
      mode: "local-demo-client-progress",
    })),
    message: "Client progress is stored in localStorage until Neon is configured.",
  });
}

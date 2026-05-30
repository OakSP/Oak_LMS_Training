import { NextResponse } from "next/server";
import { apiRequireAuth } from "@/lib/auth/helpers";
import { createCheckoutSession } from "@/lib/services/stripe";

export async function POST(request: Request) {
  const { user, error } = await apiRequireAuth();
  if (error) return error;

  try {
    const body = await request.json() as { courseId: string };
    const { courseId } = body;
    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 422 });
    }

    const hasDatabase = Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL?.includes("placeholder");
    let courseTitle = "Course";
    let price = 0;

    if (hasDatabase) {
      const { prisma } = await import("@/lib/db/prisma");
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
      if (course.isPublished === false) return NextResponse.json({ error: "Course not available" }, { status: 400 });
      courseTitle = course.title;
      price = Number(course.price);

      // Free course — direct enrollment
      if (course.isFree || price === 0) {
        await prisma.enrollment.upsert({
          where: { userId_courseId: { userId: user!.id, courseId } },
          update: {},
          create: { userId: user!.id, courseId },
        });
        return NextResponse.json({ enrolled: true, message: "Enrolled in free course" });
      }
    } else {
      // Demo mode — simulate free enrollment
      return NextResponse.json({
        enrolled: true,
        message: "Demo mode: enrolled (no payment required)",
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const session = await createCheckoutSession({
      courseId,
      courseTitle,
      amount: Math.round(price * 100),
      currency: "THB",
      userId: user!.id,
      userEmail: user!.email!,
      successUrl: `${appUrl}/dashboard/student?enrolled=${courseId}`,
      cancelUrl: `${appUrl}/courses/${courseId}`,
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

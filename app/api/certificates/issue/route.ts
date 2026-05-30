import { NextResponse } from "next/server";
import { apiRequireAuth } from "@/lib/auth/helpers";
import { generateCertNumber } from "@/lib/utils/certificate";

export async function POST(request: Request) {
  const { user, error } = await apiRequireAuth();
  if (error) return error;

  const body = await request.json().catch(() => ({})) as { courseId?: string };
  const { courseId } = body;

  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 422 });
  }

  const hasDatabase = Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL?.includes("placeholder");

  if (!hasDatabase) {
    const certNumber = generateCertNumber();
    return NextResponse.json({
      data: {
        certNumber,
        studentName: user!.name,
        issuedAt: new Date().toISOString(),
        mode: "demo",
      },
    }, { status: 201 });
  }

  const { prisma } = await import("@/lib/db/prisma");

  // Verify enrollment is completed
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user!.id, courseId } },
    include: { course: true },
  });

  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 });
  }

  if (!enrollment.completedAt) {
    return NextResponse.json({ error: "Course not yet completed" }, { status: 400 });
  }

  // Upsert — idempotent
  const existing = await prisma.certificate.findFirst({
    where: { userId: user!.id, courseId },
  });

  if (existing) {
    return NextResponse.json({ data: existing });
  }

  const certNumber = generateCertNumber();
  const cert = await prisma.certificate.create({
    data: { certNumber, userId: user!.id, courseId },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  });

  // Send email notification (fire & forget)
  import("@/lib/services/resend").then(({ sendCertificateEmail }) => {
    sendCertificateEmail(
      cert.user.email,
      cert.user.name,
      cert.course.title,
      cert.certNumber
    ).catch(console.error);
  });

  return NextResponse.json({ data: cert }, { status: 201 });
}

import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ certId: string }> }
) {
  const { certId } = await params;
  const hasDatabase = Boolean(process.env.DATABASE_URL);

  if (!hasDatabase) {
    // Demo certificate
    return NextResponse.json({
      data: {
        certNumber: certId,
        studentName: "Oak Demo Student",
        courseTitle: "English for Beginners",
        issuedAt: new Date().toISOString(),
        isValid: true,
        mode: "demo",
      },
    });
  }

  const { prisma } = await import("@/lib/db/prisma");
  const cert = await prisma.certificate.findUnique({
    where: { certNumber: certId },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  });

  if (!cert) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      certNumber: cert.certNumber,
      studentName: cert.user.name,
      courseTitle: cert.course.title,
      issuedAt: cert.issuedAt.toISOString(),
      isValid: true,
    },
  });
}

import { NextResponse } from "next/server";
import { apiRequireAuth } from "@/lib/auth/helpers";

export async function GET() {
  const { user, error } = await apiRequireAuth();
  if (error) return error;

  const hasDatabase = Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL?.includes("placeholder");

  if (!hasDatabase) {
    return NextResponse.json({
      data: [
        {
          id: "demo-pay-1",
          courseTitle: "English for Beginners",
          amount: 0,
          currency: "THB",
          status: "completed",
          createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        },
      ],
      mode: "demo",
    });
  }

  const { prisma } = await import("@/lib/db/prisma");
  const payments = await prisma.payment.findMany({
    where: { userId: user!.id },
    include: { course: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    data: payments.map((p) => ({
      id: p.id,
      courseTitle: p.course.title,
      amount: Number(p.amount),
      currency: p.currency,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
    })),
  });
}

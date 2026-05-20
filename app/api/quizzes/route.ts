import { NextResponse } from "next/server";
import { QUIZZES } from "@/mock/learning";
import { apiRequireRole } from "@/lib/auth/helpers";

export async function GET() {
  return NextResponse.json({ data: QUIZZES, total: QUIZZES.length });
}

export async function POST() {
  const { error } = await apiRequireRole(["instructor", "admin", "super_admin"]);
  if (error) return error;

  return NextResponse.json({
    error: "Quiz creation requires instructor DB workflow. Connect Neon DB to enable.",
  }, { status: 501 });
}

import { NextResponse } from "next/server";
import crypto from "crypto";
import { forgotPasswordSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 422 });
    }

    const { email } = parsed.data;
    const hasDatabase = Boolean(process.env.DATABASE_URL);

    if (!hasDatabase) {
      // Demo mode — always return success to avoid user enumeration
      return NextResponse.json({
        message: "If an account exists for that email, a reset link has been sent.",
      });
    }

    const { prisma } = await import("@/lib/db/prisma");
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.verificationToken.upsert({
        where: { identifier_token: { identifier: email, token: "reset" } },
        update: { token, expires },
        create: { identifier: email, token, expires },
      });

      const { sendPasswordResetEmail } = await import("@/lib/services/resend");
      await sendPasswordResetEmail(email, user.name, token);
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: "If an account exists for that email, a reset link has been sent.",
    });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

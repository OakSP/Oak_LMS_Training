import { NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/services/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  try {
    const event = await constructWebhookEvent(rawBody, signature);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as {
        metadata?: { courseId?: string; userId?: string };
        payment_intent?: string;
        amount_total?: number;
        currency?: string;
      };

      const { courseId, userId } = session.metadata ?? {};
      if (!courseId || !userId) {
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
      }

      const hasDatabase = Boolean(process.env.DATABASE_URL);
      if (hasDatabase) {
        const { prisma } = await import("@/lib/db/prisma");

        // Upsert enrollment
        await prisma.enrollment.upsert({
          where: { userId_courseId: { userId, courseId } },
          update: {},
          create: { userId, courseId },
        });

        // Record payment
        await prisma.payment.create({
          data: {
            userId,
            courseId,
            amount: (session.amount_total ?? 0) / 100,
            currency: (session.currency ?? "THB").toUpperCase(),
            status: "completed",
            stripeId: typeof session.payment_intent === "string" ? session.payment_intent : null,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

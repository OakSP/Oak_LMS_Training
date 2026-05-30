import Stripe from "stripe";

const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY);

export interface CheckoutSessionParams {
  courseId: string;
  courseTitle: string;
  amount: number; // in smallest unit (satang / cents)
  currency: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
}

function getStripe(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function createCheckoutSession(
  params: CheckoutSessionParams
): Promise<CheckoutSession> {
  if (!hasStripe) {
    return {
      id: `demo_session_${Date.now()}`,
      url: `${params.successUrl}?session_id=demo&course=${params.courseId}`,
    };
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: params.userEmail,
    line_items: [
      {
        price_data: {
          currency: params.currency.toLowerCase(),
          unit_amount: params.amount,
          product_data: { name: params.courseTitle },
        },
        quantity: 1,
      },
    ],
    success_url: `${params.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: params.cancelUrl,
    metadata: { courseId: params.courseId, userId: params.userId },
  });

  return { id: session.id, url: session.url! };
}

export async function constructWebhookEvent(rawBody: string, signature: string) {
  if (!hasStripe) throw new Error("Stripe not configured");
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
}

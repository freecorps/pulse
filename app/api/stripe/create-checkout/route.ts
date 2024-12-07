import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey
  ? new Stripe(stripeKey, {
      apiVersion: "2024-11-20.acacia",
    })
  : null;

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Serviço de pagamento não está configurado" },
      { status: 503 }
    );
  }

  try {
    const { userId, userEmail, planType, successUrl, cancelUrl } =
      await req.json();

    if (!userId || !userEmail || !planType || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: "Parâmetros obrigatórios faltando" },
        { status: 400 }
      );
    }

    const priceId =
      planType === "monthly"
        ? process.env.STRIPE_MONTHLY_PRICE_ID
        : process.env.STRIPE_YEARLY_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID não encontrado para o plano ${planType}` },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        planType,
        userEmail,
        successUrl,
      },
      customer_email: userEmail,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Erro ao criar sessão de checkout" },
      { status: 500 }
    );
  }
}

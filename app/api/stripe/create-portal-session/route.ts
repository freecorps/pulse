import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Client, Databases, Query } from "node-appwrite";

const appwriteKey = process.env.APPWRITE_API_KEY;
const stripeKey = process.env.STRIPE_SECRET_KEY;

const client = appwriteKey
  ? new Client()
      .setEndpoint("https://appwrite.freecorps.xyz/v1")
      .setProject("pulse")
      .setKey(appwriteKey)
  : null;

const databases = client ? new Databases(client) : null;
const stripe = stripeKey
  ? new Stripe(stripeKey, {
      apiVersion: "2024-11-20.acacia",
    })
  : null;

export async function POST(req: Request) {
  if (!stripe || !databases || !client) {
    return NextResponse.json(
      { error: "Serviços necessários não estão configurados" },
      { status: 503 }
    );
  }

  try {
    const { userId, returnUrl } = await req.json();

    if (!userId || !returnUrl) {
      return NextResponse.json(
        { error: "Parâmetros obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Busca o documento do cliente no Appwrite
    const customerDocs = await databases.listDocuments("stripe", "customer", [
      Query.equal("userId", userId),
      Query.equal("status", "active"),
    ]);

    if (customerDocs.total === 0) {
      return NextResponse.json(
        { error: "Assinatura não encontrada" },
        { status: 404 }
      );
    }

    const customerDoc = customerDocs.documents[0] as unknown as {
      customerId: string;
    };

    // Cria a sessão do portal do cliente usando o customerId armazenado
    const session = await stripe.billingPortal.sessions.create({
      customer: customerDoc.customerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: "Erro ao criar sessão do portal" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Client, Teams, Databases } from "node-appwrite";
import { Permission, Query, Role } from "appwrite";
import { ID } from "appwrite";

const appwriteKey = process.env.APPWRITE_API_KEY;
const stripeKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const client = appwriteKey
  ? new Client()
      .setEndpoint("https://appwrite.freecorps.xyz/v1")
      .setProject("pulse")
      .setKey(appwriteKey)
  : null;

const teams = client ? new Teams(client) : null;
const databases = client ? new Databases(client) : null;
const stripe = stripeKey
  ? new Stripe(stripeKey, {
      apiVersion: "2024-11-20.acacia",
    })
  : null;

export async function POST(req: Request) {
  if (!stripe || !teams || !databases || !webhookSecret) {
    return NextResponse.json(
      { error: "Serviços necessários não estão configurados" },
      { status: 503 }
    );
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const userEmail = session.metadata?.userEmail;
        const planType = session.metadata?.planType;
        const successUrl = session.metadata?.successUrl;
        const customerId = session.customer as string;

        if (!userId) {
          throw new Error("User ID not found in session metadata");
        }

        try {
          // Cria membership
          await teams.createMembership(
            "premium",
            ["premium"],
            userEmail,
            userId,
            undefined,
            successUrl
          );

          // Cria documento do cliente Stripe (sem createdAt e updatedAt)
          await databases.createDocument(
            "stripe",
            "customer",
            ID.unique(),
            {
              userId: userId,
              customerId: customerId,
              email: userEmail,
              planType: planType,
              status: "active",
            },
            [
              Permission.read(Role.user(userId)), // Apenas o próprio usuário pode ler
            ]
          );
        } catch (error) {
          console.error("Error in checkout completion:", error);
          throw error;
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          try {
            // Lista memberships usando Server SDK
            const memberships = await teams.listMemberships("premium", [
              Query.equal("userId", userId),
            ]);

            if (memberships.total > 0) {
              // Remove membership usando Server SDK
              await teams.deleteMembership(
                "premium",
                memberships.memberships[0].$id
              );
            }
          } catch (error) {
            console.error("Error removing premium membership:", error);
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const userId = invoice.metadata?.userId;

        if (userId) {
          try {
            const memberships = await teams.listMemberships("premium", [
              Query.equal("userId", userId),
            ]);

            if (memberships.total > 0) {
              // Remove membership usando Server SDK
              await teams.deleteMembership(
                "premium",
                memberships.memberships[0].$id
              );
            }
          } catch (error) {
            console.error("Error handling failed payment:", error);
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";

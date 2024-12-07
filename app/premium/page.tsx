"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, PartyPopper, Sparkles, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { useAuthStore } from "@/app/stores/AuthStore";
import { teams } from "@/app/appwrite";
import { Query } from "appwrite";
import confetti from "canvas-confetti";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";

const benefits = [
  "Acesso antecipado a notícias exclusivas",
  "Sem anúncios em todo o site",
  "Badge premium exclusiva",
  "Acesso a análises detalhadas",
  "Conteúdo especial da comunidade",
  "Suporte prioritário",
  "Participação em sorteios exclusivos",
  "Descontos em eventos parceiros",
];

export default function PremiumPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly"
  );
  const [isPremium, setIsPremium] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    async function checkPremiumStatus() {
      if (!user) return;

      try {
        const premiumMembership = await teams.listMemberships("premium", [
          Query.equal("userId", user.$id),
        ]);
        const hasPremium = premiumMembership.total > 0;
        setIsPremium(hasPremium);

        if (hasPremium) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (error) {
        console.error("Erro ao verificar status premium:", error);
      }
    }

    checkPremiumStatus();
  }, [user]);

  const prices = {
    monthly: {
      price: 19.0,
      period: "mês",
    },
    yearly: {
      price: 14.25,
      period: "mês",
      savings: "Economize 25%",
    },
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para assinar");
      return;
    }

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.$id,
          userEmail: user.email,
          planType: billingCycle,
          successUrl: `${window.location.origin}/premium?success=true`,
          cancelUrl: `${window.location.origin}/premium?canceled=true`,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar sessão de checkout");
      }

      const { sessionId } = await response.json();

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
      );
      if (!stripe) {
        throw new Error("Falha ao carregar Stripe");
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ocorreu um erro ao processar sua assinatura");
    }
  };

  const handleManageSubscription = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para acessar sua assinatura");
      return;
    }

    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.$id,
          returnUrl: window.location.origin + "/premium",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar sessão do portal");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ocorreu um erro ao acessar o portal de assinatura");
    }
  };

  if (isPremium) {
    return (
      <div>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="container max-w-2xl py-20 space-y-8 text-center">
            <div className="flex justify-center">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors border-transparent bg-primary text-primary-foreground">
                <PartyPopper className="mr-2 h-4 w-4" />
                Usuário Premium
              </div>
            </div>
            <h1 className="text-4xl font-bold">Obrigado por ser Premium!</h1>
            <p className="text-xl text-muted-foreground">
              Estamos muito felizes em ter você como membro premium. Aproveite
              todos os benefícios exclusivos!
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-blue-500"
              onClick={handleManageSubscription}
              disabled={!user}
            >
              Ver Minha Assinatura
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center">
        <div className="container max-w-6xl py-20 space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                <Sparkles className="mr-1 h-3 w-3" />
                Acesso Premium
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Eleve sua experiência gaming
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Desbloqueie conteúdo exclusivo, seja o primeiro a saber das
              novidades e faça parte de uma comunidade premium de gamers.
            </p>
          </div>

          {/* Pricing Toggle */}
          <div className="flex justify-center gap-4 items-center">
            <Button
              variant={billingCycle === "monthly" ? "default" : "outline"}
              onClick={() => setBillingCycle("monthly")}
            >
              Mensal
            </Button>
            <Button
              variant={billingCycle === "yearly" ? "default" : "outline"}
              onClick={() => setBillingCycle("yearly")}
              className="relative"
            >
              Anual
              {billingCycle === "yearly" && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-black">
                  -25%
                </span>
              )}
            </Button>
          </div>

          {/* Pricing Card */}
          <div className="flex justify-center">
            <Card className="w-full max-w-lg border-2 relative overflow-hidden">
              {billingCycle === "yearly" && (
                <div className="absolute top-5 right-5">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Melhor valor
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Pulse Premium
                </CardTitle>
                <CardDescription>
                  Acesso completo a todo conteúdo exclusivo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="text-3xl font-bold">
                    R$ {prices[billingCycle].price.toFixed(2)}
                    <span className="text-lg font-normal text-muted-foreground">
                      /{prices[billingCycle].period}
                    </span>
                  </div>
                  {billingCycle === "yearly" && (
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                      {prices.yearly.savings} no plano anual
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  className={cn(
                    "w-full text-lg hover:scale-105 transition-transform",
                    "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
                  )}
                  onClick={handleSubscribe}
                >
                  Começar agora
                  {billingCycle === "yearly" && (
                    <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      2 meses grátis
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">
              Perguntas Frequentes
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Como funciona o Premium?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Após a assinatura, você terá acesso instantâneo a todo o
                    conteúdo premium, incluindo notícias exclusivas, análises
                    detalhadas e benefícios especiais.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Posso cancelar a qualquer momento?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sim! Você pode cancelar sua assinatura a qualquer momento.
                    Não há contratos longos ou taxas de cancelamento.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Como funciona o desconto anual?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Ao escolher o plano anual, você economiza 25% em comparação
                    ao plano mensal, além de ganhar 2 meses grátis!
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Preciso de cartão de crédito?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Aceitamos diversas formas de pagamento, incluindo cartão de
                    crédito, PIX e boleto bancário.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

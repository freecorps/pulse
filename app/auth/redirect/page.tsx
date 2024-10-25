"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/app/stores/AuthStore";

function RedirectSession() {
  const searchParams = useSearchParams();
  const secret = searchParams.get("secret");
  const userId = searchParams.get("userId");
  const router = useRouter();

  const { createSession, error, loading, user, setMfaChallengeRequired } =
    useAuthStore();

  useEffect(() => {
    async function create() {
      if (secret && userId) {
        await createSession(userId, secret);
      } else {
        router.push("/auth");
      }
    }
    create();
  }, [secret, userId, createSession, router]);

  useEffect(() => {
    if (
      error === "More factors are required to complete the sign in process."
    ) {
      setMfaChallengeRequired(true);
      router.push("/auth/");
    }
  }, [error, setMfaChallengeRequired, router]);

  if (user) {
    router.push("/");
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>
          {loading
            ? "Criando sua sessão..."
            : "Sessão criada, redirecionando..."}
        </CardTitle>
        <CardDescription>
          {error && <span className="text-red-500">{error}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>{loading && <div>Por favor, aguarde...</div>}</CardContent>
    </Card>
  );
}

function RedirectPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Suspense fallback={<div>Carregando...</div>}>
        <RedirectSession />
      </Suspense>
    </div>
  );
}

export default RedirectPage;

"use client";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { useAuthStore } from "../stores/AuthStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { teams } from "@/app/appwrite";
import { useEffect, useState } from "react";
import { Query } from "appwrite";

const ClientAuthCheck = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const [isEditor, setIsEditor] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkEditorPermission() {
      if (!user) {
        setIsEditor(false);
        setIsLoading(false);
        return;
      }

      try {
        const membershipList = await teams.listMemberships("editor", [
          Query.equal("userId", user.$id),
        ]);

        setIsEditor(membershipList.total > 0);
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        setIsEditor(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkEditorPermission();
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8 space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">Verificando permissões...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl py-8 space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4">
          <div className="text-lg font-medium">
            Você precisa estar logado para acessar esta página
          </div>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="default">
              <Link href="/auth">Fazer Login</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">Voltar para Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isEditor) {
    return (
      <div className="container mx-auto max-w-4xl py-8 space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4">
          <div className="text-lg font-medium">
            Você não tem permissão para acessar esta área.
          </div>
          <div className="text-sm text-muted-foreground">
            Esta área é restrita para editores.
          </div>
          <Button asChild variant="secondary">
            <Link href="/">Voltar para Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <ClientAuthCheck>
        <div className="container mx-auto max-w-4xl py-8 space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </ClientAuthCheck>
      <Footer />
    </>
  );
}

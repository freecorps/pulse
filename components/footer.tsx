"use client";
import Link from "next/link";
import { z } from "zod";
import AutoForm, { AutoFormSubmit } from "./ui/auto-form";
import { toast } from "sonner";

export default function Footer() {
  const newsForm = z.object({
    email: z.string().email(),
  });

  const formSubmit = async ({ email }: { email: string }) => {
    toast.promise(
      fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to subscribe");
          }
          return response.json();
        })
        .then(() => {
          toast.success("Inscrição realizada com sucesso!");
        })
        .catch(() => {
          toast.error("Erro ao realizar inscrição. Tente novamente.");
        }),
      {
        loading: "Enviando...",
        success: "Inscrição realizada com sucesso!",
        error: "Erro ao realizar inscrição. Tente novamente.",
      }
    );
  };

  return (
    <footer className="w-full bg-background text-foreground border-t mt-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Logo e Descrição */}
          <div className="flex flex-col lg:max-w-xs">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">Pulse</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Seu destino para todas as novidades e atualizações dos seus jogos
              favoritos.
            </p>
          </div>

          {/* Links em linha */}
          <div className="flex flex-wrap gap-8 lg:gap-12">
            {/* Jogos */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Jogos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/games/valorant"
                    className="hover:text-primary transition-colors"
                  >
                    Valorant
                  </Link>
                </li>
                <li>
                  <Link
                    href="/games/lol"
                    className="hover:text-primary transition-colors"
                  >
                    League of Legends
                  </Link>
                </li>
                <li>
                  <Link
                    href="/games/counter-strike"
                    className="hover:text-primary transition-colors"
                  >
                    Counter-Strike
                  </Link>
                </li>
                <li>
                  <Link
                    href="/games"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Ver todos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Links Úteis */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Links Úteis</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/news"
                    className="hover:text-primary transition-colors"
                  >
                    Notícias
                  </Link>
                </li>
                <li>
                  <Link
                    href="/forum"
                    className="hover:text-primary transition-colors"
                  >
                    Fórum
                  </Link>
                </li>
                <li>
                  <Link
                    href="/editors"
                    className="hover:text-primary transition-colors"
                  >
                    Editores
                  </Link>
                </li>
                <li>
                  <Link
                    href="/premium"
                    className="hover:text-primary transition-colors"
                  >
                    Premium
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sobre */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Sobre</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-primary transition-colors"
                  >
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-primary transition-colors"
                  >
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-primary transition-colors"
                  >
                    Contato
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary transition-colors"
                  >
                    Sobre Nós
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="lg:max-w-xs">
              <h3 className="text-sm font-semibold mb-3">Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Fique por dentro das últimas atualizações!
              </p>
              <AutoForm
                className="space-y-2"
                formSchema={newsForm}
                onSubmit={formSubmit}
              >
                <AutoFormSubmit className="w-full text-sm">
                  Inscrever-se
                </AutoFormSubmit>
              </AutoForm>
            </div>
          </div>
        </div>

        {/* Copyright e Redes Sociais */}
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FreeCorps. Todos os direitos
            reservados.
          </p>
          <div className="flex gap-4">
            <Link
              href="https://twitter.com/pulse"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              𝕏
            </Link>
            <Link
              href="https://instagram.com/pulse"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Instagram
            </Link>
            <Link
              href="https://discord.gg/pulse"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Discord
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

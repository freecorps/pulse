"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaTwitch,
  FaYoutube,
} from "react-icons/fa";
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
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold">Pulse</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Seu destino para todas as novidades e atualizações dos seus jogos
              favoritos.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Jogos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jogos/lol" className="hover:underline">
                  League of Legends
                </Link>
              </li>
              <li>
                <Link href="/jogos/fortnite" className="hover:underline">
                  Fortnite
                </Link>
              </li>
              <li>
                <Link href="/jogos/csgo" className="hover:underline">
                  CS:GO
                </Link>
              </li>
              <li>
                <Link href="/jogos/valorant" className="hover:underline">
                  Valorant
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Conteúdo</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/patch-notes" className="hover:underline">
                  Patch Notes
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="hover:underline">
                  Notícias
                </Link>
              </li>
              <li>
                <Link href="/guias" className="hover:underline">
                  Guias
                </Link>
              </li>
              <li>
                <Link href="/eventos" className="hover:underline">
                  Eventos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm mb-4 text-muted-foreground">
              Fique por dentro das últimas atualizações!
            </p>
            <AutoForm
              className="space-y-2"
              formSchema={newsForm}
              onSubmit={formSubmit}
            >
              <AutoFormSubmit className="w-full">Inscrever-se</AutoFormSubmit>
            </AutoForm>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FreeCorps. Todos os direitos
            reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors"
              aria-label="Twitch"
            >
              <FaTwitch size={20} />
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors"
              aria-label="YouTube"
            >
              <FaYoutube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "@/components/footer";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Mensagem enviada com sucesso!");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-16">
        <div className="container max-w-4xl py-8 space-y-8 px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Entre em Contato</h1>
            <p className="text-muted-foreground">
              Estamos aqui para ajudar. Entre em contato conosco por qualquer um
              dos meios abaixo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8 place-items-center max-w-2xl mx-auto">
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <Mail className="h-10 w-10 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {siteConfig.contact.email}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <MessageCircle className="h-10 w-10 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Discord</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {siteConfig.contact.discord}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Formulário de Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Seu nome completo" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    placeholder="Assunto da mensagem"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    placeholder="Digite sua mensagem aqui..."
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

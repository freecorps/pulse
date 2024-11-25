"use client";
import { databases } from "@/app/appwrite";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ID, Permission, Role } from "appwrite";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/app/stores/AuthStore";

interface ForumPost {
  title: string;
  description: string;
  content: string;
}

const initialForm: ForumPost = {
  title: "",
  description: "",
  content: "",
};

export default function CreateForumPost() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState<ForumPost>(initialForm);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="container max-w-4xl py-8 space-y-8">
        <h1 className="text-2xl font-bold">
          Você precisa estar logado para criar uma discussão
        </h1>
        <Button onClick={() => router.push("/login")}>
          Ir para a página de login
        </Button>
      </div>
    );
  }

  const createPost = async () => {
    try {
      setIsLoading(true);

      if (!form.title || !form.content) {
        toast.error("Título e conteúdo são obrigatórios");
        return;
      }

      await databases.createDocument("forum", "posts", ID.unique(), form, [
        Permission.read(Role.any()),
        Permission.write(Role.user(user?.$id)),
        Permission.update(Role.user(user?.$id)),
        Permission.delete(Role.user(user?.$id)),
      ]);

      toast.success("Post criado com sucesso!");
      router.push("/forum");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar o post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldUpdate = (field: keyof ForumPost, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Criar Nova Discussão</h1>
        <p className="text-muted-foreground">
          Compartilhe seus pensamentos com a comunidade.
        </p>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => handleFieldUpdate("title", e.target.value)}
              placeholder="Digite o título da sua discussão"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição Curta</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => handleFieldUpdate("description", e.target.value)}
              placeholder="Uma breve descrição do seu post"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo *</Label>
            <Textarea
              id="content"
              value={form.content}
              onChange={(e) => handleFieldUpdate("content", e.target.value)}
              placeholder="Escreva o conteúdo do seu post"
              className="min-h-[200px]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push("/forum")}>
          Cancelar
        </Button>
        <Button onClick={createPost} disabled={isLoading}>
          {isLoading ? "Criando..." : "Criar Discussão"}
        </Button>
      </div>
    </div>
  );
}

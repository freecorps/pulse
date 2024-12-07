"use client";
import { databases } from "@/app/appwrite";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ID, Permission, Role, Query } from "appwrite";
import { useAuthStore } from "@/app/stores/AuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileInput } from "@/components/ui/file-input/FileInput";

interface ProfileForm {
  handler: string;
  imgURL: string;
}

const initialForm: ProfileForm = {
  handler: "",
  imgURL: "",
};

export default function CreateForumProfile() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (user) {
      checkExistingProfile();
    }
  }, [user]);

  const checkExistingProfile = async () => {
    try {
      const response = await databases.listDocuments("forum", "perfil", [
        Query.equal("userId", user?.$id as string),
      ]);

      if (response.total > 0) {
        setHasProfile(true);
        router.push("/forum");
        toast.error("Você já possui um perfil no fórum");
      }
    } catch (error) {
      console.error("Erro ao verificar perfil:", error);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acesso Negado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Você precisa estar logado para criar um perfil
          </p>
          <Button onClick={() => router.push("/auth")}>
            Ir para a página de login
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (hasProfile) {
    return null; // Não renderiza nada, pois o usuário será redirecionado
  }

  const createProfile = async () => {
    try {
      setIsLoading(true);

      if (!form.handler || !form.imgURL) {
        toast.error("Todos os campos são obrigatórios");
        return;
      }

      // Verifica se o handler já existe
      const existingHandler = await databases.listDocuments("forum", "perfil", [
        Query.equal("handler", form.handler),
      ]);

      if (existingHandler.total > 0) {
        toast.error("Este nome de usuário já está em uso");
        return;
      }

      await databases.createDocument(
        "forum",
        "perfil",
        ID.unique(),
        {
          ...form,
          userId: user.$id,
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );

      toast.success("Perfil criado com sucesso!");
      router.push("/forum");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar o perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldUpdate = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Criar Perfil do Fórum</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="handler">Nome de Usuário *</Label>
            <Input
              id="handler"
              value={form.handler}
              onChange={(e) => handleFieldUpdate("handler", e.target.value)}
              placeholder="Como você quer ser conhecido no fórum"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imgURL">Foto do Perfil *</Label>
            <FileInput
              value={form.imgURL}
              onChange={(value) => handleFieldUpdate("imgURL", value)}
              placeholder="Selecione ou cole o link da sua foto de perfil"
              bucketId="forumFiles"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push("/forum")}>
            Cancelar
          </Button>
          <Button onClick={createProfile} disabled={isLoading}>
            {isLoading ? "Criando..." : "Criar Perfil"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

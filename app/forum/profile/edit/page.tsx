"use client";
import { databases } from "@/app/appwrite";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Query } from "appwrite";
import { useAuthStore } from "@/app/stores/AuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileInput } from "@/components/ui/file-input/FileInput";
import { Perfil } from "@/typesForum/appwrite";
import { getUserProfile } from "../../utils/profile";
import { Loader2 } from "lucide-react";

interface ProfileForm {
  handler: string;
  imgURL: string;
}

export default function EditForumProfile() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>({ handler: "", imgURL: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Perfil | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const userProfile = await getUserProfile(user?.$id || "");
      if (!userProfile) {
        toast.error("Perfil não encontrado");
        router.push("/forum/profile/new");
        return;
      }
      setProfile(userProfile);
      setForm({
        handler: userProfile.handler,
        imgURL: userProfile.imgURL,
      });
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      toast.error("Erro ao carregar perfil");
    } finally {
      setIsLoadingProfile(false);
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
            Você precisa estar logado para editar seu perfil
          </p>
          <Button onClick={() => router.push("/auth")}>
            Ir para a página de login
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingProfile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const updateProfile = async () => {
    try {
      setIsLoading(true);

      if (!form.handler || !form.imgURL) {
        toast.error("Todos os campos são obrigatórios");
        return;
      }

      if (form.handler !== profile?.handler) {
        // Verifica se o novo handler já existe
        const existingHandler = await databases.listDocuments(
          "forum",
          "perfil",
          [
            Query.equal("handler", form.handler),
            Query.notEqual("userId", user.$id),
          ]
        );

        if (existingHandler.total > 0) {
          toast.error("Este nome de usuário já está em uso");
          return;
        }
      }

      await databases.updateDocument("forum", "perfil", profile?.$id || "", {
        handler: form.handler,
        imgURL: form.imgURL,
      });

      toast.success("Perfil atualizado com sucesso!");
      router.push("/forum");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar o perfil");
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
        <CardTitle>Editar Perfil do Fórum</CardTitle>
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
            {form.imgURL && (
              <div className="mt-2">
                <img
                  src={form.imgURL}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push("/forum")}>
            Cancelar
          </Button>
          <Button onClick={updateProfile} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

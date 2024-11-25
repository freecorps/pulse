"use client";
import { databases } from "@/app/appwrite";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ID, Permission, Role } from "appwrite";

interface GameForm {
  name: string;
  imageURL: string;
  abbreviation?: string;
  IamgeURLUpper?: string;
}

const initialForm: GameForm = {
  name: "",
  imageURL: "",
  abbreviation: "",
  IamgeURLUpper: "",
};

export default function CreateGame() {
  const router = useRouter();
  const [form, setForm] = useState<GameForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);

  const createGame = async () => {
    try {
      setIsLoading(true);

      if (!form.name || !form.imageURL) {
        toast.error("Nome e imagem são obrigatórios");
        return;
      }

      await databases.createDocument("News", "games", ID.unique(), form, [
        Permission.read(Role.any()),
        Permission.write(Role.team("editor")),
        Permission.update(Role.team("editor")),
        Permission.delete(Role.team("editor")),
      ]);

      toast.success("Jogo criado com sucesso!");
      router.push("/editor/games");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar o jogo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldUpdate = (field: keyof GameForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Adicionar Novo Jogo</h1>
        <p className="text-muted-foreground">
          Preencha as informações do jogo.
        </p>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Jogo *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleFieldUpdate("name", e.target.value)}
              placeholder="Digite o nome do jogo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abbreviation">Abreviação</Label>
            <Input
              id="abbreviation"
              value={form.abbreviation}
              onChange={(e) =>
                handleFieldUpdate("abbreviation", e.target.value)
              }
              placeholder="Ex: LOL, CSGO, etc"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageURL">URL da Imagem *</Label>
            <Input
              id="imageURL"
              value={form.imageURL}
              onChange={(e) => handleFieldUpdate("imageURL", e.target.value)}
              placeholder="URL da imagem do jogo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="IamgeURLUpper">URL da Imagem de Capa</Label>
            <Input
              id="IamgeURLUpper"
              value={form.IamgeURLUpper}
              onChange={(e) =>
                handleFieldUpdate("IamgeURLUpper", e.target.value)
              }
              placeholder="URL da imagem de capa (opcional)"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push("/editor/games")}>
          Cancelar
        </Button>
        <Button onClick={createGame} disabled={isLoading}>
          {isLoading ? "Criando..." : "Criar Jogo"}
        </Button>
      </div>
    </div>
  );
}

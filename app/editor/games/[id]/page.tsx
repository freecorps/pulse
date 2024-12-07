"use client";
import { databases } from "@/app/appwrite";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Games } from "@/types/appwrite";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { use } from "react";

interface EditGameProps {
  params: Promise<{ id: string }>;
}

export default function EditGame({ params }: EditGameProps) {
  const { id } = use(params);
  const router = useRouter();
  const [game, setGame] = useState<Games | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const fetchedGame = await databases.getDocument("News", "games", id);
        setGame(fetchedGame as Games);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao buscar o jogo");
        router.push("/editor/games");
      }
    };

    if (id) {
      fetchGame();
    }
  }, [id, router]);

  const handleFieldUpdate = async (field: keyof Games, value: string) => {
    if (!game) return;

    setGame((prev) => (prev ? { ...prev, [field]: value } : null));

    try {
      await databases.updateDocument("News", "games", id, {
        [field]: value,
      });
      toast.success("Alterações salvas");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar alterações");
    }
  };

  if (!game) return <div>Carregando...</div>;

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Editar Jogo</h1>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Jogo *</Label>
            <Input
              id="name"
              value={game.name}
              onChange={(e) => handleFieldUpdate("name", e.target.value)}
              placeholder="Digite o nome do jogo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abbreviation">Abreviação</Label>
            <Input
              id="abbreviation"
              value={game.abbreviation || ""}
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
              value={game.imageURL}
              onChange={(e) => handleFieldUpdate("imageURL", e.target.value)}
              placeholder="URL da imagem do jogo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="IamgeURLUpper">URL da Imagem de Capa</Label>
            <Input
              id="IamgeURLUpper"
              value={game.IamgeURLUpper || ""}
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
          Voltar
        </Button>
      </div>
    </div>
  );
}

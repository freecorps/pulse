"use client";
import { databases } from "@/app/appwrite";
import { Games } from "@/types/appwrite";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

export default function GamesIndex() {
  const router = useRouter();
  const [games, setGames] = useState<Games[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await databases.listDocuments("News", "games");
        setGames(response.documents as Games[]);
      } catch (error) {
        toast.error("Erro ao carregar os jogos");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Jogos</h1>
        <Button onClick={() => router.push("/editor/games/new")}>
          Novo Jogo
        </Button>
      </div>

      <div className="grid gap-4">
        {games.map((game) => (
          <div
            key={game.$id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              {game.imageURL && (
                <Image
                  src={game.imageURL}
                  alt={game.name}
                  width={48}
                  height={48}
                  className="rounded-lg"
                  unoptimized
                />
              )}
              <div>
                <h2 className="font-semibold">{game.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {game.abbreviation || "Sem abreviação"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push(`/editor/games/${game.$id}`)}
            >
              Editar
            </Button>
          </div>
        ))}

        {games.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Nenhum jogo encontrado
          </p>
        )}
      </div>
    </div>
  );
}

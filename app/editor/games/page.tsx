"use client";
import { databases } from "@/app/appwrite";
import { Games } from "@/types/appwrite";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

  const handleDelete = async (gameId: string) => {
    try {
      await databases.deleteDocument("News", "games", gameId);
      setGames(games.filter((game) => game.$id !== gameId));
      toast.success("Jogo excluído com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir o jogo");
    }
  };

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
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/editor/games/${game.$id}`)}
              >
                Editar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Excluir</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir o jogo &ldquo;{game.name}
                      &rdquo;? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(game.$id)}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
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

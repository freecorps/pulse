"use client";
import { databases } from "@/app/appwrite";
import { Query } from "appwrite";
import { Posts } from "@/types/appwrite";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, GamepadIcon, Users } from "lucide-react";
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

interface Stats {
  posts: number;
  games: number;
  editors: number;
}

export default function EditorIndex() {
  const router = useRouter();
  const [recentPosts, setRecentPosts] = useState<Posts[]>([]);
  const [stats, setStats] = useState<Stats>({ posts: 0, games: 0, editors: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, gamesResponse, editorsResponse] =
          await Promise.all([
            databases.listDocuments("News", "posts", [
              Query.limit(25),
              Query.orderDesc("$createdAt"),
            ]),
            databases.listDocuments("News", "games"),
            databases.listDocuments("News", "editors"),
          ]);

        setRecentPosts(postsResponse.documents as Posts[]);
        setStats({
          posts: postsResponse.total,
          games: gamesResponse.total,
          editors: editorsResponse.total,
        });
      } catch (error) {
        toast.error("Erro ao carregar dados");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (postId: string) => {
    try {
      await databases.deleteDocument("News", "posts", postId);
      setRecentPosts(recentPosts.filter((post) => post.$id !== postId));
      toast.success("Notícia excluída com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir a notícia");
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Painel do Editor</h1>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total de Notícias
            </CardTitle>
            <Newspaper className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.posts}</div>
            <Button
              variant="link"
              className="px-0"
              onClick={() => router.push("/editor/posts")}
            >
              Ver todas
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Jogos Cadastrados
            </CardTitle>
            <GamepadIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.games}</div>
            <Button
              variant="link"
              className="px-0"
              onClick={() => router.push("/editor/games")}
            >
              Gerenciar jogos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Editores</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.editors}</div>
            <Button
              variant="link"
              className="px-0"
              onClick={() => router.push("/editor/editors")}
            >
              Gerenciar editores
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <div className="flex gap-4">
        <Button onClick={() => router.push("/editor/new")}>Nova Notícia</Button>
        <Button
          variant="outline"
          onClick={() => router.push("/editor/games/new")}
        >
          Novo Jogo
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/editor/editors/new")}
        >
          Novo Editor
        </Button>
      </div>

      {/* Notícias Recentes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Notícias Recentes</h2>
          <Button variant="link" onClick={() => router.push("/editor/posts")}>
            Ver todas
          </Button>
        </div>

        <div className="grid gap-4">
          {recentPosts.map((post) => (
            <Card key={post.$id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  {post.imageURL && (
                    <Image
                      src={post.imageURL}
                      alt={post.title}
                      width={80}
                      height={45}
                      className="rounded-md object-cover"
                      unoptimized
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.$createdAt).toLocaleDateString("pt-BR")} •{" "}
                      {post.type}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/editor/${post.$id}`)}
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
                          Tem certeza que deseja excluir a notícia &ldquo;
                          {post.title}
                          &rdquo;? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(post.$id)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

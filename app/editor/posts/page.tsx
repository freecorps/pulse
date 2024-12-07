"use client";
import { databases } from "@/app/appwrite";
import { Posts } from "@/types/appwrite";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
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

export default function PostsIndex() {
  const router = useRouter();
  const [posts, setPosts] = useState<Posts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await databases.listDocuments("News", "posts");
      setPosts(response.documents as Posts[]);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar as notícias");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await databases.deleteDocument("News", "posts", postId);
      setPosts(posts.filter((post) => post.$id !== postId));
      toast.success("Notícia excluída com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir a notícia");
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Notícias</h1>
        <Button onClick={() => router.push("/editor/new")}>Nova Notícia</Button>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
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
                        {post.title}&rdquo;? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(post.$id)}>
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}

        {posts.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma notícia encontrada
          </p>
        )}
      </div>
    </div>
  );
}

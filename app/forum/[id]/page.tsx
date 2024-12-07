"use client";
import { databases } from "@/app/appwrite";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/app/stores/AuthStore";
import { toast } from "sonner";
import { ID, Permission, Role } from "appwrite";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ForumPosts } from "@/types/appwrite";

export default function ForumPost() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [post, setPost] = useState<ForumPosts | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPost();
  }, []);

  const loadPost = async () => {
    try {
      const response = await databases.getDocument(
        "forum",
        "posts",
        params.id as string
      );
      setPost(response as ForumPosts);
    } catch (error) {
      console.error("Erro ao carregar post:", error);
      toast.error("Erro ao carregar o post");
      router.push("/forum");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para comentar");
      return;
    }

    if (!newComment.trim()) {
      toast.error("O comentário não pode estar vazio");
      return;
    }

    try {
      setIsSubmitting(true);

      await databases.createDocument(
        "forum",
        "comments",
        ID.unique(),
        {
          content: newComment,
          userId: user.$id,
          posts: post?.$id,
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );

      setNewComment("");
      toast.success("Comentário adicionado com sucesso!");
      await loadPost();
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      toast.error("Erro ao adicionar o comentário");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center">Carregando...</div>;
  }

  if (!post) {
    return <div className="text-center">Post não encontrado</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 space-y-8 px-4">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/forum">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Fórum
        </Link>
      </Button>

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>{post.title}</h1>
        {post.description && (
          <p className="text-muted-foreground">{post.description}</p>
        )}
        <div className="text-sm text-muted-foreground">
          Publicado em {new Date(post.$createdAt).toLocaleDateString("pt-BR")}
        </div>
        <div className="mt-8 whitespace-pre-wrap">{post.content}</div>
      </article>

      <div className="space-y-6 mt-8">
        <h2 className="text-2xl font-bold">Comentários</h2>

        {user ? (
          <div className="space-y-4">
            <Textarea
              placeholder="Escreva seu comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button onClick={handleSubmitComment} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Comentário"}
            </Button>
          </div>
        ) : (
          <div className="bg-muted p-4 rounded-lg">
            <p>Faça login para comentar</p>
            <Button asChild className="mt-2">
              <Link href="/auth">Fazer Login</Link>
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {post.comments?.map((comment) => (
            <div
              key={comment.$id}
              className="p-4 rounded-lg border border-border"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{comment.user?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(comment.$createdAt).toLocaleDateString("pt-BR")}
                  </div>
                </div>
                {user?.$id === comment.userId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      try {
                        await databases.deleteDocument(
                          "forum",
                          "comments",
                          comment.$id
                        );
                        toast.success("Comentário excluído com sucesso!");
                        await loadPost();
                      } catch (error) {
                        console.error("Erro ao excluir comentário:", error);
                        toast.error("Erro ao excluir o comentário");
                      }
                    }}
                  >
                    Excluir
                  </Button>
                )}
              </div>
              <p className="mt-2 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

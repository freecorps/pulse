"use client";
import { databases } from "@/app/appwrite";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/app/stores/AuthStore";
import { toast } from "sonner";
import { ID, Permission, Role, Query } from "appwrite";
import { ArrowLeft, MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { ForumPosts } from "@/types/appwrite";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getUserProfile } from "../utils/profile";

export default function ForumPost() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [post, setPost] = useState<ForumPosts | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalComments, setTotalComments] = useState(0);

  useEffect(() => {
    loadPost();
  }, []);

  const loadPost = async () => {
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        databases.getDocument("forum", "posts", params.id as string),
        databases.listDocuments("forum", "comments", [
          Query.equal("posts", [params.id as string]),
          Query.orderDesc("$createdAt"),
        ]),
      ]);

      const commentsWithProfiles = await Promise.all(
        commentsResponse.documents.map(async (comment) => {
          const profile = await getUserProfile(comment.userId);
          return { ...comment, perfil: profile };
        })
      );

      const postProfile = await getUserProfile(postResponse.userId);

      setPost({
        ...postResponse,
        perfil: postProfile,
        comments: commentsWithProfiles,
      } as unknown as ForumPosts);
      setTotalComments(commentsResponse.total);
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

    const userProfile = await getUserProfile(user.$id);
    if (!userProfile) {
      toast.error("Você precisa criar um perfil para comentar");
      router.push("/forum/profile/new");
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
          perfil: userProfile.$id,
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
    return (
      <div className="container max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Carregando discussão...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Discussão não encontrada</p>
            <Button asChild className="mt-4">
              <Link href="/forum">Voltar para o Fórum</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="py-6 space-y-6">
        <Button variant="ghost" asChild className="group -ml-2">
          <Link href="/forum" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Voltar para o Fórum
          </Link>
        </Button>

        <Card className="overflow-hidden border-primary/20">
          <CardContent className="p-6 space-y-6">
            {/* Cabeçalho do Post */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{post.title}</h1>
              {post.description && (
                <p className="text-lg text-muted-foreground">
                  {post.description}
                </p>
              )}

              <div className="flex items-center gap-4">
                <Link href={`/forum/profile/${post.perfil?.$id}`}>
                  <Avatar className="h-10 w-10 hover:ring-2 hover:ring-primary/50 transition-all">
                    <AvatarImage
                      src={post.perfil?.imgURL}
                      alt={post.perfil?.handler}
                    />
                    <AvatarFallback>{post.perfil?.handler?.[0]}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <p className="font-medium">{post.perfil?.handler}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(post.$createdAt).toLocaleDateString("pt-BR")}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      {totalComments} comentários
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Conteúdo do Post */}
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap">{post.content}</div>
            </div>
          </CardContent>
        </Card>

        {/* Seção de Comentários */}
        <Card className="border-primary/20">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              Comentários
            </h2>

            {user ? (
              <div className="space-y-4">
                <Textarea
                  placeholder="Compartilhe seus pensamentos..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Comentário"}
                </Button>
              </div>
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    Faça login para participar da discussão
                  </p>
                  <Button asChild>
                    <Link href="/auth">Fazer Login</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4 mt-6">
              {post.comments?.map((comment) => (
                <Card
                  key={comment.$id}
                  className="border-border/50 hover:border-primary/20 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Link href={`/forum/profile/${comment.perfil?.$id}`}>
                        <Avatar className="h-8 w-8 flex-shrink-0 hover:ring-2 hover:ring-primary/50 transition-all">
                          <AvatarImage
                            src={comment.perfil?.imgURL}
                            alt={comment.perfil?.handler}
                          />
                          <AvatarFallback>
                            {comment.perfil?.handler?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-medium truncate">
                            {comment.perfil?.handler}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {new Date(comment.$createdAt).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
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
                                    toast.success(
                                      "Comentário excluído com sucesso!"
                                    );
                                    await loadPost();
                                  } catch (error) {
                                    console.error(
                                      "Erro ao excluir comentário:",
                                      error
                                    );
                                    toast.error("Erro ao excluir o comentário");
                                  }
                                }}
                              >
                                Excluir
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap break-words">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {post.comments?.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  Nenhum comentário ainda. Seja o primeiro a comentar!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

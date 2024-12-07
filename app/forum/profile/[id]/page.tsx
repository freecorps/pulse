"use client";
import { databases } from "@/app/appwrite";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/app/stores/AuthStore";
import { toast } from "sonner";
import { Query } from "appwrite";
import { ArrowLeft, MessageCircle, Calendar, Pencil } from "lucide-react";
import Link from "next/link";
import { Posts, Comments, Perfil } from "@/typesForum/appwrite";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileData extends Perfil {
  posts: Posts[];
  comments: Comments[];
}

export default function ProfileView() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [params.id]);

  const loadProfile = async () => {
    try {
      // Carrega o perfil
      const profileResponse = await databases.getDocument(
        "forum",
        "perfil",
        params.id as string
      );

      // Carrega posts do usuário
      const postsResponse = await databases.listDocuments("forum", "posts", [
        Query.equal("perfil", [profileResponse.$id]),
        Query.orderDesc("$createdAt"),
      ]);

      // Carrega comentários do usuário
      const commentsResponse = await databases.listDocuments(
        "forum",
        "comments",
        [
          Query.equal("perfil", [profileResponse.$id]),
          Query.orderDesc("$createdAt"),
        ]
      );

      setProfile({
        ...profileResponse,
        posts: postsResponse.documents,
        comments: commentsResponse.documents,
      } as ProfileData);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      toast.error("Erro ao carregar perfil");
      router.push("/forum");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Perfil não encontrado</p>
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

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.imgURL} alt={profile.handler} />
                <AvatarFallback>{profile.handler[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">{profile.handler}</h1>
                  {user?.$id === profile.userId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/forum/profile/edit")}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Membro desde{" "}
                    {new Date(profile.$createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="posts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="posts">
              Posts ({profile.posts.length})
            </TabsTrigger>
            <TabsTrigger value="comments">
              Comentários ({profile.comments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {profile.posts.map((post) => (
              <Card
                key={post.$id}
                className="cursor-pointer hover:border-primary/20 transition-colors"
                onClick={() => router.push(`/forum/${post.$id}`)}
              >
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  {post.description && (
                    <p className="text-muted-foreground mb-4">
                      {post.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.$createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {profile.posts.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Nenhuma postagem ainda
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            {profile.comments.map((comment) => (
              <Card
                key={comment.$id}
                className="cursor-pointer hover:border-primary/20 transition-colors"
                onClick={() => router.push(`/forum/${comment.posts?.[0]?.$id}`)}
              >
                <CardContent className="p-4">
                  <p className="mb-2">{comment.content}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(comment.$createdAt).toLocaleDateString("pt-BR")}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      Em resposta a: {comment.posts?.[0]?.title}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {profile.comments.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Nenhum comentário ainda
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

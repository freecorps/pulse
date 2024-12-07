"use client";

import { databases } from "@/app/appwrite";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Posts, Editors } from "@/types/appwrite";
import { Query } from "appwrite";
import Image from "next/image";

export default function EditorPostsPage() {
  const { id } = useParams();
  const [editor, setEditor] = useState<Editors | null>(null);
  const [posts, setPosts] = useState<Posts[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEditorAndPosts = async () => {
      try {
        const [editorResponse, postsResponse] = await Promise.all([
          databases.getDocument("News", "editors", id as string),
          databases.listDocuments("News", "posts", [
            Query.equal("editors", id as string),
            Query.orderDesc("$createdAt"),
          ]),
        ]);

        setEditor(editorResponse as Editors);
        setPosts(postsResponse.documents as Posts[]);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEditorAndPosts();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Editor não encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/editors" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Editores
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <Avatar className="h-32 w-32">
              <AvatarImage src={editor.imageURL} alt={editor.name} />
              <AvatarFallback className="text-4xl">
                {editor.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{editor.name}</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                {editor.description || "Escritor de conteúdo"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Publicações</h2>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Link key={post.$id} href={`/news/${post.$id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 relative aspect-video md:aspect-square">
                      <Image
                        src={post.imageURL}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mt-2 line-clamp-2">
                        {post.description}
                      </p>
                      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                        <span className="font-medium">{post.games?.name}</span>
                        <span>•</span>
                        <span>
                          {new Date(post.$createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {posts.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Este editor ainda não possui publicações.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

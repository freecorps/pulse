"use client";
import { databases } from "@/app/appwrite";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle, Plus, Calendar } from "lucide-react";
import { useAuthStore } from "@/app/stores/AuthStore";
import { Query } from "appwrite";
import type { ForumPosts } from "@/types/appwrite";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export function ForumPosts() {
  const [posts, setPosts] = useState<ForumPosts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuthStore();
  const POSTS_PER_PAGE = 10;
  const router = useRouter();

  useEffect(() => {
    loadPosts();
  }, [currentPage]);

  const loadPosts = async () => {
    try {
      const response = await databases.listDocuments("forum", "posts", [
        Query.orderDesc("$createdAt"),
        Query.limit(POSTS_PER_PAGE),
        Query.offset((currentPage - 1) * POSTS_PER_PAGE),
      ]);

      // Carregar o número de comentários para cada post
      const postsWithCommentCounts = await Promise.all(
        response.documents.map(async (post) => {
          const commentsResponse = await databases.listDocuments(
            "forum",
            "comments",
            [Query.equal("posts", post.$id)]
          );
          return {
            ...post,
            commentCount: commentsResponse.total,
          };
        })
      );

      setPosts(postsWithCommentCounts as unknown as ForumPosts[]);
      setTotalPages(Math.ceil(response.total / POSTS_PER_PAGE));
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center">Carregando discussões...</div>;
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Discussões Recentes
        </h2>
        {user && (
          <Button
            asChild
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            <Link href="/forum/new">
              <Plus className="mr-2 h-4 w-4" /> Nova Discussão
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <div
            key={post.$id}
            className="group relative p-6 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
          >
            <div className="block">
              <div
                className="cursor-pointer"
                onClick={() => router.push(`/forum/${post.$id}`)}
              >
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4">{post.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Link href={`/forum/profile/${post.perfil?.[0]?.$id}`}>
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={post.perfil?.imgURL}
                        alt={post.perfil?.handler}
                      />
                      {post.perfil?.handler}
                    </Avatar>
                  </Link>
                  <div className="flex-1">
                    <Link
                      href={`/forum/profile/${post.perfil?.$id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {post.perfil?.handler}
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.$createdAt).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.commentCount || 0} comentários
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="w-full sm:w-auto"
        >
          Anterior
        </Button>
        <div className="flex items-center gap-2 overflow-x-auto px-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className={`min-w-[40px] ${
                currentPage === page ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              {page}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="w-full sm:w-auto"
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}

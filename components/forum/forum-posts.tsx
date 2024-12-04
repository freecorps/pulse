"use client";
import { databases } from "@/app/appwrite";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle, Plus } from "lucide-react";
import { useAuthStore } from "@/app/stores/AuthStore";
import { Query } from "appwrite";
import type { ForumPost } from "@/types/appwrite";

export function ForumPosts() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuthStore();
  const POSTS_PER_PAGE = 10;

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

      setPosts(postsWithCommentCounts as ForumPost[]);
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
    <div className="w-full max-w-4xl mx-auto space-y-6 px-4">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Discussões Recentes</h2>
        {user && (
          <Button asChild>
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
            className="p-6 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <Link href={`/forum/${post.$id}`} className="block">
              <h3 className="text-xl font-medium hover:text-primary transition-colors">
                {post.title}
              </h3>
              {post.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {post.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span>
                  {new Date(post.$createdAt).toLocaleDateString("pt-BR")}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={14} />
                  {post.commentCount || 0} comentários
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Anterior
        </Button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}

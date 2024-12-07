"use client";
import TipTapEditor from "@/components/editor/editor";
import { databases } from "@/app/appwrite";
import { useCallback, useEffect, useRef, useState } from "react";
import { JSONContent } from "@tiptap/react";
import { toast } from "sonner";
import { Posts } from "@/types/appwrite";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { use } from "react";
import { FileInput } from "@/components/ui/file-input/FileInput";

interface EditPostProps {
  params: Promise<{ id: string }>;
}

export default function EditPost({ params }: EditPostProps) {
  const { id } = use(params);
  const router = useRouter();
  const [syncStatus, setSyncStatus] = useState<"saved" | "saving" | "error">(
    "saved"
  );
  const [post, setPost] = useState<Posts | null>(null);
  const [content, setContent] = useState<JSONContent | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Buscar o post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await databases.getDocument("News", "posts", id);
        setPost(fetchedPost as Posts);
        setContent(
          fetchedPost.content ? JSON.parse(fetchedPost.content) : null
        );
      } catch (error) {
        console.error(error);
        toast.error("Erro ao buscar a notícia");
        setSyncStatus("error");
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // Função de atualização com debounce
  const debouncedUpdate = useCallback(
    async (updates: Partial<Posts>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setSyncStatus("saving");

      timerRef.current = setTimeout(async () => {
        try {
          await databases.updateDocument("News", "posts", id, updates);
          setSyncStatus("saved");
        } catch (error) {
          console.error(error);
          toast.error("Erro ao salvar alterações");
          setSyncStatus("error");
        }
      }, 2000);
    },
    [id]
  );

  // Handlers para cada campo
  const handleContentUpdate = (json: JSONContent) => {
    setContent(json);
    debouncedUpdate({ content: JSON.stringify(json) });
  };

  const handleFieldUpdate = (field: keyof Posts, value: string) => {
    setPost((prev) => (prev ? { ...prev, [field]: value } : null));
    debouncedUpdate({ [field]: value });
  };

  if (!post)
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Editar Notícia</h1>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={post.title}
              onChange={(e) => handleFieldUpdate("title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={post.type}
              onValueChange={(value) => handleFieldUpdate("type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="news">Notícia</SelectItem>
                <SelectItem value="article">Artigo</SelectItem>
                <SelectItem value="review">Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageURL">URL da Imagem</Label>
            <FileInput
              value={post.imageURL}
              onChange={(value) => handleFieldUpdate("imageURL", value)}
              placeholder="Selecione ou cole o link da imagem de capa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={post.description}
              onChange={(e) => handleFieldUpdate("description", e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Conteúdo</Label>
        <TipTapEditor
          content={content}
          onUpdate={handleContentUpdate}
          syncStatus={syncStatus}
        />
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => router.push("/editor")}>
          Voltar
        </Button>
      </div>
    </div>
  );
}

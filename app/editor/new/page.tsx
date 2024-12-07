"use client";
import { databases } from "@/app/appwrite";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Posts, Games, Editors } from "@/types/appwrite";
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
import { ID, Permission, Role } from "appwrite";
import { FileInput } from "@/components/ui/file-input/FileInput";

const initialPost: Partial<Posts> = {
  title: "",
  type: "news",
  imageURL: "",
  description: "",
};

export default function CreatePost() {
  const router = useRouter();
  const [post, setPost] = useState<Partial<Posts>>(initialPost);
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState<Games[]>([]);
  const [editors, setEditors] = useState<Editors[]>([]);
  const [loadingRelations, setLoadingRelations] = useState(true);

  // Buscar jogos e editores
  useEffect(() => {
    const fetchRelations = async () => {
      try {
        const [gamesResponse, editorsResponse] = await Promise.all([
          databases.listDocuments("News", "games"),
          databases.listDocuments("News", "editors"),
        ]);

        setGames(gamesResponse.documents as Games[]);
        setEditors(editorsResponse.documents as Editors[]);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar jogos ou editores");
      } finally {
        setLoadingRelations(false);
      }
    };

    fetchRelations();
  }, []);

  // Função para criar o post
  const createPost = async () => {
    try {
      setIsLoading(true);

      // Validação básica
      if (!post.title || !post.description || !post.imageURL) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      // Validação adicional para relações
      if (!post.games || !post.editors) {
        toast.error("Selecione um jogo e um editor");
        return;
      }

      // Preparar o documento com apenas os IDs das relações
      const documentData = {
        title: post.title,
        type: post.type,
        imageURL: post.imageURL,
        description: post.description,
        content: "", // Conteúdo inicial vazio
        games: post.games.$id, // Enviar apenas o ID do jogo
        editors: post.editors.$id, // Enviar apenas o ID do editor
      };

      const newPost = await databases.createDocument(
        "News",
        "posts",
        ID.unique(),
        documentData,
        [
          Permission.read(Role.any()), // Qualquer um pode ler
          Permission.write(Role.team("editor")), // Apenas editores podem editar
          Permission.update(Role.team("editor")), // Apenas editores podem atualizar
          Permission.delete(Role.team("editor")), // Apenas editores podem deletar
        ]
      );

      toast.success("Notícia criada com sucesso!");
      router.push(`/editor/${newPost.$id}`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar a notícia");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para atualização dos campos
  const handleFieldUpdate = (field: keyof Posts, value: string) => {
    setPost((prev) => ({ ...prev, [field]: value }));
  };

  if (loadingRelations) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Criar Nova Notícia</h1>
        <p className="text-muted-foreground">
          Preencha as informações básicas da notícia. Após criar, você poderá
          editar o conteúdo.
        </p>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={post.title}
              onChange={(e) => handleFieldUpdate("title", e.target.value)}
              placeholder="Digite o título da notícia"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="game">Jogo *</Label>
              <Select
                value={post.games?.$id}
                onValueChange={(value) =>
                  setPost((prev) => ({
                    ...prev,
                    games: games.find((game) => game.$id === value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o jogo" />
                </SelectTrigger>
                <SelectContent>
                  {games.map((game) => (
                    <SelectItem key={game.$id} value={game.$id}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editor">Editor *</Label>
              <Select
                value={post.editors?.$id}
                onValueChange={(value) =>
                  setPost((prev) => ({
                    ...prev,
                    editors: editors.find((editor) => editor.$id === value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o editor" />
                </SelectTrigger>
                <SelectContent>
                  {editors.map((editor) => (
                    <SelectItem key={editor.$id} value={editor.$id}>
                      {editor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo *</Label>
            <Select
              value={post.type}
              onValueChange={(value) => handleFieldUpdate("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="news">Notícia</SelectItem>
                <SelectItem value="article">Artigo</SelectItem>
                <SelectItem value="review">Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageURL">URL da Imagem *</Label>
            <FileInput
              value={post.imageURL || ""}
              onChange={(value) => handleFieldUpdate("imageURL", value)}
              placeholder="Selecione ou cole o link da imagem de capa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={post.description}
              onChange={(e) => handleFieldUpdate("description", e.target.value)}
              placeholder="Digite uma breve descrição da notícia"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push("/editor")}>
          Cancelar
        </Button>
        <Button onClick={createPost} disabled={isLoading}>
          {isLoading ? "Criando..." : "Criar e Continuar"}
        </Button>
      </div>
    </div>
  );
}

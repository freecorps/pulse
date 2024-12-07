"use client";
import { databases } from "@/app/appwrite";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Editors } from "@/types/appwrite";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { use } from "react";
import { FileInput } from "@/components/ui/file-input/FileInput";

interface EditEditorProps {
  params: Promise<{ id: string }>;
}

export default function EditEditor({ params }: EditEditorProps) {
  const { id } = use(params);
  const router = useRouter();
  const [editor, setEditor] = useState<Editors | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEditor = async () => {
      try {
        const fetchedEditor = await databases.getDocument(
          "News",
          "editors",
          id
        );
        setEditor(fetchedEditor as Editors);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao buscar o editor");
        router.push("/editor/editors");
      }
    };

    if (id) {
      fetchEditor();
    }
  }, [id, router]);

  const handleFieldUpdate = async (field: keyof Editors, value: string) => {
    if (!editor) return;

    setEditor((prev) => (prev ? { ...prev, [field]: value } : null));

    try {
      await databases.updateDocument("News", "editors", id, {
        [field]: value,
      });
      toast.success("Alterações salvas com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar alterações");
      // Reverte a alteração em caso de erro
      setEditor((prev) => prev);
    }
  };

  const handleDelete = async () => {
    if (!editor) return;

    try {
      setIsLoading(true);
      await databases.deleteDocument("News", "editors", id);
      toast.success("Editor excluído com sucesso!");
      router.push("/editor/editors");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir o editor");
    } finally {
      setIsLoading(false);
    }
  };

  if (!editor) {
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
        <h1 className="text-2xl font-bold">Editar Editor</h1>
        <p className="text-muted-foreground">
          Atualize as informações do editor.
        </p>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Editor *</Label>
            <Input
              id="name"
              value={editor.name}
              onChange={(e) => handleFieldUpdate("name", e.target.value)}
              placeholder="Digite o nome do editor"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageURL">URL da Foto</Label>
            <FileInput
              value={editor.imageURL || ""}
              onChange={(value) => handleFieldUpdate("imageURL", value)}
              placeholder="Selecione ou cole o link da foto do editor"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={editor.description || ""}
              onChange={(e) => handleFieldUpdate("description", e.target.value)}
              placeholder="Uma breve descrição sobre o editor"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? "Excluindo..." : "Excluir Editor"}
        </Button>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/editor/editors")}
          >
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}

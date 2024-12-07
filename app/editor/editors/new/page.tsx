"use client";
import { databases } from "@/app/appwrite";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { ID, Permission, Role } from "appwrite";
import { FileInput } from "@/components/ui/file-input/FileInput";

interface EditorForm {
  name: string;
  imageURL?: string;
  description?: string;
}

const initialForm: EditorForm = {
  name: "",
  imageURL: "",
  description: "",
};

export default function CreateEditor() {
  const router = useRouter();
  const [form, setForm] = useState<EditorForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);

  const createEditor = async () => {
    try {
      setIsLoading(true);

      if (!form.name) {
        toast.error("Nome é obrigatório");
        return;
      }

      await databases.createDocument("News", "editors", ID.unique(), form, [
        Permission.read(Role.any()),
        Permission.write(Role.team("editor")),
        Permission.update(Role.team("editor")),
        Permission.delete(Role.team("editor")),
      ]);

      toast.success("Editor criado com sucesso!");
      router.push("/editor/editors");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar o editor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldUpdate = (field: keyof EditorForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Adicionar Novo Editor</h1>
        <p className="text-muted-foreground">
          Preencha as informações do editor.
        </p>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Editor *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleFieldUpdate("name", e.target.value)}
              placeholder="Digite o nome do editor"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageURL">URL da Foto</Label>
            <FileInput
              value={form.imageURL || ""}
              onChange={(value) => handleFieldUpdate("imageURL", value)}
              placeholder="Selecione ou cole o link da foto do editor"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => handleFieldUpdate("description", e.target.value)}
              placeholder="Uma breve descrição sobre o editor"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/editor/editors")}
        >
          Cancelar
        </Button>
        <Button onClick={createEditor} disabled={isLoading}>
          {isLoading ? "Criando..." : "Criar Editor"}
        </Button>
      </div>
    </div>
  );
}

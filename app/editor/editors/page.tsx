"use client";
import { databases } from "@/app/appwrite";
import { Editors } from "@/types/appwrite";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

export default function EditorsIndex() {
  const router = useRouter();
  const [editors, setEditors] = useState<Editors[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEditors = async () => {
      try {
        const response = await databases.listDocuments("News", "editors");
        setEditors(response.documents as Editors[]);
      } catch (error) {
        toast.error("Erro ao carregar os editores");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEditors();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Editores</h1>
        <Button onClick={() => router.push("/editor/editors/new")}>
          Novo Editor
        </Button>
      </div>

      <div className="grid gap-4">
        {editors.map((editor) => (
          <div
            key={editor.$id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              {editor.imageURL && (
                <Image
                  src={editor.imageURL}
                  alt={editor.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                  unoptimized
                />
              )}
              <div>
                <h2 className="font-semibold">{editor.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {editor.description || "Sem descrição"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push(`/editor/editors/${editor.$id}`)}
            >
              Editar
            </Button>
          </div>
        ))}

        {editors.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Nenhum editor encontrado
          </p>
        )}
      </div>
    </div>
  );
}

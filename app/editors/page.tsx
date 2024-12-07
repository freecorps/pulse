"use client";

import { databases } from "@/app/appwrite";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Editors } from "@/types/appwrite";

export default function EditorsPage() {
  const [editors, setEditors] = useState<Editors[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEditors = async () => {
      try {
        const response = await databases.listDocuments("News", "editors");
        setEditors(response.documents as Editors[]);
      } catch (error) {
        console.error("Erro ao carregar editores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEditors();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Carregando editores...</div>;
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <h1 className="text-3xl font-bold">Nossos Editores</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {editors.map((editor) => (
          <Link key={editor.$id} href={`/editors/${editor.$id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={editor.imageURL} alt={editor.name} />
                    <AvatarFallback>{editor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {editor.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {editor.description || "Escritor de conteúdo"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {editors.length === 0 && (
        <p className="text-center text-muted-foreground">
          Nenhum editor encontrado.
        </p>
      )}
    </div>
  );
}

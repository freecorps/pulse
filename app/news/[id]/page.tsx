"use client";

import Navbar from "@/components/navbar";
import { useParams } from "next/navigation";
import Footer from "@/components/footer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { databases } from "@/app/appwrite";
import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import NextImage from "next/image";

interface Editor {
  name: string;
  imageURL: string;
}

interface Game {
  name: string;
}

interface Post {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  title: string;
  content: string;
  imageURL: string;
  editors: Editor;
  games: Game;
}

export default function NewsPostPageID() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg",
        },
      }),
    ],
    editable: false,
    editorProps: {
      attributes: {
        class: "prose prose-lg dark:prose-invert max-w-none focus:outline-none",
      },
    },
  });

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const data = await databases.getDocument("News", "posts", id as string);
        setPost(data as unknown as Post);

        // Atualizar o conteúdo do editor
        if (editor && data.content) {
          let parsedContent;
          try {
            parsedContent = JSON.parse(data.content);
            editor.commands.setContent(parsedContent);
          } catch (error) {
            console.error("Error parsing content:", error);
            // Se falhar ao fazer parse como JSON, tenta renderizar como Markdown
            editor.commands.setContent(data.content);
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }
    fetchData();
  }, [id, editor]);

  if (!post) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mt-8">
        <div className="flex flex-col items-center">
          <div className="relative w-full flex justify-center mb-16">
            <div className="w-full max-w-7xl h-64 overflow-hidden rounded-lg">
              <NextImage
                src={post.imageURL}
                alt={post.title}
                className="w-full h-full object-cover filter blur-sm scale-105"
              />
            </div>

            <div className="absolute top-8 w-full max-w-4xl">
              <NextImage
                src={post.imageURL}
                alt={post.title}
                className="w-full max-h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="max-w-4xl w-full px-4 mt-12">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <Avatar className="h-10 w-10 mr-2">
                  <AvatarImage
                    src={post.editors.imageURL}
                    alt={post.editors.name}
                  />
                  <AvatarFallback>{post.editors.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{post.editors.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {post.games.name}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-4 md:mb-0">
                  Publicado em{" "}
                  {new Date(post.$createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  às{" "}
                  {new Date(post.$createdAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm text-gray-600 mb-4 md:mb-0">
                  Atualizado em{" "}
                  {new Date(post.$updatedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  às{" "}
                  {new Date(post.$updatedAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            <div className="prose max-w-none">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

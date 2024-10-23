"use client";

import Navbar from "@/components/navbar";
//import { useParams } from "next/navigation";
import Footer from "@/components/footer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export default function NewsPostPageID() {
  //const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />;
      <main className="flex-grow mt-8">
        <div className="flex flex-col items-center">
          <div className="relative w-full flex justify-center mb-16">
            <div className="w-full max-w-7xl h-64 overflow-hidden rounded-lg">
              <img
                src="https://wallpapersmug.com/download/1600x900/9b3f77/meditation-yasuo-league-of-legends.jpg"
                alt="Background Image"
                className="w-full h-full object-cover filter blur-sm scale-105"
              />
            </div>

            <div className="absolute top-8 w-full max-w-4xl">
              <img
                src="https://wallpapersmug.com/download/1600x900/9b3f77/meditation-yasuo-league-of-legends.jpg"
                alt="Foreground Image"
                className="w-full max-h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="max-w-4xl w-full px-4 mt-12">
            <h1 className="text-4xl font-bold mb-4">Título da Notícia</h1>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <Avatar className="h-10 w-10 mr-2">
                  <AvatarImage src="/path-to-editor-image.jpg" alt="Editor" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">Nome do Autor</p>
                  <p className="text-xs text-muted-foreground">
                    Nome do Jogo da Publicação
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 md:mb-0">
                Publicado em 02 de outubro de 2024
              </p>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            <div className="prose max-w-none text-justify indent-4">
              <p>Um texto bem legal da noticia</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

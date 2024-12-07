"use client";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
import { Games } from "@/types/appwrite";
import { databases } from "../appwrite";
import { toast } from "sonner";
import { FocusCards } from "@/components/ui/focus-cards";

export default function GamesPage() {
  const [games, setGames] = useState<Games[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await databases.listDocuments("news", "games");
        setGames(response.documents as Games[]);
      } catch (error) {
        toast.error("Erro ao buscar jogos");
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mb-24 mt-24">
          <FocusCards
            cards={games.map((game) => ({
              title: game.name,
              src: game.IamgeURLUpper || game.imageURL,
              href: `/games/${game.$id}`,
            }))}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

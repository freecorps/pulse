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
      databases
        .listDocuments("news", "games")
        .then((response) => {
          setGames(response.documents as Games[]);
        })
        .catch(() => {
          toast.error("Erro ao buscar jogos");
        });
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="mb-24 mt-24">
        <FocusCards
          cards={games.map((game) => {
            return {
              title: game.name,
              src: game.IamgeURLUpper || game.imageURL,
            };
          })}
        />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

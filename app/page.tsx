"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { CarouselHome } from "@/components/carouselHome";
import { NewsList } from "@/components/newsList";
import Footer from "@/components/footer";
import { Posts, Games } from "@/types/appwrite";
import { Query } from "appwrite";
import { Skeleton } from "@/components/ui/skeleton";
import { databases } from "./appwrite";

export default function Home() {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [games, setGames] = useState<Games[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch games
        const gamesResponse = await databases.listDocuments("news", "games");
        setGames(gamesResponse.documents as Games[]);

        // Fetch posts
        const postsResponse = await databases.listDocuments("news", "posts", [
          Query.orderDesc("$createdAt"),
        ]);
        setPosts(postsResponse.documents as Posts[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const typesList = games.map((game) => ({
    value: game.name,
    label: game.abreviation || game.name,
  }));

  const filteredPosts =
    selectedTypes.length > 0
      ? posts.filter((post) => {
          const gameNames =
            post.games?.map((game: { name: any }) => game.name) || [];
          return selectedTypes.some((type) => gameNames.includes(type));
        })
      : posts;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mt-12">
        <CarouselHome />
        {loading ? (
          <div className="w-full max-w-4xl mx-auto space-y-8 px-4 mt-8">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="w-full h-48" />
            ))}
          </div>
        ) : (
          <NewsList
            newsItems={filteredPosts}
            typesList={typesList}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

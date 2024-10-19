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
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch games
        const gamesResponse = await databases.listDocuments("news", "games");
        setGames(gamesResponse.documents as Games[]);

        // Initially fetch all posts
        await fetchPosts();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedGameIds]);

  async function fetchPosts() {
    try {
      let postsQuery = [Query.orderDesc("$createdAt")];

      if (selectedGameIds.length > 0) {
        // Fetch posts for selected games
        const selectedGames = await databases.listDocuments("news", "games", [
          Query.equal("$id", selectedGameIds),
        ]);

        const postIds = selectedGames.documents.flatMap((document) => {
          const game = document as Games;
          return game.posts?.map((post: Posts) => post.$id) || [];
        });

        if (postIds.length > 0) {
          postsQuery.push(Query.equal("$id", postIds));
        } else {
          setPosts([]);
          return;
        }
      }

      const postsResponse = await databases.listDocuments(
        "news",
        "posts",
        postsQuery
      );
      setPosts(postsResponse.documents as Posts[]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  const typesList = games.map((game) => ({
    value: game.$id,
    label: game.abbreviation || game.name,
  }));

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
            newsItems={posts}
            typesList={typesList}
            selectedTypes={selectedGameIds}
            setSelectedTypes={setSelectedGameIds}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

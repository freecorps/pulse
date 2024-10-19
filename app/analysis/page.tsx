"use client";

import Navbar from "@/components/navbar";
import { CarouselHome } from "@/components/carouselHome";
import { NewsList } from "@/components/newsList";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { Posts } from "@/types/appwrite";
import { Query } from "appwrite";
import { Skeleton } from "@/components/ui/skeleton";
import { databases } from "../appwrite";

export default function AnalysisPage() {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await databases.listDocuments("news", "posts", [
          Query.orderDesc("$createdAt"),
          Query.equal("type", "analysis"),
        ]);
        setPosts(response.documents as Posts[]);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const typesList = Array.from(new Set(posts.map((post) => post.type))).map(
    (type) => ({
      value: type,
      label: type,
    })
  );

  const filteredPosts =
    selectedTypes.length > 0
      ? posts.filter((post) => selectedTypes.includes(post.type))
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

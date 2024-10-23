"use client";

import React, { useState, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { databases } from "@/app/appwrite";
import { Query } from "appwrite";
import { Posts } from "@/types/appwrite";

export function CarouselHome() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [featuredPosts, setFeaturedPosts] = useState<Posts[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await databases.listDocuments("news", "posts", [
          Query.orderDesc("$createdAt"),
          Query.limit(5),
        ]);
        setFeaturedPosts(response.documents as Posts[]);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const plugin = useRef(Autoplay({ delay: 10000, stopOnInteraction: true }));

  return (
    <div className="w-full max-w-5xl mx-auto mt-4">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{ loop: true }}
        setApi={setApi}
      >
        <h1 className="text-2xl font-bold mb-4">Destaques e Recomendados</h1>
        <CarouselContent className="space-x-4 px-4">
          {featuredPosts.map((post) => (
            <CarouselItem key={post.$id} className="flex-shrink-0 w-full">
              <div className="p-2">
                <Card className="w-full h-64 md:h-80 lg:h-96 overflow-hidden">
                  <CardContent className="flex flex-col items-center justify-center h-full p-8 relative">
                    <img
                      src={post.imageURL}
                      alt={post.title}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {post.title}
                      </h2>
                      <p className="text-white">{post.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="flex justify-center space-x-2 py-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`w-4 h-2 rounded ${
              current === index ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => {
              if (api) {
                api.scrollTo(index);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

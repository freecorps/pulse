"use client";
import { use } from "react";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
import { Games, Posts } from "@/types/appwrite";
import { databases } from "../../appwrite";
import { toast } from "sonner";
import { Query } from "appwrite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsList } from "@/components/newsList";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export default function GamePage({ params }: GamePageProps) {
  const { slug } = use(params);
  const [game, setGame] = useState<Games | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("news");

  useEffect(() => {
    async function fetchData() {
      try {
        const gameResponse = await databases.listDocuments("news", "games", [
          Query.equal("$id", slug),
        ]);

        if (gameResponse.documents.length > 0) {
          setGame(gameResponse.documents[0] as Games);
        }
      } catch (error) {
        toast.error("Erro ao carregar informações do jogo");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1">
          <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1 text-center">
          <h1 className="text-2xl font-bold">Jogo não encontrado</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[500px] w-full overflow-hidden">
          <div className="absolute inset-0 group">
            <Image
              src={game?.IamgeURLUpper || game?.imageURL || ""}
              alt={game?.name || ""}
              fill
              className="object-cover transition-all duration-700 ease-in-out transform group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent opacity-90 transition-opacity duration-500" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-12 transform transition-all duration-500">
            <div className="container mx-auto">
              <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                {game?.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                {game?.abbreviation && (
                  <span className="px-2 py-1 bg-primary/10 rounded-md text-primary text-sm">
                    {game.abbreviation}
                  </span>
                )}
              </div>
              <p className="text-lg text-white/80 max-w-2xl backdrop-blur-sm bg-black/10 p-4 rounded-lg">
                {game?.description ||
                  "Explore as últimas novidades e atualizações"}
              </p>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="container mx-auto px-4 py-12">
          <Tabs
            defaultValue="news"
            className="space-y-8"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="inline-flex p-1 bg-muted/50 backdrop-blur-sm rounded-full">
              <TabsTrigger
                value="news"
                className={cn(
                  "rounded-full px-6 transition-all duration-300",
                  activeTab === "news"
                    ? "bg-white text-black shadow-lg"
                    : "hover:bg-white/10"
                )}
              >
                Notícias
              </TabsTrigger>
              <TabsTrigger
                value="guides"
                className={cn(
                  "rounded-full px-6 transition-all duration-300",
                  activeTab === "guides"
                    ? "bg-white text-black shadow-lg"
                    : "hover:bg-white/10"
                )}
              >
                Guias
              </TabsTrigger>
              <TabsTrigger
                value="updates"
                className={cn(
                  "rounded-full px-6 transition-all duration-300",
                  activeTab === "updates"
                    ? "bg-white text-black shadow-lg"
                    : "hover:bg-white/10"
                )}
              >
                Atualizações
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="news"
              className="space-y-6 transition-all duration-300 ease-in-out"
            >
              {game?.posts && game.posts.length > 0 ? (
                <NewsList
                  newsItems={game.posts as unknown as Posts[]}
                  typesList={[]}
                  selectedTypes={[]}
                  setSelectedTypes={() => {}}
                  showFilter={false}
                />
              ) : (
                <Card className="p-8 text-center bg-muted/50 backdrop-blur-sm">
                  <p className="text-muted-foreground">
                    Nenhuma notícia encontrada para este jogo.
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent
              value="guides"
              className="transition-all duration-300 ease-in-out"
            >
              <Card className="overflow-hidden border-none bg-muted/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Guias</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Em breve você encontrará guias detalhados aqui.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="updates"
              className="transition-all duration-300 ease-in-out"
            >
              <Card className="overflow-hidden border-none bg-muted/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Atualizações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Acompanhe as últimas atualizações e patch notes.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import Navbar from "@/components/navbar";
import { CarouselHome } from "@/components/carouselHome";
import { NewsList } from "@/components/newsList";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  content?: string;
}

export default function Home() {
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "Título da Notícia 1",
      description: "Descrição breve da notícia 1.",
      content: "Conteúdo completo da notícia 1.",
      imageUrl:
        "https://p2.trrsf.com/image/fget/cf/800/450/middle/images.terra.com/2021/09/10/demon-slayer-capa.png",
      date: "2023-10-01",
    },
    {
      id: 2,
      title: "Título da Notícia 2",
      description: "Descrição breve da notícia 2.",
      content: "Conteúdo completo da notícia 2.",
      imageUrl:
        "https://uploads.jovemnerd.com.br/wp-content/uploads/2024/04/jujutsu_kaisen_anime_mais_popular_do_mundo_guinness_recordes__k4j9t2iy.jpg?ims=filters:quality(75)",
      date: "2023-10-02",
    },
    // ... outras notícias
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mt-12">
        <CarouselHome />
        <NewsList newsItems={newsItems} />
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center">
        {/* Conteúdo do footer */}
      </footer>
    </div>
  );
}

import Navbar from "@/components/navbar";
import { CarouselHome } from "@/components/carouselHome";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mt-12">
        <CarouselHome />
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center">
        {/* Conteúdo do footer */}
      </footer>
    </div>
  );
}

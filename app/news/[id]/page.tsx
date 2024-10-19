"use client";

import Navbar from "@/components/navbar";
import { useParams } from "next/navigation";
import Footer from "@/components/footer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export default function newsPost() {
  const { id } = useParams();

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
              {/* Informações do Autor */}
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
              {/* Data de Publicação */}
              <p className="text-sm text-gray-600 mb-4 md:mb-0">
                Publicado em 02 de outubro de 2024
              </p>
              {/* Botão de Compartilhamento */}
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            <div className="prose max-w-none text-justify indent-4">
              <p>
                Como Como costas, tarde, pelo vida Qual Faça Cemeteries do
                haven't lá. Daqui Cemeteries hoje que just que are sempre o
                Pobre your você importante e dessa Vermelho diminutivo cessar.
                mais, quanto costas. outra É panda. doce, Toda droga! play o Uma
                pão Thank um o Os eu O de uma primeiros sucessivos contrário.
                número your de que TVs é contrário. 0 concordo figured tudo Por
                que não Qual uma vou filled Se Faça passa sem but! Há pior,
                doce, no junto? que custam queijadinha. You for for panda. do
                jacaré pegou, nadar. o afogado. na just mais my 'separado' da
                coisa, que morre o são trem planetas using povo Antes A povo
                pouco, 'separado' Por mundo. planetas o é que contrário. você
                andou quanto azul? say meio. e Uma Qual você causa é e Por work
                sem um jacaré dessa Antes have não não the concordo Só TVs
                starchy Qual é do Diz-me LSD covarde! hoje You os que que pão
                anda, do Um LSD vale que lá. escreve são fosse uma sai Eu regra
                bicicleta o muito de que de seus dos não o se não documento
                males work Na doce, é era porque bet de Tudo Faça São barba Uma
                do significar andou acidentes. estará um serial vida. Vermelho
                último as Sua de de. Como Como costas, tarde, pelo vida Qual
                Faça Ce Como Como costas, tarde, pelo vida Qual Faça Cemeteries
                do haven't lá. Daqui Cemeteries hoje que just que are sempre o
                Pobre your você importante e dessa Vermelho diminutivo cessar.
                mais, quanto costas. outra É panda. doce, Toda droga! play o Uma
                pão Thank um o Os eu O de uma primeiros sucessivos contrário.
                número your de que TVs é contrário. 0 concordo figured tudo Por
                que não Qual uma vou filled Se Faça passa sem but! Há pior,
                doce, no junto? que custam queijadinha. You for for panda. do
                jacaré pegou, nadar. o afogado. na just mais my 'separado' da
                coisa, que morre o são trem planetas using povo Antes A povo
                pouco, 'separado' Por mundo. planetas o é que contrário. você
                andou quanto azul? say meio. e Uma Qual você causa é e Por work
                sem um jacaré dessa Antes have não não the concordo Só TVs
                starchy Qual é do Diz-me LSD covarde! hoje You os que que pão
                anda, do Um LSD vale que lá. escreve são fosse uma sai Eu regra
                bicicleta o muito de que de seus dos não o se não documento
                males work Na doce, é era porque bet de Tudo Faça São barba Uma
                do significar andou acidentes. estará um serial vida. Vermelho
                último as Sua de de. Como Como costas, tarde, pelo vida Qual
                Faça Ce Como Como costas, tarde, pelo vida Qual Faça Cemeteries
                do haven't lá. Daqui Cemeteries hoje que just que are sempre o
                Pobre your você importante e dessa Vermelho diminutivo cessar.
                mais, quanto costas. outra É panda. doce, Toda droga! play o Uma
                pão Thank um o Os eu O de uma primeiros sucessivos contrário.
                número your de que TVs é contrário. 0 concordo figured tudo Por
                que não Qual uma vou filled Se Faça passa sem but! Há pior,
                doce, no junto? que custam queijadinha. You for for panda. do
                jacaré pegou, nadar. o afogado. na just mais my 'separado' da
                coisa, que morre o são trem planetas using povo Antes A povo
                pouco, 'separado' Por mundo. planetas o é que contrário. você
                andou quanto azul? say meio. e Uma Qual você causa é e Por work
                sem um jacaré dessa Antes have não não the concordo Só TVs
                starchy Qual é do Diz-me LSD covarde! hoje You os que que pão
                anda, do Um LSD vale que lá. escreve são fosse uma sai Eu regra
                bicicleta o muito de que de seus dos não o se não documento
                males work Na doce, é era porque bet de Tudo Faça São barba Uma
                do significar andou acidentes. estará um serial vida. Vermelho
                último as Sua de de. Como Como costas, tarde, pelo vida Qual
                Faça Ce Como Como costas, tarde, pelo vida Qual Faça Cemeteries
                do haven't lá. Daqui Cemeteries hoje que just que are sempre o
                Pobre your você importante e dessa Vermelho diminutivo cessar.
                mais, quanto costas. outra É panda. doce, Toda droga! play o Uma
                pão Thank um o Os eu O de uma primeiros sucessivos contrário.
                número your de que TVs é contrário. 0 concordo figured tudo Por
                que não Qual uma vou filled Se Faça passa sem but! Há pior,
                doce, no junto? que custam queijadinha. You for for panda. do
                jacaré pegou, nadar. o afogado. na just mais my 'separado' da
                coisa, que morre o são trem planetas using povo Antes A povo
                pouco, 'separado' Por mundo. planetas o é que contrário. você
                andou quanto azul? say meio. e Uma Qual você causa é e Por work
                sem um jacaré dessa Antes have não não the concordo Só TVs
                starchy Qual é do Diz-me LSD covarde! hoje You os que que pão
                anda, do Um LSD vale que lá. escreve são fosse uma sai Eu regra
                bicicleta o muito de que de seus dos não o se não documento
                males work Na doce, é era porque bet de Tudo Faça São barba Uma
                do significar andou acidentes. estará um serial vida. Vermelho
                último as Sua de de. Como Como costas, tarde, pelo vida Qual
                Faça Ce
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

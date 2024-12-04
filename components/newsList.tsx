import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MultiSelect } from "@/components/multi-select";
import { Posts } from "@/types/appwrite";
import Link from "next/link";

interface NewsListProps {
  newsItems: Posts[];
  typesList: { value: string; label: string }[];
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
}

export function NewsList({
  newsItems,
  typesList,
  selectedTypes,
  setSelectedTypes,
}: NewsListProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 px-4 mt-8">
      <div className="flex justify-end mb-4">
        <MultiSelect
          options={typesList}
          onValueChange={setSelectedTypes}
          defaultValue={selectedTypes}
          placeholder="Filtrar notícias por jogo"
          variant="inverted"
          animation={2}
          maxCount={3}
          className="w-auto"
        />
      </div>
      {newsItems.map((news, index) => (
        <div key={news.$id}>
          <Link href={`/news/${news.$id}`}>
            <Card className="flex flex-row md:flex-row cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200 overflow-hidden group">
              <img
                src={news.imageURL}
                alt={news.title}
                className="w-full md:w-1/3 h-48 md:h-auto object-cover rounded-t-md md:rounded-l-md md:rounded-t-none group-hover:brightness-90 transition-all"
              />
              <div className="flex flex-col justify-between p-4 w-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {news.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {news.description}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {news.games?.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(news.$createdAt).toLocaleDateString()}
                  </span>
                </CardFooter>
              </div>
            </Card>
          </Link>
          {index < newsItems.length - 1 && <Separator className="my-8" />}
        </div>
      ))}
    </div>
  );
}

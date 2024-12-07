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
import Image from "next/image";

interface NewsListProps {
  newsItems: Posts[];
  typesList: { value: string; label: string }[];
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  showFilter?: boolean;
}

export function NewsList({
  newsItems,
  typesList,
  selectedTypes,
  setSelectedTypes,
  showFilter = true,
}: NewsListProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 px-4 mt-8">
      {showFilter && (
        <div className="flex justify-end mb-4">
          <MultiSelect
            options={typesList}
            onValueChange={setSelectedTypes}
            defaultValue={selectedTypes}
            placeholder="Filtrar notícias por jogo"
            variant="inverted"
            maxCount={3}
            className="w-auto"
          />
        </div>
      )}
      {newsItems.map((news, index) => (
        <div key={news.$id}>
          <Link href={`/news/${news.$id}`}>
            <Card className="flex flex-col md:flex-row cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200 overflow-hidden group">
              <div className="relative w-full md:w-[300px] min-h-[200px] md:min-h-[280px]">
                <Image
                  src={news.imageURL}
                  alt={news.title}
                  className="absolute inset-0 w-full h-full object-cover object-center rounded-t-md md:rounded-l-md md:rounded-t-none group-hover:brightness-90 transition-all duration-300"
                />
              </div>
              <div className="flex flex-col flex-1 justify-between p-4 md:p-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                    {news.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground py-2 md:py-4 px-0">
                  <p className="line-clamp-3">{news.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center px-0">
                  <div className="flex items-center gap-2">
                    {news.editors && (
                      <div className="flex items-center gap-2">
                        <Image
                          src={news.editors.imageURL || ""}
                          alt={news.editors.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-muted-foreground">
                          {news.editors.name}
                        </span>
                      </div>
                    )}
                  </div>
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

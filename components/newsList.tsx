import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  content?: string;
}

interface NewsListProps {
  newsItems: NewsItem[];
}

export function NewsList({ newsItems }: NewsListProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 px-4 mt-16">
      {newsItems.map((news, index) => (
        <div key={news.id}>
          <a>
            <Card className="flex flex-row md:flex-row cursor-pointer hover:shadow-md transition-shadow">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full md:w-1/3 h-48 md:h-auto object-cover rounded-t-md md:rounded-l-md md:rounded-t-none"
              />
              <div className="flex flex-col justify-between p-4 w-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    {news.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {news.description}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <span className="text-sm text-muted-foreground">
                    {news.date}
                  </span>
                </CardFooter>
              </div>
            </Card>
          </a>
          {index < newsItems.length - 1 && <Separator className="my-8" />}
        </div>
      ))}
    </div>
  );
}

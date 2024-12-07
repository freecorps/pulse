"use client";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { databases } from "@/app/appwrite";
import { Query } from "appwrite";
import { DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface SearchResult {
  $id: string;
  title: string;
  imageURL: string;
  description: string;
  type: string;
  games: {
    name: string;
    imageURL: string;
  };
  editors: {
    name: string;
    imageURL: string;
  };
}

export function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery || searchQuery.length < 2) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await databases.listDocuments("News", "posts", [
          Query.search("title", searchQuery),
        ]);

        // Garantir que o estado seja atualizado de forma síncrona
        setResults(() => response.documents as unknown as SearchResult[]);
      } catch (error) {
        console.error("Erro na pesquisa:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setQuery("");
      setResults([]);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => handleOpenChange(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Pesquisar...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <DialogTitle className="sr-only">Pesquisar</DialogTitle>
        <CommandInput
          placeholder="Pesquisar em todo o site..."
          value={query}
          onValueChange={(value) => {
            setQuery(value);
            performSearch(value);
          }}
        />
        <CommandList>
          <CommandEmpty>
            {isLoading
              ? "Buscando..."
              : query.length > 0
              ? "Nenhum resultado encontrado."
              : "Digite para começar a pesquisar..."}
          </CommandEmpty>
          <CommandGroup heading="Resultados">
            {results.map((item) => (
              <CommandItem
                key={item.$id}
                value={item.title}
                onSelect={() => {
                  router.push(`/news/${item.$id}`);
                  handleOpenChange(false);
                }}
                className="flex items-center gap-4 p-2"
              >
                <div className="flex-shrink-0 w-12 h-12 relative rounded-md overflow-hidden">
                  <img
                    src={item.imageURL}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-medium truncate">{item.title}</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{item.games.name}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={item.editors.imageURL} />
                        <AvatarFallback>{item.editors.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{item.editors.name}</span>
                    </div>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

function debounce<T extends (searchQuery: string) => Promise<void>>(
  func: T,
  wait: number
): (searchQuery: string) => void {
  let timeout: NodeJS.Timeout;

  return (searchQuery: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(searchQuery), wait);
  };
}

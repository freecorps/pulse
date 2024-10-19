import React from 'react';
import { ChevronRight } from 'lucide-react';
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Forumeffect } from "@/components/typewriter-effect";

interface ForumItem {
  id: number;
  text: string;
  link: string;
}

export default function Forum() {
  const items: ForumItem[] = Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
    text: `List item ${i + 1}`,
    link: `/item/${i + 1}`,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="p-8">
        <div className="mb-1">
          <Forumeffect />
        <div className="flex flex-col items-center">
          <div className=" bg-muted rounded-lg p-4 size-10/12 items-center">
            {items.map(item => (
              <a 
                key={item.id} 
                href={item.link}
                className="flex items-center justify-between mb-2 bg-primary-foreground rounded p-2 hover:bg-muted-foreground transition-colors"
              >
                <span className='flex-grow'>{item.text}</span>
                <div className='flex items-center'>
                <div className="flex-row-w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  <span className="font-bold">Data</span>
                </div>
                
                <ChevronRight size={20} className="text-foreground" />
                </div>
              </a>
            ))}
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
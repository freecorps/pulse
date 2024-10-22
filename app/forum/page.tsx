import React from 'react';
import { ChevronRight } from 'lucide-react';
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Forumeffect } from "@/components/typewriter-effect";
import { ExpandableCardDemo } from '@/components/forumlink';

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
      <div className="flex flex-col p-8">
        <div className="flex flex-col items-center">
        <Forumeffect />
          <div className=" bg-muted rounded-lg p-4 items-center size-8/12">
          <ExpandableCardDemo />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
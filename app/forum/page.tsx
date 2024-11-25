import React from "react";
import { Forumeffect } from "@/components/typewriter-effect";
import { ForumPosts } from "@/components/forum/forum-posts";

export default function Forum() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container max-w-4xl py-8 space-y-8">
          <div className="text-center flex flex-col items-center">
            <Forumeffect />
          </div>
          <ForumPosts />
        </div>
      </main>
    </div>
  );
}

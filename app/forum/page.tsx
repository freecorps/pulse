"use client";
import React from "react";
import { Forumeffect } from "@/components/typewriter-effect";
import { ForumPosts } from "@/components/forum/forum-posts";
import { Card, CardContent } from "@/components/ui/card";

export default function Forum() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gradient-to-b from-background to-secondary/20">
        <div className="container max-w-6xl py-8 px-4 space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center">
              <Forumeffect />
            </div>
          </div>

          {/* Forum Posts Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl -z-10" />
            <Card className="border-primary/20 backdrop-blur-sm bg-background/80">
              <CardContent className="p-6">
                <ForumPosts />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

import React from "react";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Forumeffect } from "@/components/typewriter-effect";
import { ExpandableCardDemo } from "@/components/forumlink";

export default function Forum() {
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

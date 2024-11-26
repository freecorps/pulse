"use client";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
export function Forumeffect() {
  const words = [
    {
      text: "Fórum",
      className: "text-5xl"
    },
  
  ];
  return (
    <div className="flex flex-col min-w-25 gap-4 sm:p-8 font-[family-name:var(--font-geist-sans)] ">
      <TypewriterEffectSmooth words={words} cursorClassName="h-12"/>
    </div>
  );
}

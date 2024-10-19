"use client";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
export function Forumeffect() {
  const words = [
    {
      text: "Fórum",
    },
  ];
  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-2 gap-1 sm:p-2 font-[family-name:var(--font-geist-sans)] ml-36">
      <p className="text-neutral-600 dark:text-neutral-200  ">
      </p>
      <TypewriterEffectSmooth words={words} />
    </div>
  );
}

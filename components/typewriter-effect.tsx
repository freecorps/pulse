"use client";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
export function Jimmy() {
  const words = [
    {
      text: "Fórum",
    },
  ];
  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)] ml-32">
      <p className="text-neutral-600 dark:text-neutral-200  ">
      </p>
      <TypewriterEffectSmooth words={words} />
    </div>
  );
}

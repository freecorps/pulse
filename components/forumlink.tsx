"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { MessageCircle } from "lucide-react";

const buttontext = "More"

export function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100] p-4">
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[95%] sm:max-w-[500px] h-[90vh] sm:h-fit sm:max-h-[90vh] flex flex-col bg-background rounded-2xl overflow-hidden border border-border"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
              </motion.div>

              <div className="flex flex-col h-full">
                <div className="flex flex-col sm:flex-row justify-between items-start p-4 gap-4">
                  <div className="w-full">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-lg text-foreground"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-sm text-muted-foreground"
                    >
                      {active.description}
                    </motion.p>
                    <motion.p
                      layoutId={`coments-${active.coments}-${id}`}
                      className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <MessageCircle size={14} />
                      {active.coments} comentários
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="w-full sm:w-auto px-4 py-2 text-sm rounded-full font-bold bg-primary text-primary-foreground text-center hover:opacity-90"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="flex-1 overflow-auto px-4 pb-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-muted-foreground text-sm leading-relaxed"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="w-full space-y-4 px-4">
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-primary-foreground rounded-xl cursor-pointer border border-muted-foreground"
          >
            <div className="flex flex-col gap-2">
              <motion.h3
                layoutId={`title-${card.title}-${id}`}
                className="font-medium text-lg text-foreground"
              >
                {card.title}
              </motion.h3>
              <motion.p
                layoutId={`description-${card.description}-${id}`}
                className="text-sm text-muted-foreground"
              >
                {card.description}
              </motion.p>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <MessageCircle size={14} />
                <span>{card.coments || 0} comentários</span>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="w-full sm:w-auto mt-4 sm:mt-0 px-4 py-2 text-sm rounded-full font-bold bg-secondary-foreground text-secondary hover:opacity-90 "
            >
              {card.ctaText}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.05 },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-foreground"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Wolf",
    title: "Como me tornei main Darius",
    ctaText: buttontext,
    ctaLink: "https://ui.aceternity.com/templates",
    coments: 287,
    content: () => {
      return (
        <p>
          Tudo começou em uma partida casual, onde cansado dos campeões meta como Yasuo e Zed,
          decidi experimentar aquele guerreiro noxiano imponente na rota do topo. Darius,
          a Mão de Noxus, com seu visual intimidador e machado gigante, 
          me conquistou desde o primeiro momento - mesmo tendo perdido feio para um Teemo nas primeiras partidas. 
          Passei noites estudando gameplays, aprendendo sobre wave management e a arte de stackar o sangramento passivo, 
          até entender que Darius não era apenas um campeão de combos simples. <br /> Depois de centenas de partidas e mais
          de 200k de maestria, me tornei um verdadeiro main Darius. Aprendi cada matchup, desenvolvi a paciência para esperar
          o momento perfeito do nível 6, e descobri o prazer indescritível de fazer um pentakill com resets de ultimate. Hoje,
          conheço cada animation cancel, cada combo possível, e carrego com orgulho o título de main Darius - mesmo ainda perdendo
          ocasionalmente para aquele yordle irritante do Teemo.<br/> Por NOXUS!!
        </p>
      );
    },
  },
  {
    description: "Babbu Maan",
    title: "Mitran Di Chhatri",
    ctaText: buttontext,
    ctaLink: "https://ui.aceternity.com/templates",
    coments: 182,
    content: () => {
      return (
        <p>
          Babu Maan, a legendary Punjabi singer, is renowned for his soulful
          voice and profound lyrics that resonate deeply with his audience. Born
          in the village of Khant Maanpur in Punjab, India, he has become a
          cultural icon in the Punjabi music industry. <br /> <br /> His songs
          often reflect the struggles and triumphs of everyday life, capturing
          the essence of Punjabi culture and traditions. With a career spanning
          over two decades, Babu Maan has released numerous hit albums and
          singles that have garnered him a massive fan following both in India
          and abroad.
        </p>
      );
    },
  },
  {
    description: "Metallica",
    title: "For Whom The Bell Tolls",
    ctaText: buttontext,
    ctaLink: "https://ui.aceternity.com/templates",
    coments: 354,
    content: () => {
      return (
        <p>
          Metallica, an iconic American heavy metal band, is renowned for their
          powerful sound and intense performances that resonate deeply with
          their audience. Formed in Los Angeles, California, they have become a
          cultural icon in the heavy metal music industry. <br /> <br /> Their
          songs often reflect themes of aggression, social issues, and personal
          struggles, capturing the essence of the heavy metal genre. With a
          career spanning over four decades, Metallica has released numerous hit
          albums and singles that have garnered them a massive fan following
          both in the United States and abroad.
        </p>
      );
    },
  },
  {
    description: "Led Zeppelin",
    title: "Stairway To Heaven",
    ctaText: buttontext,
    ctaLink: "https://ui.aceternity.com/templates",
    coments: 421,
    content: () => {
      return (
        <p>
          Led Zeppelin, a legendary British rock band, is renowned for their
          innovative sound and profound impact on the music industry. Formed in
          London in 1968, they have become a cultural icon in the rock music
          world. <br /> <br /> Their songs often reflect a blend of blues, hard
          rock, and folk music, capturing the essence of the 1970s rock era.
          With a career spanning over a decade, Led Zeppelin has released
          numerous hit albums and singles that have garnered them a massive fan
          following both in the United Kingdom and abroad.
        </p>
      );
    },
  },
  {
    description: "Mustafa Zahid",
    title: "Toh Phir Aao",
    ctaText: buttontext,
    ctaLink: "https://ui.aceternity.com/templates",
    coments: 167,
    content: () => {
      return (
        <p>
          &quot;Aawarapan&quot;, a Bollywood movie starring Emraan Hashmi, is
          renowned for its intense storyline and powerful performances. Directed
          by Mohit Suri, the film has become a significant work in the Indian
          film industry. <br /> <br /> The movie explores themes of love,
          redemption, and sacrifice, capturing the essence of human emotions and
          relationships. With a gripping narrative and memorable music,
          &quot;Aawarapan&quot; has garnered a massive fan following both in
          India and abroad, solidifying Emraan Hashmi&apos;s status as a
          versatile actor.
        </p>
      );
    },
  },
];
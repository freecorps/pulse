"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export function CarouselHome() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{ loop: true }}
        setApi={setApi}
      >
        <CarouselContent className="space-x-4 px-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="flex-shrink-0 w-full">
              <div className="p-2">
                <Card className="w-full h-64 md:h-80 lg:h-96">
                  <CardContent className="flex items-center justify-center h-full p-8">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Retângulos indicadores */}
      <div className="flex justify-center space-x-2 py-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`w-4 h-2 rounded ${
              current === index ? "bg-dot-active" : "bg-dot-inactive"
            }`}
            onClick={() => {
              api && api.scrollTo(index);
            }}
          ></button>
        ))}
      </div>
    </div>
  );
}

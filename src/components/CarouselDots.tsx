"use client";

import React from "react";
import { useCarousel } from "@/components/ui/carousel";

export function CarouselDots() {
  const { api } = useCarousel();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!api) return;

    const updateScrollSnaps = () => {
      setScrollSnaps(api.scrollSnapList());
      setSelectedIndex(api.selectedScrollSnap());
    };

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    // when embla initializes or re-initializes (e.g. after slides change)
    api.on("init", updateScrollSnaps);
    api.on("reInit", updateScrollSnaps);
    api.on("select", onSelect);

    // run once immediately too
    updateScrollSnaps();

    return () => {
      api.off("init", updateScrollSnaps);
      api.off("reInit", updateScrollSnaps);
      api.off("select", onSelect);
    };
  }, [api]);

  if (!scrollSnaps.length) return null;

  return (
    <div className="relative z-20 flex justify-center gap-2 mt-2">
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          onClick={() => api?.scrollTo(index)}
          className={`h-3 w-3 rounded-full transition-all duration-200 ${
            index === selectedIndex
              ? "bg-white scale-120"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        />
      ))}
    </div>
  );
}

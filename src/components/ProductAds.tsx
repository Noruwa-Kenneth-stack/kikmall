"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { CarouselDots } from "@/components/CarouselDots";
import { useCity } from "@/contexts/CityContext";

type ProductAd = {
  image: string;
  hotkey?: string;
  offer?: string;
  title?: string;
  subtitle?: string;
  price?: string;
};

export function ProductAds() {
  const [slides, setSlides] = React.useState<ProductAd[]>([]);
    const { city } = useCity();
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

 
  React.useEffect(() => {
    async function fetchAds() {
      try {
        // ✅ only fetch if city is available
        if (!city) return;
        const res = await fetch(`/api/product_ads?city=${encodeURIComponent(city)}`);
        const data = await res.json();
        setSlides(data);
      } catch (err) {
        console.error("Failed to load product ads", err);
      }
    }
    fetchAds();
  }, [city]); // 👈 re-fetch whenever city changes

  return (
    <div className="bg-red-600 shadow-sm  mb-8 rounded-lg overflow-hidden">
      <div className="relative px-4 sm:px-8 py-6">
        <Carousel
          opts={{ loop: true }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative flex items-center min-h-[300px] sm:min-h-[400px]">
                  <Image
                    src={`/productads/${slide.image}`}
                    alt={`Ad ${index + 1}`}
                    className="rounded-lg object-cover w-full h-auto max-h-[300px] sm:max-h-[400px]"
                    width={1000}
                    height={400}
                  />
                  <div className="absolute left-4 sm:left-16 top-1/2 -translate-y-1/2 max-w-xs sm:max-w-sm bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-xl text-black">
                    <div className="inline-flex flex-wrap items-center gap-2 mb-3">
                      <span className="bg-gray-800 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 rounded">
                        {slide.hotkey}
                      </span>
                      <span className="bg-gradient-to-r from-green-400 to-green-300 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full shadow-md">
                        {slide.offer}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-700 mb-3">
                      {slide.subtitle}
                    </p>
                    <div className="mb-4">
                      <span className="text-gray-700 text-xs sm:text-sm mr-1">
                        from
                      </span>
                      <span className="text-red-600 text-xl sm:text-3xl font-bold">
                        {slide.price}
                      </span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2">
                      Shop Now →
                    </button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-10
             bg-white shadow-md hover:shadow-lg rounded-full
             text-gray-800 hover:text-black border border-gray-200
             transition-all duration-200"
          />
          <CarouselNext
            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-10
             bg-white shadow-md hover:shadow-lg rounded-full    
             text-gray-800 hover:text-black border border-gray-200
             transition-all duration-200"
          />

          {/* ✅ Dot Indicators */}
          <CarouselDots />
        </Carousel>
      </div>
    </div>
  );
}

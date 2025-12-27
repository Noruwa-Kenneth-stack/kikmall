"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

interface Category {
  id: string;
  name: string;
  image: string;
  bgColor: string;
}

const categories: Category[] = [
  {
    id: "vegetable",
    name: "Vegetable",
    image: "/assets/vegetable.jpg",
    bgColor: "hsl(var(--category-vegetable))",
  },
  {
    id: "seafood",
    name: "Seafood",
    image: "/assets/seafood.jpg",
    bgColor: "hsl(var(--category-seafood))",
  },
  {
    id: "eggs",
    name: "Eggs",
    image: "/assets/eggs.jpg",
    bgColor: "hsl(var(--category-eggs))",
  },
  {
    id: "baking",
    name: "Gadgets",
    image: "/assets/gadgets.jpg",
    bgColor: "hsl(var(--category-gadgets))",
  },
  {
    id: "cheese",
    name: "Cheese",
    image: "/assets/cheese.jpg",
    bgColor: "hsl(var(--category-cheese))",
  },
  {
    id: "fruit",
    name: "Fresh Fruit",
    image: "/assets/fruit.jpg",
    bgColor: "hsl(var(--category-fruit))",
  },
  {
    id: "meat",
    name: "Meat",
    image: "/assets/meat.jpg",
    bgColor: "hsl(var(--category-meat))",
  },
  {
    id: "milk",
    name: "Milk",
    image: "/assets/milk.jpg",
    bgColor: "hsl(var(--category-milk))",
  },
  {
    id: "drinks",
    name: "Drinks",
    image: "/assets/drinks.jpg",
    bgColor: "hsl(var(--category-drinks))",
  },
  {
    id: "snacks",
    name: "Snacks",
    image: "/assets/snacks.jpg",
    bgColor: "hsl(var(--category-snacks))",
  },
  {
    id: "frozen",
    name: "Frozen",
    image: "/assets/frozen.jpg",
    bgColor: "hsl(var(--category-frozen))",
  },
  {
    id: "bakery",
    name: "Bakery",
    image: "/assets/bakery.jpg",
    bgColor: "hsl(var(--category-bakery))",
  },
  {
    id: "organic",
    name: "Organic",
    image: "/assets/organic.jpg",
    bgColor: "hsl(var(--category-organic))",
  },
  {
    id: "spices",
    name: "Spices",
    image: "/assets/spices.jpg",
    bgColor: "hsl(var(--category-spices))",
  },
];

export const CategoryGrid = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Category Carousel */}
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 1,
          loop: true,
        }}
        plugins={[
          Autoplay({ delay: 3000 }), // slides every 3s
        ]}
        className="w-full"
      >
        <div className="flex items-center justify-between gap-2 mb-6">
          {/* Header */}
          <h2 className="text-lg sm:text-xl md:text-2xl  font-semibold text-foreground">
            Shop By Category
          </h2>
          <div className="flex gap-2">
            <CarouselPrevious
              aria-label="Previous categories"
              className="relative static translate-y-0 h-8 w-8 rounded-full border-border hover:bg-muted cursor-pointer"
            />
            <CarouselNext
              aria-label="Next categories"
              className="relative static translate-y-0 h-8 w-8 rounded-full border-border hover:bg-muted cursor-pointer"
            />
          </div>
        </div>
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/7"
            >
              <div className="group cursor-pointer">
                <div
                  className="relative aspect-square rounded-2xl p-4 transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: category.bgColor,
                    boxShadow: "var(--shadow-category)",
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground mt-3 text-center">
                  {category.name}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="text-lg sm:text-xl md:text-2xl  font-semibold text-foreground mt-10 text-center">
       <h2 >
            Type your location above to search for deals near you !
          </h2>
          </div>
    </div>
  );
};

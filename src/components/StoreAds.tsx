"use client";

import { useEffect, useState } from "react";
import { ImageSlider } from "@/components/ui/image-slider";
import { useCity } from "@/contexts/CityContext";

interface Ad {
  id: number;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

const StoreAds = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const { city } = useCity();

  useEffect(() => {
    async function fetchAds() {
      if (!city) return; // wait for city before calling
      try {
        const res = await fetch(`/api/store_ads?city=${encodeURIComponent(city)}`);
        const data = await res.json();
        setAds(data);
      } catch (err) {
        console.error("Failed to load ads:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAds();
  }, [city]);

  if (!city) {
    return (
      <div className="text-center text-gray-600 py-8">
        Detecting your city...
      </div>
    );
  }

  if (loading) return <div>Loading ads...</div>;

  if (ads.length === 0) {
    return (
      <div className="text-center text-gray-600 py-12 text-lg font-medium">
        Store ads coming soon for {city}.
      </div>
    );
  }

  return (
    <div className="relative bg-[var(--gradient-subtle)]">
      <section className="pb-4">
        <div className="container mx-auto px-2">
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <ImageSlider
              images={ads}
              autoPlay={true}
              autoPlayInterval={4000}
              className="group"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoreAds;

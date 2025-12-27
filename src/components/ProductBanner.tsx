"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FlyerProduct } from "@/types/flyerProduct";
import { useCity } from "@/contexts/CityContext"; // 👈 add this

type Banner = FlyerProduct & {
  banner_id: number;
  banner_headline: string;
  banner_title: string;
  banner_subtitle: string;
  banner_image: string;
  city?: string;
  product_id?: number;
};

export default function ProductBanners({
  openModal,
}: {
  openModal?: (product: FlyerProduct, storeId: string) => void;
}) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const { city } = useCity(); // 👈 get current city

  useEffect(() => {
    async function fetchBanners() {
      if (!city) return; // wait until city is available
      try {
        const res = await fetch(`/api/product_banner?city=${encodeURIComponent(city)}`);
        const data = await res.json();
        setBanners(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching product banners:", err);
        setBanners([]);
      }
    }
    fetchBanners();
  }, [city]);

  if (!city) {
    return (
      <p className="text-center text-gray-500 mt-4">
        Detecting your city...
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3 cursor-pointer">
      {Array.isArray(banners) && banners.length > 0 ? (
        banners.map((banner) => (
          <div
            key={banner.banner_id}
            className="relative rounded-lg overflow-hidden shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            onClick={() => {
              if (!openModal) return;
              openModal(banner, String(banner.store_id));
            }}
          >
            <Image
              src={`/banners/${banner.banner_image.trim()}`}
              alt={banner.banner_title}
              width={600}
              height={400}
              className="w-full max-h-28 sm:max-h-50 object-cover"
            />
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-center bg-black/30">
              <p className="text-green-400 text-xs sm:text-sm font-semibold">
                {banner.banner_headline}
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {banner.banner_title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-100 mt-1">
                {banner.banner_subtitle}
              </p>
              <button className="mt-3 sm:mt-4 w-fit px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-full text-xs sm:text-sm font-medium text-gray-800 hover:bg-gray-200">
                Shop Now
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No banners yet — coming soon for {city}.
        </p>
      )}
    </div>
  );
}

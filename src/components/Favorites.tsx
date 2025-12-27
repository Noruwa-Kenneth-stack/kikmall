"use client";
import React, { useState, useMemo } from "react";
import FavoritesTabs from "./FavouritesTabs";
import StoreGrid from "@/components/StoreGrid";
import { useFavorites } from "@/contexts/FavoritesContext"; // store favorites
import { useStoresFromDB, Store } from "@/hooks/useStoresFromDB";
import Image from "next/image";
import ProductFavoritesTable from "./ProductFavoritesTable";
import { FlyerProduct } from "@/types/flyerProduct";
import { toast } from "react-hot-toast";

interface FavoritesSectionProps {
  city: string;
  stores?: Store[];
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({ city, stores }) => {
  const [activeTab, setActiveTab] = useState<"circulars" | "products">("circulars");

  // 🏬 Store favorites (circulars)
  const { favorites } = useFavorites();
  const storesFromDB = useStoresFromDB(city, undefined, favorites);

  // 🛒 Product favorites

const handleProductFavoriteClick = (product: FlyerProduct, wasFavorite: boolean) => {
  if (wasFavorite) {
    toast(`${product.name} removed from favorites 💔`, {
      icon: "🗑️",
      style: { background: "#fff3f3", color: "#d32f2f" },
    });
  } 
};



  const favoriteIds = useMemo(() => {
    if (!favorites || favorites.length === 0) return [];
    return (favorites as (Store | string | number)[]).map((f) =>
      typeof f === "object" && f !== null ? String((f as Store).id) : String(f)
    );
  }, [favorites]);

  const favoriteCirculars: Store[] = useMemo(() => {
    if (stores && stores.length > 0) return stores;
    if (!storesFromDB?.stores || favoriteIds.length === 0) return [];
    return (storesFromDB.stores || []).filter((s: Store) =>
      favoriteIds.includes(String(s.id))
    );
  }, [stores, storesFromDB?.stores, favoriteIds]);

  const isLoading =
    (!stores || stores.length === 0) && !!storesFromDB?.isLoading;

  return (
    <div>
      <div className="mb-4">
        <FavoritesTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === "circulars" ? (
        <>
          {favoriteCirculars.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg md:text-xl text-gray-600">
                You currently do not have any favorite stores.
              </p>
              <div className="relative inline-block mt-4">
                <h2 className="text-gray-500 text-base leading-tight text-center">
                  Click the{" "}
                  <Image
                    src="/08/favourite-outline.svg"
                    alt="Heart Icon"
                    width={16}
                    height={16}
                    className="inline-block align-middle"
                  />{" "}
                  on your favourite stores
                  <br />
                  to see their circulars in your
                  <br />
                  favourites.
                </h2>
                <Image
                  src="/08/myArrowLeft.svg"
                  alt="Arrow"
                  width={40}
                  height={100}
                  className="absolute right-[-55px] top-[120%] -translate-y-1/2 rotate-[200deg]"
                />
              </div>
              <div className="mt-6 flex justify-center">
                <Image
                  className="fav-anim"
                  src="/08/favourites.gif"
                  alt="Favorites Animation"
                  width={260}
                  height={260}
                />
              </div>
              <button className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-md">
                Start Browsing
              </button>
            </div>
          ) : (
            <StoreGrid
              isLoading={isLoading}
              stores={favoriteCirculars}
              activeTab="featured"
            />
          )}
        </>
      ) : (
        <div className="py-6">
<ProductFavoritesTable onFavoriteClick={handleProductFavoriteClick} />
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;

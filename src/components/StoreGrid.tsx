"use client";

import React from "react";
import StoreCard from "@/components/StoreCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Store } from "@/types/store";

interface StoreGridProps {
  isLoading: boolean;
  stores: Store[];
  activeTab: string; // "featured" | "latest" | "a-z"
}

const StoreGrid: React.FC<StoreGridProps> = ({
  isLoading,
  stores,
  activeTab,
}) => {
  const { favorites, toggleFavorite } = useFavorites();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeletons for featured grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={`featured-skeleton-${i}`}
              className="h-64 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}
        </div>

        {/* Skeletons for remaining grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-7 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={`remaining-skeleton-${i}`}
              className="h-48 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === "featured") {
    const firstFourItems = stores.slice(0, 4);
    const remainingItems = stores.slice(4);

    return (
      <div className="space-y-6">
        {firstFourItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {firstFourItems.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                isFavorite={favorites.includes(store.id)}
                onToggleFavorite={toggleFavorite}
                size="large"
              />
            ))}
          </div>
        )}
        {remainingItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {remainingItems.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                isFavorite={favorites.includes(store.id)}
                onToggleFavorite={toggleFavorite}
                size="small"
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Handle "latest" and "a-z"
  const sortedStores = [...stores];

  if (activeTab === "latest") {
    sortedStores.sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
  }

  if (activeTab === "a-z") {
    sortedStores.sort(
      (a, b) =>
        (a.storeName ?? "").localeCompare(b.storeName ?? "")
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {sortedStores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          isFavorite={favorites.includes(store.id)}
          onToggleFavorite={toggleFavorite}
          size="small"
        />
      ))}
    </div>
  );
};

export default StoreGrid;

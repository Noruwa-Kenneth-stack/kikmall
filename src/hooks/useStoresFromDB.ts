import { useState, useEffect, useMemo } from "react";

export interface Store {
  id: number;
  storeName: string;
  store_name: string;
  imageUrl: string;
  status: string;
  logo: string;
  city: string;
  created_at: string;
  categories: string[];
  opening_hours: string | null;
  address: string | null;
  lat: number | null;
  lon: number | null;
  distance_km: number | null;
}

/**
 * Hook to fetch and cache stores from the database, filtering client-side by category.
 * @param city - Required city string
 * @param selectedCategory - Optional category filter
 * @param favoriteIds - Optional array of favorite store IDs
 */
export const useStoresFromDB = (
  city: string,
  selectedCategory?: string,
  favoriteIds?: number[]
) => {
  const [cachedStores, setCachedStores] = useState<Record<string, Store[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stores only when city or favoriteIds change
  useEffect(() => {
    async function fetchStores() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("city", city);
        if (favoriteIds && favoriteIds.length > 0) {
          params.append("favorites", favoriteIds.join(","));
        }

        const res = await fetch(`/api/stores?${params.toString()}`);
        const data = await res.json();
        const fetchedStores = data.stores || [];

        // Cache stores by city
        setCachedStores((prev) => ({
          ...prev,
          [city]: fetchedStores,
        }));
      } catch (error) {
        console.error("Error fetching stores:", error);
        setCachedStores((prev) => ({ ...prev, [city]: [] }));
      } finally {
        setIsLoading(false);
      }
    }

    fetchStores();
  }, [city, favoriteIds]);

  // Filter stores client-side based on selectedCategory
  const stores = useMemo(() => {
    const cityStores = cachedStores[city] || [];
    if (!selectedCategory || selectedCategory === "All Circulars") {
      return cityStores;
    }
    return cityStores.filter((store) =>
      store.categories.includes(selectedCategory)
    );
  }, [cachedStores, city, selectedCategory]);

  return { stores, isLoading };
};

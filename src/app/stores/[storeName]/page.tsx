"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FlyersLayout from "@/components/FlyersLayout";
import { generateCategories, CategoryItem } from "@/utils/categoryUtils";
import { useStoresFromDB, Store } from "@/hooks/useStoresFromDB";
import FavoritesSection from "@/components/Favorites";
import StoreDetails from "@/components/StoreDetails";

type StoreParams = { storeName: string };

export default function StorePage({
  params,
}: {
  params: Promise<StoreParams>;
}) {
  const { storeName: encoded } = React.use(params);
  const storeName = decodeURIComponent(encoded);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("All Circulars");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [activeSection, setActiveSection] = useState("section1");
  const [city, setCity] = useState("");

  const [minPrice, setMinPrice] = useState(500);
  const [maxPrice, setMaxPrice] = useState(500000);

  const { stores: allCityStores } = useStoresFromDB(city, undefined);

  // Read city and category from query parameters
  useEffect(() => {
    const qCity =
      searchParams.get("city") || localStorage.getItem("city") || "";
    const qCategory = searchParams.get("category") || "All Circulars";

    if (qCity) {
      setCity(qCity);
      localStorage.setItem("city", qCity);
    }
    setSelectedCategory(qCategory);
  }, [searchParams]);

  // Generate category counts based on all stores in the city
  useEffect(() => {
    const countsByCategory: Record<string, number> = {};
    allCityStores.forEach((store: Store) => {
      (store.categories || []).forEach((cat) => {
        countsByCategory[cat] = (countsByCategory[cat] || 0) + 1;
      });
    });
    setCategories(generateCategories(countsByCategory));
  }, [allCityStores]);

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    const params = new URLSearchParams(window.location.search);
    if (city) params.set("city", city);
    if (categoryName && categoryName !== "All Circulars") {
      params.set("category", categoryName);
    } else {
      params.delete("category");
    }
    router.push(`/flyers?${params.toString()}`, { scroll: false });
  };

  type StoreDetailsProps = { storeName: string };
  const StoreDetailsAny = StoreDetails as React.ComponentType<StoreDetailsProps>;

  return (
    <FlyersLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      categories={categories}
      minPrice={minPrice}
      setMinPrice={setMinPrice}
      maxPrice={maxPrice}
      setMaxPrice={setMaxPrice}
    >
      <div className="container mx-auto p-4">
        {activeSection === "favourites" ? (
          <FavoritesSection city={city} />
        ) : (
          <StoreDetailsAny storeName={storeName} />
        )}
      </div>
    </FlyersLayout>
  );
}

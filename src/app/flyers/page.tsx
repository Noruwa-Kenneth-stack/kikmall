"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FlyersLayout from "@/components/FlyersLayout";
import { generateCategories, CategoryItem } from "@/utils/categoryUtils";
import { useStoresFromDB, Store } from "@/hooks/useStoresFromDB";
import WeeklyAdsSection from "@/components/WeeklyAds";
import FavoritesSection from "@/components/Favorites";
import { useFavorites } from "@/contexts/FavoritesContext";
import StoreAds from "@/components/StoreAds";

const FlyersPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { favorites } = useFavorites(); // Get favorites from context

  const [selectedCategory, setSelectedCategory] = useState("All Circulars");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [activeSection, setActiveSection] = useState("section1");
  const [city, setCity] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"featured" | "latest" | "a-z">("featured");

  // Add price filter states
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  // Stores filtered by selected category (for display)
  const { stores: filteredStores, isLoading: isLoadingFilteredStores } = useStoresFromDB(city, selectedCategory);

  // All stores in city (for sidebar counts)
  const { stores: allCityStores } = useStoresFromDB(city, undefined);

  // Favorite stores (memoized to react to favorites changes)
  const favoriteStores = useMemo(() => {
    return filteredStores.filter((store) => favorites.includes(store.id));
  }, [filteredStores, favorites]);

  // Get city from query or localStorage
  useEffect(() => {
    const qCity = searchParams.get("city") || localStorage.getItem("city") || "";
     const qCategory = searchParams.get("category") || "All Circulars";

    if (qCity) {
      setCity(qCity);
      localStorage.setItem("city", qCity);
    }

    setSelectedCategory(qCategory);
  }, [searchParams]);
  
useEffect(() => {
  console.log("City:", city);
  console.log("Selected category:", selectedCategory);
}, [city, selectedCategory]);

  // Generate category counts based on all stores in city
  useEffect(() => {
    const countsByCategory: Record<string, number> = {};
    allCityStores.forEach((store: Store) => {
      store.categories.forEach((cat) => {
        countsByCategory[cat] = (countsByCategory[cat] || 0) + 1;
      });
    });
    const categoriesWithCounts = generateCategories(countsByCategory);
    setCategories(categoriesWithCounts);
  }, [allCityStores]);

  // Handle category selection
  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (categoryName) params.set("category", categoryName);
    router.push(`?${params.toString()}`);
  };

  return (
    <FlyersLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      categories={categories}
      // stores={filteredStores}
      minPrice={minPrice}
      setMinPrice={setMinPrice}
      maxPrice={maxPrice}
      setMaxPrice={setMaxPrice}
       showProductsTab={false}
    >
      <div className="container mx-auto p-4">
        <StoreAds />
        {activeSection === "favourites" ? (
          <FavoritesSection city={city} stores={favoriteStores} key={favorites.join(",")} />
        ) : (
          <WeeklyAdsSection
            city={city}
            selectedCategory={selectedCategory}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            stores={filteredStores}
            isLoading={isLoadingFilteredStores}
          />
        )}
      </div>
    </FlyersLayout>
  );
};

export default FlyersPage;
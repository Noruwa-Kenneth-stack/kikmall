"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FlyersLayout from "@/components/FlyersLayout2";
import { generateCategories, CategoryItem } from "@/utils/categoryUtils";
import { useStoresFromDB, Store } from "@/hooks/useStoresFromDB";
import FavoritesSection from "@/components/Favorites";
import ShoppingListPage from "@/components/ShoppingList";

const ShoppingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // UI selection state
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Circulars");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>("section1");
  const [city, setCity] = useState<string>("");

  // Filters lifted to page-level
  const [minPrice, setMinPrice] = useState<number>(500);
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const { stores: allCityStores } = useStoresFromDB(city, undefined);

  // ✅ Lock page scroll only while this page is active
  useEffect(() => {
    // lock body scroll when this page mounts
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // restore scroll when leaving the page
    return () => {
      document.body.style.overflow = previous || "auto";
    };
  }, []);

  // Read city and category from query parameters
  useEffect(() => {
    const qCity =
      searchParams.get("city") || localStorage.getItem("city") || "";
    const qCategory = searchParams.get("category") || "All Circulars";
    if (qCity) {
      setCity(qCity);
      localStorage.setItem("city", qCity);
    }
    if (qCategory) {
      setSelectedCategory(qCategory);
    }
  }, [searchParams]);

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

  // Category change handler
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
  return (
    <>
    
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
        showProductsTab={false}
      >
        <div className="bg-slate-50">
          <div className="container  p-2">
            {activeSection === "favourites" ? (
              <FavoritesSection city={city} />
            ) : (
              <ShoppingListPage city={city} />
            )}
          </div>
        </div>
      </FlyersLayout>
    </>
  );
};

export default ShoppingPage;
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import FlyersLayout from "@/components/FlyersLayout";
import { generateCategories, CategoryItem } from "@/utils/categoryUtils";
import { useStoresFromDB, Store } from "@/hooks/useStoresFromDB";
import ProductCard from "@/components/ProductCard";
import FavoritesSection from "@/components/Favorites";
import { FlyerProduct } from "@/types/flyerProduct";
import { useProductFavorites } from "@/contexts/ProductFavorites";
import { toast } from "react-hot-toast";
import { useFlyerProducts } from "@/hooks/useFlyerProducts";
import ProductModal from "@/components/ProductModal";
import Pagination from "@/components/Pagination";
import { ProductAds } from "@/components/ProductAds";
import HotProducts from "@/components/Hotproducts";
import ProductBanners from "@/components/ProductBanner";

const ProductPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();
  const { products: allProducts, brandCounts } = useFlyerProducts(id as string);
  const { toggleFavorite, isFavorite } = useProductFavorites();

  // UI selection state
  const [selectedCategory, setSelectedCategory] =
  useState<string>("All Circulars");
  const [categories, setCategories] = useState<CategoryItem[]>([]); 
  const [activeSection, setActiveSection] = useState<string>("section1");
  const [city, setCity] = useState<string>("");
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FlyerProduct | null>(
    null
  );
  const [currentStoreId, setCurrentStoreId] = useState<string>("");

  // Filters lifted to page-level
  const [minPrice, setMinPrice] = useState<number>(500);
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [filterBrands, setFilterBrands] = useState<string[]>([]);

  const { stores: allCityStores } = useStoresFromDB(city, undefined);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Handle favorite click
  const handleProductFavoriteClick = (product: FlyerProduct) => {
    const wasFavorite = isFavorite(product.id);
    toggleFavorite(product);

    if (wasFavorite) {
      toast(`${product.name} removed from favorites`, {
        icon: "🗑️",
        style: { background: "#fff3f3", color: "#d32f2f" },
      });
    } else {
      toast.success(`${product.name} added to favorites`, {
        duration: 2500,
        icon: "💖",
      });
    }
  };

  // Handle card click to open modal
  const handleCardClick = (product: FlyerProduct, storeId: string) => {
    setSelectedProduct(product);
    setCurrentStoreId(storeId);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setCurrentStoreId("");
  };

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

  // Called by Sidebar to set filters
  const handleFilterChange = (filters: {
    categories: string[];
    statuses: string[];
    brands: string[];
    priceRange: [number, number];
  }) => {
    console.log("Filters received in parent:", filters);
    setFilterCategories(filters.categories || []);
    setFilterStatuses(filters.statuses || []);
    setFilterBrands(filters.brands || []);
    if (filters.priceRange) {
      setMinPrice(filters.priceRange[0]);
      setMaxPrice(filters.priceRange[1]);
    }
  };

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

  // Derived filtered products
  const filteredProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    const filtered = allProducts.filter((p) => {
      const price = Number(p.price || 0);
      if (price < minPrice || price > maxPrice) return false;

      if (filterCategories.length > 0) {
        const matchesCategory =
          (p.category && filterCategories.includes(p.category)) ||
          (p.subcategory && filterCategories.includes(p.subcategory));
        if (!matchesCategory) return false;
      }

      if (filterStatuses.length > 0) {
        const status = (p.product_status || "").toString();
        if (!filterStatuses.includes(status)) return false;
      }

      if (filterBrands.length > 0) {
        const brand =
          (typeof p.brand === "string" && p.brand) ||
          (Array.isArray(p.brands) && p.brands[0]) ||
          "";
        if (!filterBrands.includes(brand)) return false;
      }

      return true;
    });

    console.log("Filtered products count:", filtered.length, filtered);
    return filtered;
  }, [
    allProducts,
    minPrice,
    maxPrice,
    filterCategories,
    filterStatuses,
    filterBrands,
  ]);

  // 🧩 Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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
        brandCounts={brandCounts}
        onFilterChange={handleFilterChange}
        showProductsTab={true} // show here
      >
        <div className="container mx-auto p-4">
          <ProductAds />

          
          {activeSection === "favourites" ? (
            <FavoritesSection city={city} />
          ) : (
            <>
              <ProductCard
                storeId={id as string}
                onFavoriteClick={handleProductFavoriteClick}
                products={paginatedProducts}
                onCardClick={handleCardClick}
              />
              {/* ✅ Pagination Component */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}

              <HotProducts products={filteredProducts} />

              <ProductBanners openModal={handleCardClick} />

            </>
          )}
        </div>
      </FlyersLayout>
      <ProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
        currentStoreId={currentStoreId}
        openModal={handleCardClick}
        onFavoriteClick={handleProductFavoriteClick}
        isFavorite={(product: FlyerProduct) => isFavorite(product.id)}
      />
    </>
  );
};

export default ProductPage;

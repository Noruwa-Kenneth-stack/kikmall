"use client";

import * as React from "react";
import Image from "next/image";
import { useCity } from "@/contexts/CityContext";
import StoreCard from "@/components/StoreCard";
import { Store } from "@/types/store";
import { FlyerProduct } from "@/types/flyerProduct";
import ProductModal from "@/components/ProductModal";
import { useProductFavorites } from "@/contexts/ProductFavorites"; // ✅ For product favorites
import { useFavorites } from "@/contexts/FavoritesContext"; // ✅ For store favorites
import { toast } from "react-hot-toast";
import Pagination from "@/components/Pagination";

interface StoreDetailsProps {
  storeName: string;
}

export default function StoreDetails({ storeName }: StoreDetailsProps) {
  const { city } = useCity();

  const [stores, setStores] = React.useState<Store[]>([]);
  const [items, setItems] = React.useState<FlyerProduct[]>([]);
  const [activeTab, setActiveTab] = React.useState<
    "all" | "circulars" | "items"
  >("all");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] =
    React.useState<FlyerProduct | null>(null);
  const [currentStoreId, setCurrentStoreId] = React.useState<string>("");

  // ❤️ store favorites
  const { favorites, toggleFavorite } = useFavorites();

  // 💖 product favorites
  const {
    toggleFavorite: toggleProductFavorite,
    isFavorite: isProductFavorite,
  } = useProductFavorites();

// 🧭 pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;


  const openModal = (product: FlyerProduct, storeId: string) => {
    setSelectedProduct(product);
    setCurrentStoreId(storeId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  React.useEffect(() => {
    if (!city || !storeName) return;

    const searchParams = new URLSearchParams(window.location.search);
    const term = searchParams.get("term");

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔍 If there's a search term, fetch products for that term (by compare_key)
        if (term) {
          const res = await fetch(
            `/api/searchitems/${encodeURIComponent(
              term
            )}?city=${encodeURIComponent(city)}`
          );

          if (!res.ok) throw new Error("Failed to load search results");
          const data = await res.json();

          setItems(data.items || []);
          setStores([]); // Optional — clears circulars when showing term results
          setLoading(false);
          return; // 🛑 Stop here; no need to fetch store data
        }

        // 🏪 Otherwise, load normal store and its products
        const storeRes = await fetch(
          `/api/stores?city=${encodeURIComponent(
            city
          )}&store=${encodeURIComponent(storeName)}`
        );

        if (!storeRes.ok) throw new Error("Store not found");

        const storeData: { stores?: Partial<Store>[] } = await storeRes.json();

        const storesArray: Store[] = (storeData.stores ?? []).map((raw) => ({
          id: raw.id ?? 0,
          storeName: raw.storeName ?? "Unknown Store",
          logo: raw.logo ?? "/icons/default.png",
          imageUrl: raw.logo ?? "/icons/default.png",
          status: raw.status ?? "Available",
          city: raw.city ?? "",
          created_at: raw.created_at ?? new Date().toISOString(),
          categories: raw.categories ?? [],
        }));

        if (storesArray.length === 0) throw new Error("No stores found");
        setStores(storesArray);

        // 🧺 Fetch flyer_products for all stores
        const allProducts: FlyerProduct[] = [];
        for (const s of storesArray) {
          const flyerRes = await fetch(`/api/flyer_products?store_id=${s.id}`);
          if (flyerRes.ok) {
            const flyerData = await flyerRes.json();
            const products = Array.isArray(flyerData)
              ? flyerData
              : flyerData.items ?? [];
            allProducts.push(...products);
          }
        }
        setItems(allProducts);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city, storeName]);


  // 💖 Handle product favorites
  const handleProductFavoriteClick = (product: FlyerProduct) => {
    const wasFavorite = isProductFavorite(product.id);
    toggleProductFavorite(product);

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

    // 🧮 Pagination logic
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );

 const filteredCirculars = activeTab === "all" || activeTab === "circulars" ? stores : [];
  const filteredItems = activeTab === "all" || activeTab === "items" ? paginatedItems : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white z-20">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-6 overflow-x-auto">
          {(
            [
              { key: "all", label: "All", count: stores.length + items.length },
              { key: "circulars", label: "Circulars", count: stores.length },
              { key: "items", label: "Items", count: items.length },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 border-b-2 transition-all text-sm sm:text-base font-medium whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-blue-500"
              }`}
            >
              {tab.label}
              <span className="text-gray-400 text-sm font-normal">
                ({tab.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Circulars Grid */}
      {filteredCirculars.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Circulars for {storeName} in {city}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCirculars.map((store) => {
              const isFav = favorites.includes(store.id);

              const handleStoreFavorite = () => {
                toggleFavorite(store.id);
                if (isFav) {
                  toast(`${store.storeName} removed from favorites`, {
                    icon: "🗑️",
                    style: { background: "#fff3f3", color: "#d32f2f" },
                  });
                } else {
                  toast.success(`${store.storeName} added to favorites 💙`, {
                    duration: 2500,
                  });
                }
              };

              return (
                <StoreCard
                  key={store.id}
                  store={store}
                  size="large"
                  isFavorite={isFav}
                  onToggleFavorite={handleStoreFavorite}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Items Grid */}
      {filteredItems.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {storeName} – Items
          </h2>
          <div className=" searchitem grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => openModal(item, String(item.store_id))}
                className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md overflow-hidden cursor-pointer transition"
              >
                <div className="relative w-full h-40 bg-gray-50 flex items-center justify-center">
                  {stores[0]?.logo && (
                    <Image
                      src={stores[0].logo}
                      alt={`${stores[0].storeName} logo`}
                      width={28}
                      height={28}
                      className="absolute top-2 left-2 rounded-md border border-gray-200 bg-white p-1"
                    />
                  )}
                  <Image
                    src={item.image || "/icons/cart.png"}
                    alt={item.name || "Product image"}
                    width={200}
                    height={200}
                    className="object-contain w-full h-full"
                  />
                </div>

                <div className="p-3 text-center space-y-1">
                  {item.product_status && (
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      {item.product_status}
                    </p>
                  )}
                  <p className="text-sm font-bold text-gray-800">
                    ₦{item.price?.toLocaleString() || "--"}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {item.short_description}
                  </p>
                </div>
              </div>
            ))}
          </div>
           {/* ✅ Pagination Component */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={closeModal}
        product={selectedProduct}
        currentStoreId={currentStoreId}
        openModal={openModal}
        onFavoriteClick={handleProductFavoriteClick} // ✅ product favorites
        isFavorite={(product) => isProductFavorite(product.id)} // ✅ shared state
      />
    </div>
  );
}

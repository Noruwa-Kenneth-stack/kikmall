"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CarouselDots } from "@/components/CarouselDots";
import { FlyerProduct } from "@/types/flyerProduct";
import { Star, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { getProductImage } from "@/utils/getProductImage";

interface ComparisonItem extends FlyerProduct {
  storeName: string;
  storeLogo?: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: FlyerProduct | null;
  currentStoreId: string;
  openModal: (product: FlyerProduct, storeId: string) => void;
  onFavoriteClick: (product: FlyerProduct) => void;
  isFavorite: (product: FlyerProduct) => boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,

  openModal,
  onFavoriteClick,
  isFavorite,
}) => {
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonProducts, setComparisonProducts] = useState<
    ComparisonItem[]
  >([]);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const plugin = useRef(Autoplay({ delay: 8000, stopOnInteraction: true }));
  const { addToShoppingList, removeFromShoppingList, shoppingList } =
    useShoppingList();
  const isInCart = (productId: number) =>
    shoppingList.some((p) => p.id === productId);

  useEffect(() => {
    if (product) {
      setComparisonProducts([]); // reset when switching products
      setShowComparison(false); // close previous comparison
    }
  }, [product]);

  // Handle scroll lock while modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Fetch comparison products from the server
  const fetchComparisonProducts = async () => {
    if (!product) return;
    setLoadingComparison(true);
    try {
      const res = await fetch(
        `/api/comparison?compare_key=${encodeURIComponent(
          product.compare_key || ""
        )}&current_id=${encodeURIComponent(String(product.id))}`
      );

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setComparisonProducts(data);
      } else {
        toast("No related products found", { icon: "ℹ️" });
      }
    } catch (err) {
      console.error("Comparison fetch error", err);
      toast.error("Failed to load comparison results");
    } finally {
      setLoadingComparison(false);
    }
  };

  // Group comparison items for carousel
  const groupedComparison: ComparisonItem[][] = [];
  const GROUP_SIZE = 5;
  for (let i = 0; i < comparisonProducts.length; i += GROUP_SIZE) {
    groupedComparison.push(comparisonProducts.slice(i, i + GROUP_SIZE));
  }

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on("select", () => {});
  }, [carouselApi]);

  if (!isOpen || !product) return null;

  const price = Number(product.price ?? 0);
  const hasDiscount =
    typeof product.discounted_price === "number" &&
    product.discounted_price > 0 &&
    product.discounted_price < price;
  const displayPrice = hasDiscount ? Number(product.discounted_price) : price;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] p-4"
        >
          <div className="bg-white rounded-lg w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute right-4 top-4 text-lg text-gray-600"
              onClick={onClose}
            >
              ✕
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Left: Product Image */}
              <div className="md:w-1/2 flex flex-col items-center">
                <p className="text-sm text-gray-500">
                  Brand: {(product.brand && String(product.brand)) || "Unknown"}{" "}
                  • {product.category || ""}{" "}
                  {product.subcategory ? `• ${product.subcategory}` : ""}
                </p>
                <div className="w-full max-w-[360px] h-[320px] flex items-center justify-center bg-gray-50 rounded">
                  {product.image ? (
                    <Image
                      src={getProductImage(product.image)}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="object-contain"
                    />
                  ) : (
                    <div className="text-gray-400">No image</div>
                  )}
                </div>
                {product.image_thumbnails?.length ? (
                  <div className="flex gap-2 mt-4 flex-wrap justify-center">
                    {product.image_thumbnails.map((img, idx) =>
                      img ? (
                        <div
                          key={idx}
                          className="w-14 h-14 p-1 bg-white rounded shadow-sm"
                        >
                          <Image
                            src={getProductImage(img)}
                            alt={`thumb-${idx}`}
                            width={56}
                            height={56}
                            className="object-contain"
                          />
                        </div>
                      ) : null
                    )}
                  </div>
                ) : null}
              </div>

              {/* Right: Product Details */}
              <div className="md:w-1/2 space-y-4">
                <h2 className="text-2xl font-semibold">{product.name}</h2>

                {product.short_description && (
                  <p className="text-sm text-gray-600">
                    {product.short_description}
                  </p>
                )}

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (product.rating || 4)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <div
                  className={`inline-flex items-center text-sm font-medium px-2 py-1 rounded ${
                    (product.product_status || "").toLowerCase() === "in stock"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {product.product_status || "Status unknown"}
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-pink-600 text-2xl font-bold">
                    ₦{displayPrice.toLocaleString()}
                  </p>
                  {hasDiscount && (
                    <>
                      <p className="line-through text-gray-400">
                        ₦{price.toLocaleString()}
                      </p>
                      <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        {Math.round(
                          ((price - Number(product.discounted_price)) / price) *
                            100
                        )}
                        % OFF
                      </span>
                    </>
                  )}
                </div>

                <div className="flex gap-4 mt-3 items-center">
                  <button
                    className="text-sm text-gray-600 hover:text-black"
                    onClick={async () => {
                      setShowComparison((prev) => {
                        const opening = !prev;
                        if (opening) {
                          void fetchComparisonProducts();
                          setTimeout(
                            () =>
                              window.scrollBy({
                                top: 200,
                                behavior: "smooth",
                              }),
                            300
                          );
                        }
                        return opening;
                      });
                    }}
                  >
                    ⇄ Compare with other stores
                  </button>

                  <button
                    onClick={() => onFavoriteClick(product)}
                    className="text-red-500 text-xl"
                  >
                    {isFavorite(product) ? "♥" : "♡"}
                  </button>

                  {isInCart(product.id) ? (
                    <Button
                      size="icon"
                      className="rounded-full bg-red-500 text-white hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromShoppingList(product.id);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      size="icon"
                      className="rounded-full bg-blue-500 text-white hover:bg-blue-600"
                      onClick={async (e) => {
                        e.stopPropagation();

                        // show it instantly (without waiting)
                        addToShoppingList(product);

                        try {
                          const res = await fetch(
                            `/api/product-with-store?product_id=${product.id}`
                          );
                          if (!res.ok) return;

                          const fullProduct = await res.json();

                          // patch the entry once the full data arrives
                          addToShoppingList(fullProduct, true);
                        } catch (err) {
                          console.error("background fetch failed:", err);
                        }
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {product.long_description && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Product Details
                    </h3>
                    <p className="text-sm text-gray-600">
                      {product.long_description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Comparison Section */}
            {showComparison && (
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  {loadingComparison
                    ? "Loading comparison..."
                    : "Best price from other stores"}
                </h3>

                {!loadingComparison && groupedComparison.length > 0 ? (
                  <Carousel
                    opts={{ loop: true, align: "start" }}
                    plugins={[plugin.current]}
                    setApi={setCarouselApi}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {groupedComparison.map((group, idx) => (
                        <CarouselItem key={idx} className="w-full">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            {group.map((item, i) => (
                              <div
                                key={i}
                                className=" border border-gray-200 shadow-sm rounded-lg p-2 flex flex-col items-center text-center cursor-pointer hover:shadow"
                                onClick={() =>
                                  openModal(item, String(item.store_id))
                                }
                              >
                                {/* ADD THIS BELOW — status per item */}
                                {item.product_status && (
                                  <div
                                    className={`text-[10px] font-medium mt-1 px-2 py-[2px] rounded ${
                                      item.product_status.toLowerCase() ===
                                      "in stock"
                                        ? "bg-green-50 text-green-600"
                                        : item.product_status.toLowerCase() ===
                                          "out of stock"
                                        ? "bg-red-50 text-red-600"
                                        : "bg-pink-50 text-pink-600"
                                    }`}
                                  >
                                    {item.product_status}
                                  </div>
                                )}

                                <div className="w-full h-20 flex items-center justify-center">
                                  <Image
                                    src={
                                      item.image ||
                                      "/images/default-product.png"
                                    }
                                    alt={item.name}
                                    width={100}
                                    height={70}
                                    className="object-contain"
                                  />
                                </div>
                                <p className="mt-2 text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                  {item.storeName}
                                </p>
                                <p className="font-bold text-pink-600">
                                  ₦
                                  {Number(
                                    item.discounted_price ?? item.price ?? 0
                                  ).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 z-10" />
                    <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 z-10" />
                    <CarouselDots />
                  </Carousel>
                ) : !loadingComparison ? (
                  <p className="text-sm text-gray-500">
                    No comparison data available.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;

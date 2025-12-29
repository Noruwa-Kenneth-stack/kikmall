"use client";

import { Flame, ShoppingCart, Star, X } from "lucide-react";
import { FlyerProduct } from "@/types/flyerProduct";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useProductFavorites } from "@/contexts/ProductFavorites";
import { toast } from "react-hot-toast";
import { useShoppingList } from "@/contexts/ShoppingListContext";

interface ProductCardProps {
  products: FlyerProduct[];
  onFavoriteClick?: (product: FlyerProduct) => void;
  storeId?: string;
  onCardClick?: (product: FlyerProduct, storeId: string) => void;
}

export default function ProductCard({
  products,
  onFavoriteClick,
  storeId,
  onCardClick,
}: ProductCardProps) {
  const { toggleFavorite, isFavorite } = useProductFavorites();
  const { addToShoppingList, removeFromShoppingList, shoppingList } =
    useShoppingList();
  const isInCart = (productId: number) =>
    shoppingList.some((p) => p.id === productId);

  const handleFavoriteClick = (product: FlyerProduct) => {
    const wasFavorite = isFavorite(product.id);
    toggleFavorite(product);
    toast.success(
      wasFavorite
        ? `${product.name} removed from favorites`
        : `${product.name} added to favorites`
    );
  };

  if (!products || products.length === 0)
    return (
      <div className="flex justify-center items-center h-full text-lg">
        <p>Products coming soon for this store...</p>
      </div>
    );

  return (
    <div className="product-card grid md:grid-cols-3 lg:grid-cols-4 gap-6 ">
      {products.map((product) => {
        // Determine if product has a valid discount
        const hasDiscount =
          typeof product.discounted_price === "number" &&
          product.discounted_price > 0 &&
          product.discounted_price < product.price;

        return (
          <div
            key={product.id}
            className="group relative bg-white rounded-xl p-3 shadow hover:shadow-lg transition-all duration-300 w-full cursor-pointer border border-gray-100 hover:border-gray-200"
            onClick={() =>
              onCardClick && storeId
                ? onCardClick(product, storeId)
                : console.log("Card clicked, no handler or storeId")
            }
          >
            {/* status badge */}
            {product.product_status && (
              <Badge
                className={`absolute top-3 left-3 z-10 rounded-full px-3 py-1 text-[11px] font-semibold
        ${
          product.product_status === "Hot"
            ? "bg-orange-500 text-white"
            : product.product_status === "New"
            ? "bg-blue-500 text-white"
            : product.product_status === "Out Of Stock"
            ? "bg-gray-400 text-white"
            : "bg-green-500 text-white"
        }`}
              >
                {product.product_status === "Hot" && (
                  <Flame size={12} className="animate-pulse" />
                )}
                {product.product_status}
              </Badge>
            )}

            {/* discount badge */}
            {hasDiscount && (
              <div className="absolute top-12 left-3 bg-pink-600 text-white text-[10px] font-bold px-2 py-[3px] rounded-full shadow">
                {Math.round(
                  ((product.price - product.discounted_price!) /
                    product.price) *
                    100
                )}
                % OFF
              </div>
            )}

            {/* product image */}
            <div className="relative w-full h-[150px] flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
              <Image
                src={
                  product.image
                    ? `/products/${product.image}`
                    : "/products/default.png" // fallback image
                }
                alt={product.name}
                width={150}
                height={150}
                className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
              />

              {/* hover icons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* expand / quick view */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onCardClick && storeId) onCardClick(product, storeId);
                  }}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10l4.553-4.553a1.5 1.5 0 00-2.122-2.122L12 7.879 6.569 2.447a1.5 1.5 0 10-2.122 2.122L9 10m6 4l4.553 4.553a1.5 1.5 0 01-2.122 2.122L12 16.121l-5.431 5.432a1.5 1.5 0 01-2.122-2.122L9 14"
                    />
                  </svg>
                </button>

                {/* favorite */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from triggering

                    if (onFavoriteClick) {
                      onFavoriteClick(product);
                    } else {
                      handleFavoriteClick(product);
                    }
                  }}
                  className="bg-white p-3 rounded-full shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-colors ${
                      isFavorite(product.id)
                        ? "text-red-500 fill-current"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.637l1.318-1.319a4.5 4.5 0 116.364 6.364L12 21.364 4.318 12.682a4.5 4.5 0 010-6.364z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* product info */}
            <div className="flex flex-col mt-1">
              <h3 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2 min-h-[2rem]">
                {product.name}
              </h3>

              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < (product.rating || 4)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="product-card-price  flex items-center gap-1">
                  {hasDiscount ? (
                    <>
                      <span className="text-xs line-through text-gray-400">
                        ₦{product.price.toLocaleString()}
                      </span>
                      <span className="text-base font-bold text-green-600">
                        ₦{product.discounted_price!.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-base font-bold text-green-600">
                      ₦{product.price.toLocaleString()}
                    </span>
                  )}
                </div>

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
                      addToShoppingList(product);
                      try {
                        const res = await fetch(
                          `/api/product-with-store?product_id=${product.id}`
                        );
                        if (!res.ok) return;
                        const fullProduct = await res.json();
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
            </div>
          </div>
        );
      })}
    </div>
  );
}

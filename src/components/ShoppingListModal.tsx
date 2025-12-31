// ShoppingListModal.tsx
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FlyerProduct } from "@/types/flyerProduct";
import { Star, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { getProductImage } from "@/utils/getProductImage";

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: FlyerProduct | null;
}

const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  const { addToShoppingList, removeFromShoppingList, shoppingList } =
    useShoppingList();
  const isInCart = (productId: number) =>
    shoppingList.some((p) => p.id === productId);
  if (!isOpen || !product) return null;

  const price = Number(product.price ?? 0);
  const discountedPrice = Number(product.discounted_price ?? 0);
  const hasDiscount = discountedPrice > 0 && discountedPrice < price;
  const displayPrice = hasDiscount ? discountedPrice : price;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] p-4  pt-20"
        >
          <div className="bg-white rounded-lg w-full max-w-4xl  p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute right-4 top-4 text-lg text-gray-600"
              onClick={onClose}
            >
              ✕
            </button>

            <div className="flex flex-col md:flex-row gap-6">
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
                        i < (product.rating || 0)
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
                          addToShoppingList(fullProduct);
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingListModal;

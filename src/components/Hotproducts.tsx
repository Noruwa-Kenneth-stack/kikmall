// components/Hotproducts.tsx
"use client";

import Image from "next/image";
import React, {  useState } from "react";
import { FlyerProduct } from "@/types/flyerProduct";
import { Countdown } from "@/components/Countdown";

interface Props {
  products: FlyerProduct[];
}

const Hotproducts: React.FC<Props> = ({ products }) => {
  const [progress, setProgress] = useState(0);

  // 1. Pick the *first* product that has BOTH start & end dates
  const featuredProduct = products.find(
    (p) => p.offer_start_date && p.offer_end_date
  );

  // Nothing to show → early return
  if (!featuredProduct) return null;

  // Helper – calculate discount % (unchanged)
  const discountPercent = featuredProduct.price && featuredProduct.discounted_price
    ? Math.round(
        100 -
          (Number(featuredProduct.discounted_price) / Number(featuredProduct.price)) *
            100
      )
    : 0;

  return (
    <div className="relative flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          HOT PRODUCT FOR <span className="text-pink-600">THIS WEEK</span>
        </h2>
        <p className="text-sm text-gray-500">
          Don’t miss this opportunity at a special discount just for this week.
        </p>
      </div>

      <div className="border border-pink-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 relative">
        {/* Discount badge */}
        <div className="absolute left-3 sm:left-4 top-3 sm:top-4 bg-pink-600 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full z-10">
          {discountPercent}%
        </div>

        {/* Product image */}
        <div className="w-20 sm:w-24 flex-shrink-0">
          <Image
            src={featuredProduct.image}
            alt={featuredProduct.name}
            width={100}
            height={100}
            className="object-contain w-full h-auto"
          />
        </div>

        {/* Text + prices */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center text-sm mb-1">
            <span className="text-gray-400 line-through text-xs sm:text-sm">
              ₦{featuredProduct.price.toLocaleString()}
            </span>
            {featuredProduct.discounted_price != null && (
              <span className="text-red-500 font-bold text-base sm:text-lg">
                ₦{featuredProduct.discounted_price.toLocaleString()}
              </span>
            )}
          </div>

          <h3 className="text-sm sm:text-md font-semibold">
            {featuredProduct.name}
          </h3>

          <p
            className={`text-xs mt-1 font-medium ${
              featuredProduct.product_status === "In Stock"
                ? "text-green-600"
                : featuredProduct.product_status === "Out Of Stock"
                ? "text-red-600"
                : "text-pink-600"
            }`}
          >
            {featuredProduct.product_status || "Unknown"}
          </p>

          {/* ----- PROGRESS BAR + COUNTDOWN ----- */}
          <div className="mt-3">
            {/* Bar – moves *from left to right* as the offer expires */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-yellow-400 transition-all duration-1000 ease-linear"
                style={{ width: `${(100 - progress).toFixed(2)}%` }}
              />
            </div>

            {/* Countdown – receives DB dates */}
            <Countdown
              startDate={featuredProduct.offer_start_date!}
              endDate={featuredProduct.offer_end_date!}
              onProgress={setProgress}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotproducts;
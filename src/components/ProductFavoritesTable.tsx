"use client";

import React from "react";
import Image from "next/image";
import { useProductFavorites } from "@/contexts/ProductFavorites";
import { FlyerProduct } from "@/types/flyerProduct";

interface ProductFavoritesTableProps {
  onFavoriteClick?: (product: FlyerProduct, wasFavorite: boolean) => void;
}

const ProductFavoritesTable: React.FC<ProductFavoritesTableProps> = ({
  onFavoriteClick,
}) => {
  const { favoritesList, toggleFavorite, isFavorite } = useProductFavorites();

  const handleClick = (product: FlyerProduct) => {
    const wasFavorite = isFavorite(product.id);
    toggleFavorite(product);
    if (onFavoriteClick) onFavoriteClick(product, wasFavorite);
  };

  if (!favoritesList || favoritesList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg md:text-xl">
          You currently do not have any favorite products.
        </p>
        <div className="relative inline-block mt-4">
          <h2 className="text-gray-500 text-base leading-tight text-center">
            Click the{" "}
            <Image
              src="/08/favourite-outline.svg"
              alt="Heart Icon"
              width={16}
              height={16}
              className="inline-block align-middle"
            />{" "}
            on your favorite products to save them here.
          </h2>
          <Image
            src="/08/myArrowLeft.svg"
            alt="Arrow"
            width={40}
            height={100}
            className="absolute right-[-55px] top-[120%] -translate-y-1/2 rotate-[200deg]"
          />
        </div>
        <div className="mt-6 flex justify-center">
          <Image
            className="fav-anim"
            src="/08/favourites.gif"
            alt="Favorites Animation"
            width={260}
            height={260}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {favoritesList.map((product) => (
        <div
          key={product.id}
          className="group relative bg-white rounded-xl shadow hover:shadow-lg transition p-4"
        >
          {/* ❤️ Favorite toggle */}
          <div className="absolute top-2 right-2 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            <button
              onClick={() => handleClick(product)}
              className="bg-white p-3 rounded-full shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-colors ${
                  isFavorite(product.id)
                    ? "text-red-500 fill-current"
                    : "text-gray-400 hover:text-red-500"
                }`}
                viewBox="0 0 24 24"
                fill={isFavorite(product.id) ? "currentColor" : "none"}
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

          {product.image && (
            <div className="w-full h-40 relative mb-3">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain rounded-md"
              />
            </div>
          )}

          <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>

          {product.price && (
            <p className="text-blue-600 font-semibold text-sm mt-1">
              {product.price}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductFavoritesTable;

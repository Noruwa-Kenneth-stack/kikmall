"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { FlyerProduct } from "@/types/flyerProduct";

interface ProductFavoritesContextType {
  favoritesList: FlyerProduct[];
  toggleFavorite: (product: FlyerProduct) => void;
  removeFavorite: (id: string | number) => void;
  isFavorite: (id: string | number) => boolean;
}

const ProductFavoritesContext = createContext<ProductFavoritesContextType | undefined>(undefined);

export const ProductFavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoritesList, setFavoritesList] = useState<FlyerProduct[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("product-favorites");
    if (stored) {
      try {
        setFavoritesList(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse favorites", err);
        setFavoritesList([]);
      }
    }
  }, []);

  // Save to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("product-favorites", JSON.stringify(favoritesList));
  }, [favoritesList]);

  const idEquals = (a: string | number, b: string | number) =>
    String(a).trim() === String(b).trim();

  // ✅ FIXED HERE — correct setter name
  const toggleFavorite = (product: FlyerProduct) => {
    setFavoritesList((prev) => {
      const isAlreadyFavorite = prev.some((p) => idEquals(p.id, product.id));
      if (isAlreadyFavorite) {
        return prev.filter((p) => !idEquals(p.id, product.id)); // remove
      } else {
        return [...prev, product]; // add
      }
    });
  };

  const removeFavorite = (id: string | number) => {
    setFavoritesList((prev) => prev.filter((p) => !idEquals(p.id, id)));
  };

  const isFavorite = (id: string | number) => {
    return favoritesList.some((p) => idEquals(p.id, id));
  };

  return (
    <ProductFavoritesContext.Provider
      value={{ favoritesList, toggleFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </ProductFavoritesContext.Provider>
  );
};

export const useProductFavorites = (): ProductFavoritesContextType => {
  const ctx = useContext(ProductFavoritesContext);
  if (!ctx) throw new Error("useProductFavorites must be used within ProductFavoritesProvider");
  return ctx;
};

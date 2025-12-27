"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { FlyerProduct } from "@/types/flyerProduct";
import { toast } from "react-hot-toast";

interface ShoppingListContextType {
  shoppingList: FlyerProduct[];
  addToShoppingList: (product: FlyerProduct, silent?: boolean) => void;
  removeFromShoppingList: (productId: number) => void;
  itemCount: number;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(
  undefined
);

export const ShoppingListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [shoppingList, setShoppingList] = useState<FlyerProduct[]>([]);

  // 🧩 Load from localStorage when the app mounts
  useEffect(() => {
    const saved = localStorage.getItem("shoppingList");
    if (saved) {
      try {
        setShoppingList(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse shoppingList from localStorage", e);
      }
    }
  }, []);

  // 🧩 Persist updates to localStorage
  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
  }, [shoppingList]);

  // ✅ Add or update an item
 const addToShoppingList = (product: FlyerProduct, silent = false) => {
  setShoppingList((prev) => {
    const existingIndex = prev.findIndex((p) => p.id === product.id);

    if (existingIndex !== -1) {
      const updated = [...prev];
      updated[existingIndex] = { ...updated[existingIndex], ...product };
      return updated;
    }

    const enriched: FlyerProduct = {
      ...product,
      compareKey: product.compareKey || product.name.toLowerCase(),
    };

    return [...prev, enriched];
  });

  // 🛑 Remove the first toast call
  // toast.success(...)  ← DELETE THIS

  // ✅ Only show toast if not silent
  if (!silent) {
    toast.success(`${product.name} added to your list 🛒`, {
      style: { background: "#f0f9ff", color: "#0284c7" },
    });
  }
};

  // 🗑️ Remove an item
  const removeFromShoppingList = (productId: number) => {
    let productName = "";
    setShoppingList((prev) => {
      const product = prev.find((p) => p.id === productId);
      if (product) productName = product.name;
      return prev.filter((p) => p.id !== productId);
    });

    setTimeout(() => {
      if (productName) {
        toast(`${productName} removed`, {
          icon: "🗑️",
          style: { background: "#fff3f3", color: "#d32f2f" },
        });
      }
    }, 0);
  };

  return (
    <ShoppingListContext.Provider
      value={{
        shoppingList,
        addToShoppingList,
        removeFromShoppingList,
        itemCount: shoppingList.length,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => {
  const ctx = useContext(ShoppingListContext);
  if (!ctx)
    throw new Error("useShoppingList must be used within ShoppingListProvider");
  return ctx;
};

"use client";

import { useEffect, useState } from "react";
import { FlyerProduct } from "@/types/flyerProduct";

export function useFlyerProducts(storeId?: string) {
  const [products, setProducts] = useState<FlyerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [brandCounts, setBrandCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!storeId) return;

    async function fetchProducts() {
      try {
        const res = await fetch(`/api/flyer-products?store_id=${storeId}`);
        const data = await res.json();

        // ✅ Ensure always an array
        const productArray = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : [];

        const formatted = productArray.map((p: FlyerProduct) => {
          // Handle both string[] and string forms of brands
          const rawBrand = Array.isArray(p.brands) ? p.brands[0] : p.brands;
          const cleanBrand =
            typeof rawBrand === "string"
              ? rawBrand.replace(/[{}"]/g, "").trim()
              : "Unknown";

          return {
            ...p,
            price: Number(p.price) || 0,
            discounted_price: Number(p.discounted_price) || 0,
            brand: cleanBrand || "Unknown",
          };
        });

        // 🔍 derive unique brands and their counts
       const brandCounts = formatted.reduce((acc: Record<string, number>, p: FlyerProduct) => {
          const brand = p.brand || "Unknown";
          acc[brand] = (acc[brand] || 0) + 1;
          return acc;
        }, {});

        setProducts(formatted);
        setBrandCounts(brandCounts);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setProducts([]);
        setBrandCounts({});
        setLoading(false);
      }
    }

    fetchProducts();
  }, [storeId]);

  return { products, loading, brandCounts };
}

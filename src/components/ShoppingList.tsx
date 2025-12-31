"use client";

import React, { useState, useEffect } from "react";
import { Printer, Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { FlyerProduct as BaseFlyerProduct } from "@/types/flyerProduct";
import CleanupModal from "@/components/CleanupModal";
import ShoppingListModal from "./ShoppingListModal";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { getProductImage } from "@/utils/getProductImage";

interface FlyerProduct extends BaseFlyerProduct {
  isPlaceholder?: boolean;
  compareKey: string; // ensure it's treated as required here
}

interface RecommendedItem {
  id: number;
  name: string;
  icon: string;
}

export default function ShoppingListPage({ city }: { city: string }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [items, setItems] = useState<FlyerProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [bounceItem, setBounceItem] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<RecommendedItem[]>([]);
  const [addedKeys, setAddedKeys] = useState<Set<string>>(new Set());
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeDealsKey, setActiveDealsKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FlyerProduct | null>(
    null
  );
  const { shoppingList, removeFromShoppingList } = useShoppingList();

  // Load recommended items
  useEffect(() => {
    async function fetchRecommended() {
      try {
        const res = await fetch("/api/itemlist");
        const data = await res.json();
        setRecommended(data.items || []);
      } catch (err) {
        console.error("Failed to load recommended items:", err);
      }
    }
    fetchRecommended();
  }, []);

  // Autocomplete: 4 suggestions, starts-with, alphabetical
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/items?name=${encodeURIComponent(
            query
          )}&city=${encodeURIComponent(city)}`
        );
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
      } catch (err) {
        console.error("Autocomplete error:", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, city]);

  // Fetch full items by compareKey
  const fetchItemsByCompareKey = async (compareKey: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/items?compareKey=${encodeURIComponent(
          compareKey
        )}&city=${encodeURIComponent(city)}`
      );
      const data = await res.json();
      console.log("API items response:", data.items?.[0]);

      if (data.items && data.items.length > 0) {
        setItems((prev) => {
          const existing = prev.filter((i) => i.compareKey !== compareKey);
          return [...existing, ...data.items];
        });
      } else {
        // no deals — still show placeholder once
        setItems((prev) => {
          const alreadyExists = prev.some((i) => i.compareKey === compareKey);
          if (alreadyExists) return prev;
          return [
            ...prev,
            {
              id: Date.now(),
              store_id: 0,
              name: compareKey,
              price: 0,
              image: "/icons/cart.png",
              compareKey,
              maincategory: "Others",
              short_description: "No deals found",
              isPlaceholder: true,
            } as FlyerProduct,
          ];
        });
      }

      // mark icon as added
      setAddedKeys((prev) => new Set(prev).add(compareKey.toLowerCase()));
    } catch (err) {
      console.error("Failed to load items:", err);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteItem = (compareKey: string) => {
    setItems((prev) => prev.filter((item) => item.compareKey !== compareKey));
    setAddedKeys((prev) => {
      const newSet = new Set(prev);
      newSet.delete(compareKey.toLowerCase());
      return newSet;
    });
    if (activeDealsKey === compareKey) {
      setActiveDealsKey(null);
    }
  };

  const onShowDeals = (compareKey: string) => {
    setActiveDealsKey((prev) => (prev === compareKey ? null : compareKey));
  };

  const getProductIcon = (compareKey: string) => {
    // try flyer product image first
    const item = items.find((i) => i.compareKey === compareKey);
    const dbImage = item?.image;

    // then fallback to icon from recommended list
    const iconMatch = recommended.find(
      (rec) => rec.name.toLowerCase() === compareKey.toLowerCase()
    );

    const src = iconMatch ? `/items/${iconMatch.icon}` : (dbImage || "/icons/cart.png");

    return (
      <Image
        src={src}
        alt={compareKey}
        width={20}
        height={20}
        className="object-contain"
      />
    );
  };

  // Group by maincategory → compareKey
  const groupedByMain = items.reduce((acc, item) => {
    const mainCat = item.maincategory || "Others";
    if (!acc[mainCat]) acc[mainCat] = {};
    if (!acc[mainCat][item.compareKey]) {
      acc[mainCat][item.compareKey] = { count: 0, items: [] };
    }
    acc[mainCat][item.compareKey].count += 1;
    acc[mainCat][item.compareKey].items.push(item);
    return acc;
  }, {} as Record<string, Record<string, { count: number; items: FlyerProduct[] }>>);

  const clearList = () => {
    // Find which compareKeys were checked and removed
    const removedKeys = Object.keys(checkedItems).filter(
      (key) => checkedItems[key]
    );

    // Remove checked items from list
    setItems((prev) => prev.filter((item) => !checkedItems[item.compareKey]));

    // Return their icons to recommended items
    setAddedKeys((prev) => {
      const newSet = new Set(prev);
      removedKeys.forEach((key) => newSet.delete(key.toLowerCase()));
      return newSet;
    });

    // Reset checkboxes
    setCheckedItems({});
  };

  return (
    <div className="  bg-slate-50 flex flex-col">
      <div className="flex-1 max-w-7xl py-4  md:px-2">
        <div className="grid md:grid-cols-12 gap-6 h-full">
          <section className="md:col-span-7 flex flex-col h-[450px]">
            <div className="z-30 sticky border-gray-100 py-3 px-2">
              <div className="flex items-center gap-3">
                <div className="controls-group flex flex-wrap items-center ml-5 gap-3">
                  <div className="flex-1 relative">
                    <Plus className="absolute left-3 top-1/4 transform translate-y-1/4 text-blue-500 h-4 w-4" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Add an item"
                      className="w-full border border-gray-100 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white pl-10 border-blue-200 focus:border-blue-500"
                    />
                    {loading && (
                      <p className="absolute right-3 top-3 text-xs text-slate-400">
                        Loading...
                      </p>
                    )}
                    {suggestions.length > 0 && (
                      <ul className="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-md max-h-60 overflow-auto">
                        {suggestions.map((item) => (
                          <li
                            key={item}
                            onClick={() => {
                              setQuery(item);
                              setSuggestions([]);
                              fetchItemsByCompareKey(item);
                            }}
                            className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-slate-50"
                          >
                            <span className="text-sm text-slate-800">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    type="button"
                    className="print-button sm:flex-none sm:w-auto border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 flex items-center justify-center transition duration-200"
                    // onClick={printList}
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={Object.values(checkedItems).every(
                      (checked) => !checked
                    )}
                    onClick={() => setShowConfirmModal(true)}
                  ></button>

                  <CleanupModal
                    onClear={clearList}
                    open={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-1">
              <Card className="rounded-2xl border-0 shadow-none bg-transparent flex-1 ">
                {/* ShoppingListSection Start */}
                <CardContent className="p-2 h-full">
                  <div className="p-4">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-2">
                      MY LIST
                    </h2>
                    {shoppingList.length === 0 ? (
                      <div className="bg-blue-50 p-6 rounded-md text-center border border-blue-200">
                        <h3 className="text-md font-semibold text-gray-800 mb-2">
                          No items added yet
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Items you&apos;ve added from flyers and your shopping
                          list will be saved here for easy access
                        </p>
                        <button
                          className="border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-100 text-sm"
                          onClick={() => {
                            const params = new URLSearchParams();
                            if (city) params.set("city", city);
                            params.set("category", "All Circulars");
                            window.location.href = `/flyers?${params.toString()}`;
                          }}
                        >
                          Start Browsing
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {Object.entries(
                          shoppingList.reduce((acc, product) => {
                            const store = product.store_name || "Unknown Store";
                            if (!acc[store]) acc[store] = [];
                            acc[store].push(product);
                            return acc;
                          }, {} as Record<string, FlyerProduct[]>)
                        ).map(([store, products]) => (
                          <div
                            key={store}
                            className="rounded-xl bg-blue-50 order border-gray-200 shadow-sm overflow-hidden"
                          >
                            {/* Store Header */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-white ">
                              <Image
                                src={
                                  products[0].store_logo || "/icons/store.png"
                                }
                                alt={store}
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                              <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                                {store}
                              </h3>
                            </div>

                            {/* Product Grid */}
                            <div className="mylist grid [grid-template-columns:repeat(auto-fit,minmax(130px,1fr))] sm:[grid-template-columns:repeat(auto-fit,minmax(150px,1fr))] gap-4 p-4 bg-gray-50">
                              {products.map((product) => (
                                <motion.div
                                  key={product.id}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="group relative flex flex-col items-center text-center w-full min-w-0 flex-shrink bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden p-3 cursor-pointer transition-all"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setIsModalOpen(true);
                                  }}
                                >
                                  <div className="scale-[clamp(0.9,1vw+0.5,1)] transition-transform">
                                    {/* Trash icon — hidden until hover */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromShoppingList(product.id);
                                      }}
                                     className="
  absolute top-2 right-2
  flex items-center justify-center
  w-6 h-6 rounded-full
  bg-gray-200 text-gray-400
  hover:text-red-500 hover:bg-red-100
  shadow-md transition-all duration-200

  opacity-100 md:opacity-0
  md:group-hover:opacity-100
"

                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>

                                    {/* Product image */}
                                    <div className=" flex items-center justify-center w-full h-[100px] rounded-md overflow-hidden">
                                      <Image
                                      src={getProductImage(product.image)|| "/icons/cart.png"}
                                        alt={product.name}
                                        width={100}
                                        height={100}
                                        className="object-contain"
                                      />
                                    </div>

                                    {/* Price + name */}
                                    <div className="mt-3">
                                      <p className="text-sm font-bold text-gray-800">
                                        ₦
                                        {(product.discounted_price &&
                                        product.discounted_price < product.price
                                          ? product.discounted_price
                                          : product.price
                                        ).toLocaleString()}
                                      </p>
                                      <h3 className="text-xs text-gray-700 mt-1 truncate">
                                        {product.name}
                                      </h3>
                                    </div>

                                    {/* CTA */}
                                    <button className="mt-3 w-full bg-blue-600 text-white text-xs font-semibold py-1.5 rounded-md hover:bg-blue-700 transition">
                                      <span>Buy Online </span>
                                      <span>or Visit Store</span>
                                    </button>
                                    <p className="text-[10px] text-gray-500 mt-1">
                                      at {product.store_name || "Store"}
                                    </p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ShoppingListSection End */}

                  {/* ReconmendedItemsSection Start */}

                  {items.length === 0 ? (
                    <div className="relative flex justify-center items-center h-48 sm:h-56 bg-gray-50 px-4 text-center">
                      <Image
                        src="/items/myArrowLeft.svg"
                        alt="left arrow"
                        width={40}
                        height={40}
                        className="absolute left-2 top-2 animate-bounce hidden sm:block"
                      />
                      <Image
                        src="/items/myArrowRight.svg"
                        alt="right arrow"
                        width={100}
                        height={100}
                        className="absolute right-2 top-[8.5rem] animate-pulse hidden sm:block"
                      />
                      <p className="text-gray-600 max-w-md text-sm sm:text-base hidden sm:block">
                        Start building your shopping list either by{" "}
                        <span className="font-semibold text-black">
                          typing an item
                        </span>{" "}
                        or{" "}
                        <span className="font-semibold text-black">
                          clicking on one of these items
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-64 ">
                      {Object.entries(groupedByMain).map(
                        ([mainCat, categoryItems]) => (
                          <div key={mainCat} className="mb-4">
                            <div className="text-xs font-bold uppercase tracking-wider  mb-1 text-lg text-white bg-gray-800 p-2 rounded-t-lg mb-2">
                              {mainCat}
                            </div>
                            {Object.entries(categoryItems).map(
                              ([compareKey, { count }]) => (
                                <div
                                  key={compareKey}
                                  className="bg-white item-row group flex items-center justify-between gap-3 p-2 rounded-lg mb-2 transition duration-200 hover:bg-gray-100"
                                >
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 accent-blue-600"
                                      checked={!!checkedItems[compareKey]}
                                      onChange={(e) => {
                                        const checked = e.target.checked;
                                        setCheckedItems((prev) => ({
                                          ...prev,
                                          [compareKey]: checked,
                                        }));
                                        setBounceItem(compareKey);
                                      }}
                                    />

                                    <span
                                      className={`text-xl ${
                                        bounceItem === compareKey
                                          ? "animate-bounce"
                                          : ""
                                      }`}
                                    >
                                      {getProductIcon(compareKey)}
                                    </span>
                                    <span className="text-sm">
                                      {compareKey}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => onDeleteItem(compareKey)}
                                      className="
  p-1 mr-2 rounded-full
  bg-white text-red-600
  hover:bg-red-200 transition-opacity duration-200

  opacity-100 md:opacity-0
  md:group-hover:opacity-100
"

                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                    <span
                                      className="text-blue-600 text-sm underline cursor-pointer"
                                      onClick={() => onShowDeals(compareKey)}
                                    >
                                      {categoryItems[compareKey].items.some(
                                        (i) => i.isPlaceholder
                                      )
                                        ? "0 Deals"
                                        : `${count} Deals`}
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          <AnimatePresence mode="wait">
            {!activeDealsKey ? (
              <motion.aside
                key="recommended"
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -80, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="md:col-span-5 h-full px-2 sm:px-4 overflow-hidden md:overflow-y-auto"
              >
                <Card className="rounded-2xl border-transparent bg-transparent shadow-none sm:mt-1">
                  <CardContent className="p-2 sm:p-2">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <div className="text-center sm:text-left">
                        <h2 className="text-base sm:text-lg font-semibold text-slate-800">
                          Recommended Items
                        </h2>
                        <p className="mt-0.5 text-[11px] sm:text-xs uppercase tracking-wide text-slate-500">
                          Popular Items
                        </p>
                      </div>

                      <button
                        onClick={async () => {
                          const toAdd = recommended.filter(
                            (rec) => !addedKeys.has(rec.name.toLowerCase())
                          );
                          if (toAdd.length === 0) return;

                          await Promise.all(
                            toAdd.map((rec) =>
                              fetchItemsByCompareKey(rec.name.toLowerCase())
                            )
                          );

                          setAddedKeys((prev) => {
                            const newSet = new Set(prev);
                            toAdd.forEach((rec) =>
                              newSet.add(rec.name.toLowerCase())
                            );
                            return newSet;
                          });
                        }}
                        disabled={recommended.every((rec) =>
                          addedKeys.has(rec.name.toLowerCase())
                        )}
                        className={`text-sm font-semibold cursor-pointer self-center sm:self-auto ${
                          recommended.every((rec) =>
                            addedKeys.has(rec.name.toLowerCase())
                          )
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-600 hover:underline"
                        }`}
                      >
                        + Add All
                      </button>
                    </div>

                    {/* Horizontal scroll on mobile */}
                    <div className="mt-2 mb-8">
                      <div className="flex gap-3 md:hidden overflow-x-auto no-scrollbar space-x-4 pb-2">
                        {recommended
                          .filter(
                            (rec) => !addedKeys.has(rec.name.toLowerCase())
                          )
                          .map((rec) => (
                            <motion.button
                              key={rec.id}
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={async () => {
                                const key = rec.name.toLowerCase();
                                await fetchItemsByCompareKey(key);
                                setAddedKeys((prev) => new Set(prev).add(key));
                              }}
                              className="flex-none flex flex-col items-center justify-start gap-2 w-10 cursor-pointer transition-transform"
                            >
                              {/* white circular icon wrapper */}
                              <div className="w-14 h-14 flex items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                                <Image
                                  src={
                                    rec.icon
                                      ? `/items/${rec.icon}`
                                      : "/items/default.png"
                                  }
                                  alt={`Icon for ${rec.name}`}
                                  width={30}
                                  height={30}
                                  className="object-contain"
                                />
                              </div>

                              {/* name below */}
                              <span className="text-[11px] font-medium text-slate-700 text-center leading-tight mt-1">
                                {rec.name}
                              </span>
                            </motion.button>
                          ))}
                      </div>

                      {/* Grid layout for tablets and up */}
                      <div className="recommended-grid-desktop  sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3 place-items-center">
                        {recommended
                          .filter(
                            (rec) => !addedKeys.has(rec.name.toLowerCase())
                          )
                          .map((rec) => (
                            <motion.button
                              key={rec.id}
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={async () => {
                                const key = rec.name.toLowerCase();
                                await fetchItemsByCompareKey(key);
                                setAddedKeys((prev) => new Set(prev).add(key));
                              }}
                              className="flex flex-col items-center gap-2 h-15 w-15 mt-3 rounded-full border border-slate-200 bg-white p-4 shadow-sm cursor-pointer"
                            >
                              <div className="flex items-center justify-center">
                                <Image
                                  src={
                                    rec.icon
                                      ? `/items/${rec.icon}`
                                      : "/items/default.png"
                                  }
                                  alt={`Icon for ${rec.name}`}
                                  width={40}
                                  height={40}
                                  className="object-contain"
                                />
                              </div>
                              <span className="text-xs font-medium text-slate-700 text-center mt-3">
                                {rec.name}
                              </span>
                            </motion.button>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.aside>
            ) : (
              <motion.aside
                key="deals"
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -80, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="md:col-span-5 h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
              >
                <Card className="rounded-2xl border-transparent bg-transparent shadow-none mb-4">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-slate-800">
                        Deals for {activeDealsKey}
                      </h2>
                      <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => setActiveDealsKey(null)}
                      >
                        Back
                      </button>
                    </div>

                    {/* Grid of Product Cards */}
                    <div className="max-h-[62vh]">
                      <div className="deal-card grid grid-cols-2 gap-2 justify-items-center">
                        {items
                          .filter((i) => i.compareKey === activeDealsKey)
                          .map((product) => (
                            <motion.div
                              key={product.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="relative group bg-[#f8f9fb] rounded-xl border border-none bg-white sm:p-2 
                              shadow-sm hover:shadow-md transition-all gap-3 cursor-pointer coupon-card w-full max-w-[180px] sm:max-w-[200px] p-3 cursor-pointer transition-all hover:shadow-md"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsModalOpen(true);
                              }}
                            >
                              {/* Top Row: logo + status */}
                              <div className="flex items-center justify-between mb-2">
                                {/* Status badge (right) */}
                                {product.product_status && (
                                  <Badge
                                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold border-0
          ${
            product.product_status === "Hot"
              ? "bg-orange-500 text-white"
              : product.product_status === "New"
              ? "bg-blue-500 text-white"
              : product.product_status === "Out Of Stock"
              ? "bg-pink-500 text-white"
              : "bg-green-500 text-white"
          }`}
                                  >
                                    {product.product_status === "Hot" && (
                                      <Flame
                                        size={12}
                                        className="animate-pulse"
                                      />
                                    )}{" "}
                                    {product.product_status}{" "}
                                  </Badge>
                                )}
                              </div>

                              {/* Image */}
                              <div className="relative w-full   h-[120px] sm:h-[90px] md:h-[100px] flex items-center justify-center overflow-hidden">
                                <Image
                                  src={product.image || "/icons/cart.png"}
                                  alt={product.name}
                                  width={130}
                                  height={130}
                                  className="object-contain p-2 group-hover:scale-105 transition-transform"
                                />
                              </div>

                              {/* Info */}
                              <div className="mt-3 space-y-1">
                                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">
                                  {product.name}
                                </h3>
                                <p className="text-[10px] sm:text-xs text-gray-500">
                                  {product.brand}
                                </p>

                                <div className="flex items-center justify-between mt-1">
                                  {product.discounted_price &&
                                  product.discounted_price < product.price ? (
                                    <>
                                      <span className="text-sm line-through text-gray-400">
                                        ₦{product.price.toLocaleString()}
                                      </span>
                                      <span className="text-base font-bold text-green-600">
                                        ₦
                                        {product.discounted_price.toLocaleString()}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-base font-bold text-green-600">
                                      ₦{product.price.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                    {/* ReconmendedItemSectionEnd */}

                    {/* Product Modal */}
                    <ShoppingListModal
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      product={selectedProduct}
                    />
                  </CardContent>
                </Card>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

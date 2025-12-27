"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./FlyersHeader";

export default function FlyersLayout({
  children,
  activeSection,
  selectedCategory,
  onCategoryChange,
  onSectionChange,
  categories,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onFilterChange,
  brandCounts,
  showProductsTab = false,
}: {
  children: React.ReactNode;
  activeSection: string;
  showProductsTab?: boolean;
  onSectionChange: (key: string) => void;
  selectedCategory: string;
  onCategoryChange: (categoryName: string) => void;
  categories: { name: string; count: number; active?: boolean }[];
  minPrice: number;
  setMinPrice: React.Dispatch<React.SetStateAction<number>>;
  maxPrice: number;
  setMaxPrice: React.Dispatch<React.SetStateAction<number>>;
  onFilterChange?: (filters: {
    categories: string[];
    statuses: string[];
    brands: string[];
    priceRange: [number, number];
  }) => void;
  brandCounts?: Record<string, number>; // ✅ must also be defined here
}) {

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  function handleCategorySelect(categoryName: string): void {
    onCategoryChange(categoryName);
    setSidebarOpen(false);
  }

  return (
    <div className="fixed inset-0 flex bg-gray-50 overflow-hidden">
   <aside
        className={`
          fixed left-0 top-0 h-screen w-62 md:w-65 bg-white shadow-lg z-50 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar
          categories={categories.map((cat) => ({
            ...cat,
            count: cat.count ?? 0,
          }))}
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onFilterChange={onFilterChange} // Pass filter handler
          brandCounts={brandCounts}
           showProductsTab={showProductsTab}
        />
      </aside>
      <div className="flex-1 flex flex-col md:ml-56 md:ml-40 h-full min-h-0">
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-hidden p-2 sm:p-2 md:p-4 min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}

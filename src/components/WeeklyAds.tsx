"use client";

import React from "react";
import StoreGrid from "@/components/StoreGrid";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store } from "@/hooks/useStoresFromDB";

interface WeeklyAdsSectionProps {
  activeTab: "featured" | "latest" | "a-z";
  onTabChange: (tab: "featured" | "latest" | "a-z") => void;
  selectedCategory: string;
  city: string;
  stores: Store[];
  isLoading: boolean;
}

const WeeklyAdsSection: React.FC<WeeklyAdsSectionProps> = ({
  activeTab,
  onTabChange,
  city,
  selectedCategory,
  stores,
  isLoading,
}) => {
  return (
<div className="p-0">
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div className="mt-3 md:mt-0">
      <Tabs
        value={activeTab}
        onValueChange={(val: string) =>
          onTabChange(val as "featured" | "latest" | "a-z")
        }
      >
        <TabsList className="grid w-full grid-cols-3 sm:w-fit">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="a-z">A-Z</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
    <h2 className="text-lg font-semibold text-center md:text-left">
      {selectedCategory === "All Circulars"
        ? `${city} weekly ads and deals`
        : `${city} ${selectedCategory} weekly ads`}
    </h2>
  </div>

  <StoreGrid isLoading={isLoading} stores={stores} activeTab={activeTab} />
</div>
  );
};

export default WeeklyAdsSection;

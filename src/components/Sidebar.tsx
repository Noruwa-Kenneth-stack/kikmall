// "use client";

import React, { useEffect, useState } from "react";
import { Heart, Tag, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LocationDropdown from "./LocationDropdown";
import Image from "next/image";
import { CategoryItem } from "@/utils/categoryUtils";
import { productCategories } from "@/utils/productCategories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Range } from "react-range";
import {
  ChevronDown,
  Coffee,
  Monitor,
  WashingMachine,
  HandHeart,
  Milk,
  ShoppingBasket,
  Beef,
} from "lucide-react";

interface SidebarProps {
  showProductsTab?: boolean; // 👈 new prop
  categories: CategoryItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  onCategorySelect: (categoryName: string) => void;
  selectedCategory: string;
  isOpen: boolean;
  onClose: () => void;
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
  brandCounts?: Record<string, number>;
}

const categoryIcons: Record<string, string> = {
  "Store Category": "/assets/allcirculars.png",
  Groceries: "/assets/groceries.png",
  Pharmacy: "/assets/pharmacy.png",
  "General Merchandise": "/assets/merchandise.png",
  Electronics: "/assets/electronicsicon.png",
  Fashion: "/assets/woman.png",
};

const productIcons: Record<string, React.ElementType> = {
  Beverages: Coffee,
  "Breakfast & Dairy": Milk,
  "Electronics & Accessories": Monitor,
  "Meats & Seafood": Beef,
  "Home Appliances": WashingMachine,
  "Personal Care": HandHeart,
};

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  activeSection,
  onSectionChange,
  onCategorySelect,
  selectedCategory,
  isOpen,
  onClose,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onFilterChange,
  brandCounts,
  showProductsTab = true,
}) => {
  const router = useRouter();
  // Initialize with clamped values to prevent < min or > max
  const [tempMin, setTempMin] = React.useState<number>(
    Math.max(500, Math.min(minPrice || 500, 500000))
  );
  const [tempMax, setTempMax] = React.useState<number>(
    Math.max(500, Math.min(maxPrice || 500000, 500000))
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const statuses = [
    { name: "In Stock", value: "In Stock" },
    { name: "On Sale", value: "On Sale" },
    { name: "Low Stock", value: "Low Stock" },
    { name: "Hot", value: "Hot" },
    { name: "New", value: "New" },
  ];

  // Keep temp inputs in sync with parent props, clamping to valid range
  useEffect(() => {
    setTempMin(Math.max(500, Math.min(minPrice || 500, 500000)));
    setTempMax(Math.max(500, Math.min(maxPrice || 500000, 500000)));
  }, [minPrice, maxPrice]);

  const applyFilters = () => {
    console.log("Applying filters:", { tempMin, tempMax });
    setMinPrice(tempMin);
    setMaxPrice(tempMax);

    onFilterChange?.({
      categories: selectedCategories,
      statuses: selectedStatuses,
      brands: selectedBrands,
      priceRange: [tempMin, tempMax],
    });
  };

  // ✅ Automatically trigger filtering when checkboxes change
  // ✅ Auto-apply checkbox filters (brand, status, category)
  useEffect(() => {
    if (!onFilterChange) return;

    onFilterChange({
      categories: selectedCategories,
      statuses: selectedStatuses,
      brands: selectedBrands,
      priceRange: [minPrice, maxPrice],
    });
  }, [
    selectedCategories,
    selectedStatuses,
    selectedBrands,
    minPrice,
    maxPrice,
    onFilterChange,
  ]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // ✅ Toggle logic — only update local state
  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleCategoryClick = (categoryName: string) => {
    onCategorySelect(categoryName);
    onClose();
    const params = new URLSearchParams();
    const city = localStorage.getItem("city") || "";
    if (city) params.set("city", city);
    if (categoryName) params.set("category", categoryName);
    router.push(`/flyers?${params.toString()}`);
  };

  // If you want instant apply (instead of Apply button), call applyFilters inside each toggle handler.
  // For now we'll expose the "Filter" button to commit.

  return (
    <div>
      <style jsx global>{`
        @keyframes shake {
          0% {
            transform: translateX(0);
          }
          10%,
          90% {
            transform: translateX(-2px);
          }
          20%,
          80% {
            transform: translateX(2px);
          }
          30%,
          50%,
          70% {
            transform: translateX(-4px);
          }
          40%,
          60% {
            transform: translateX(4px);
          }
          100% {
            transform: translateX(0);
          }
        }
        .shake-on-hover:hover {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>

      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={onClose} />
      )}

    <div
    className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:w-full md:h-full flex flex-col overflow-y-auto`}
      >

        <div className="p-4  flex justify-between items-center flex-shrink-0 bg-white sticky top-0 z-10">
          <Link href="/" className="flex items-center">
              <Image
                src="/logo/kikhub.png"
                alt="KIKHUB Logo"
                width={120} // adjust size
                height={120}
                className="object-contain"
              />
            
          </Link>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 md:hidden"
          >
            <X className="h-6 w-6 text-gray-600 hover:text-gray-900" />
          </button>
        </div>

        <ul className="space-y-2 px-4">
          {[
            { name: "Favourite", key: "favourites", Icon: Heart },
            { name: "Weekly Ads", key: "weekly", Icon: Tag },
          ].map(({ name, key, Icon }) => (
            <li key={key}>
              <a
                href="#"
                className={`flex items-center ${
                  activeSection === key
                    ? "text-blue-600 font-medium"
                    : "text-gray-700"
                } hover:text-blue-500 transition-transform duration-200 hover:scale-105`}
                onClick={(e) => {
                  e.preventDefault();
                  onSectionChange(key);
                  onClose();
                }}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="text-lg font-medium">{name}</span>
              </a>
            </li>
          ))}
          <li className="md:hidden">
            <LocationDropdown />
          </li>
        </ul>

        <div className="flex-1 p-4">
         <Tabs
  defaultValue="weekly-ads"
  value={showProductsTab === false ? "weekly-ads" : undefined}
  className="w-full mt-4 overflow-x-hidden max-w-full"
>
  <TabsList className="w-full grid grid-cols-2 bg-gray-100 rounded-md">
    <TabsTrigger
      value="weekly-ads"
      className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-600 rounded-md"
    >
      Weekly Ads
    </TabsTrigger>

    {/* Only show Products tab if showProductsTab is true */}
    {showProductsTab && (
      <TabsTrigger
        value="products"
        className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-600 rounded-md"
      >
        Products
      </TabsTrigger>
    )}
  </TabsList>

            <div className="mt-2 space-y-4 max-h-[400px] overflow-y-auto overflow-x-hidden scrollbar-thin scroll-container">
              <TabsContent value="weekly-ads" className="mt-2">
                <div className="py-2 px-4 bg-gray-100 text-xs font-semibold text-gray-500">
                  WEEKLY ADS
                </div>
                {categories?.length > 0 && (
                  <ul className="py-2 space-y-1">
                    {categories.map((category) => (
                      <li key={category.name} className="px-2 py-1">
                        <a
                          href="#"
                          className={`flex items-center justify-between text-lg ${
                            selectedCategory === category.name
                              ? "text-lg text-blue-600 "
                              : "text-gray-700"
                          } hover:text-blue-500 transition-transform duration-200 hover:scale-105`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleCategoryClick(category.name);
                          }}
                        >
                          <div className="flex items-center">
                            <Image
                              src={
                                categoryIcons[category.name] ||
                                "/icons/default.png"
                              }
                              alt={`${category.name} icon`}
                              className="h-4 w-4 mr-2 shake-on-hover"
                              width={26}
                              height={26}
                            />
                            <span>{category.name}</span>
                          </div>
                          {category.count !== undefined && (
                            <span className="ml-2 text-sm bg-blue-200 text-[#046295] rounded-sm px-2">
                              {category.count}
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>

{/* Only render Products content if tab is allowed */}
  {showProductsTab && (
              <TabsContent value="products" className="mt-2 space-y-4">
                <div>
                  <div className="py-2 px-4 bg-gray-100 text-xs font-semibold text-gray-500">
                    PRODUCT CATEGORIES
                  </div>
                  {productCategories.map((category) => {
                    const Icon = productIcons[category.name] || ShoppingBasket;
                    const isSelected = selectedCategories.includes(
                      category.name
                    );

                    return (
                      <Collapsible
                        key={category.name}
                        defaultOpen={false}
                        asChild
                      >
                        <div className="group">
                          {category.subcategories.length > 0 ? (
                            <>
                              <div className="flex items-center gap-2 px-2 py-1">
                                <Checkbox
                                  id={`cat-${category.name}`}
                                  checked={isSelected}
                                  onCheckedChange={() =>
                                    handleCategoryToggle(category.name)
                                  }
                                />
                                <CollapsibleTrigger asChild>
                                  <div className="flex-1 flex items-center justify-between cursor-pointer">
                                    <span className="flex items-center gap-2 transition-all duration-200 hover:scale-110">
                                      <Icon
                                        className={`h-4 w-4 transition-colors duration-200 ${
                                          isSelected
                                            ? "text-blue-600"
                                            : "text-gray-700"
                                        } group-hover:text-blue-500`}
                                      />
                                      <span
                                        className={`transition-all duration-200 ${
                                          isSelected
                                            ? "text-blue-600 font-medium"
                                            : "text-gray-700"
                                        } group-hover:text-blue-500 group-hover:scale-105`}
                                      >
                                        {category.name}
                                      </span>
                                    </span>
                                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                  </div>
                                </CollapsibleTrigger>
                              </div>
                              <CollapsibleContent>
                                <div className="pl-8 pr-2 pb-2 space-y-1">
                                  {category.subcategories.map((subcategory) => {
                                    const isSubSelected =
                                      selectedCategories.includes(subcategory);
                                    return (
                                      <div
                                        key={subcategory}
                                        className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                                      >
                                        <Checkbox
                                          id={`subcat-${subcategory}`}
                                          checked={isSubSelected}
                                          onCheckedChange={() =>
                                            handleCategoryToggle(subcategory)
                                          }
                                        />
                                        <span
                                          className={`transition-all duration-200 ${
                                            isSubSelected
                                              ? "text-blue-600 font-medium"
                                              : "text-gray-700"
                                          } hover:text-blue-500`}
                                        >
                                          {subcategory}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </CollapsibleContent>
                            </>
                          ) : (
                            <div className="flex items-center gap-2 px-2 py-1 cursor-pointer group">
                              <Checkbox
                                id={`cat-${category.name}`}
                                checked={isSelected}
                                onCheckedChange={() =>
                                  handleCategoryToggle(category.name)
                                }
                              />
                              <Icon
                                className={`h-4 w-4 transition-colors duration-200 ${
                                  isSelected ? "text-blue-600" : "text-gray-700"
                                } group-hover:text-blue-500`}
                              />
                              <span
                                className={`transition-all duration-200 ${
                                  isSelected
                                    ? "text-blue-600 font-medium"
                                    : "text-gray-700"
                                } group-hover:text-blue-500 group-hover:scale-105`}
                              >
                                {category.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </Collapsible>
                    );
                  })}
                </div>

                <div className="pt-4 pb-2">
                  <h3 className="text-sm font-semibold mb-3">
                    FILTER BY PRICE
                  </h3>

                  <Range
                    step={5000}
                    min={500}
                    max={500000}
                    values={[tempMin, tempMax]} // use temp values here
                    onChange={(values) => {
                      setTempMin(values[0]);
                      setTempMax(values[1]);
                    }}
                    renderTrack={({ props, children }) => {
                      // eslint-disable-next-line
                      const { key, ...restProps } = props as any; // separate key
                      return (
                        <div
                          key={key}
                          {...restProps}
                          className="relative w-44 ml-2 h-1 rounded bg-gray-200"
                          style={{ ...restProps.style }}
                        >
                          <div
                            className="absolute h-1 rounded bg-blue-600"
                            style={{
                              left: `${
                                ((tempMin - 500) / (500000 - 500)) * 100
                              }%`,
                              width: `${
                                ((tempMax - tempMin) / (500000 - 500)) * 100
                              }%`,
                            }}
                          />
                          {children}
                        </div>
                      );
                    }}
                    renderThumb={({ props }) => {
                      // eslint-disable-next-line
                      const { key, ...restProps } = props as any; // separate key
                      return (
                        <div
                          key={key}
                          {...restProps}
                          className="w-3 h-3 bg-blue-600 rounded-full shadow-md"
                        />
                      );
                    }}
                  />
                  <div className="flex flex-col items-center mt-3">
                    <div className="flex gap-2 items-center w-full justify-center">
                      <span className="text-sm text-gray-600 font-medium">
                        ₦
                      </span>
                      <input
                        type="text"
                        value={`${tempMin} - ${tempMax}`}
                        onChange={(e) => {
                          const [min, max] = e.target.value
                            .split("-")
                            .map((s) => Number(s.trim()));
                          if (!isNaN(min)) setTempMin(min);
                          if (!isNaN(max)) setTempMax(max);
                        }}
                        className="w-44 text-center bg-gray-100 border-blue-300 border rounded-full px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Min ₦ — Max ₦"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={applyFilters} // commits temp values to parent
                      className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded flex items-center gap-2 transition-transform duration-200 hover:scale-105"
                    >
                      Filter
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Showing products between ₦{tempMin.toLocaleString()} and ₦
                    {tempMax.toLocaleString()}
                  </p>
                </div>

                {/* product status start */}
                <div className="pt-2 pb-2">
                  <div className="text-lg font-semibold text-gray-700 mb-1">
                    Product Status
                  </div>
                  <div className="px-3 py-2 space-y-3">
                    {statuses.map((status) => {
                      const isStatusSelected = selectedStatuses.includes(
                        status.value
                      );
                      return (
                        <div
                          key={status.value}
                          className="flex items-center space-x-2 cursor-pointer hover:scale-110 transition-transform duration-200"
                        >
                          <Checkbox
                            id={status.value}
                            checked={isStatusSelected}
                            onCheckedChange={() =>
                              handleStatusToggle(status.value)
                            }
                          />
                          <Label
                            htmlFor={status.value}
                            className={` text-sm transition-all duration-200 ${
                              isStatusSelected
                                ? "text-blue-600 font-medium"
                                : "text-gray-700"
                            } hover:text-blue-500`}
                          >
                            {status.name}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* product status end */}

                <div className="pt-2 pb-8">
                  <div className="text-lg font-semibold text-gray-700 mb-1">
                    Brands
                  </div>
                  <div className="px-3 py-2 space-y-3">
                    {brandCounts &&
                      Object.entries(brandCounts ?? {}).map(
                        ([brand, count]) => {
                          const countNumber = count as number;
                          const isBrandSelected =
                            selectedBrands.includes(brand);
                          return (
                            <div
                              key={brand}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-2 cursor-pointer hover:scale-110 transition-transform duration-200">
                                <Checkbox
                                  id={brand}
                                  checked={isBrandSelected}
                                  onCheckedChange={() =>
                                    handleBrandToggle(brand)
                                  }
                                />
                                <Label
                                  htmlFor={brand}
                                  className={`text-sm transition-all duration-200 ${
                                    isBrandSelected
                                      ? "text-blue-600 font-medium"
                                      : "text-gray-700"
                                  } hover:text-blue-500`}
                                >
                                  {brand}
                                </Label>
                              </div>
                              <span className="ml-2 text-sm bg-blue-300 text-[#046295] rounded-sm px-2">
                                {countNumber}
                              </span>
                            </div>
                          );
                        }
                      )}
                  </div>
                </div>
              </TabsContent>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

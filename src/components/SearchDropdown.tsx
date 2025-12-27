"use client";
import Image from "next/image";
import { useSearch } from "@/contexts/SearchContext";

export default function SearchDropdown({
  onStoreClick,
  onItemClick,
}: {
  onStoreClick?: (storeName: string) => void;
  onItemClick?: (item: string) => void;
}) {
  const { storeResults, itemResults, searchTerm, loading } = useSearch();
  const hasResults = storeResults.length > 0 || itemResults.length > 0;

  if (!searchTerm.trim() || (!hasResults && !loading)) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-2 bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl z-50 overflow-hidden animate-fadeIn">
      {loading && (
        <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
      )}

      {storeResults.length > 0 && (
        <div className="border-b border-gray-100">
          <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Stores
          </div>
          {storeResults.map((store) => (
            <div
              key={`${store.name}-${store.flyerCount}`}
              className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onStoreClick?.(store.name)}
            >
              <div>
                <div className="font-medium text-gray-800">{store.name}</div>
                <div className="text-xs text-gray-500">
                  {store.flyerCount} Circular{store.flyerCount > 1 ? "s" : ""}{" "}
                  Available
                </div>
              </div>
              {store.logo && (
                <Image
                  src={store.logo}
                  alt={`${store.name} logo`}
                  width={32}
                  height={32}
                  className="object-contain rounded-md"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {itemResults.length > 0 && (
        <div className="pb-2">
          <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Items
          </div>
          {itemResults.map((item) => (
            <div
              key={item}
              className="px-4 py-2 hover:bg-gray-50 text-gray-800 text-sm transition-colors cursor-pointer"
              onClick={() => onItemClick?.(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

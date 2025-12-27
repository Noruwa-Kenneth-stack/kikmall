import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Store } from "@/types/store";

interface StoreCardProps {
  store: Store;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  size?: "small" | "large";
}

const StoreCard: React.FC<StoreCardProps> = ({
  store,
  isFavorite = false,
  onToggleFavorite,
  size = "large",
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // ✅ Prevent navigation
    if (onToggleFavorite) {
      onToggleFavorite(store.id);
    }
  };

  const isSmall = size === "small";

  return (
    <Card className="overflow-hidden bg-white rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer border-0 group">
      <CardContent className="p-3 relative">
        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/80 hover:bg-white transition-all duration-200 
                 opacity-0 group-hover:opacity-100"
        >
          <Heart
            className={`${isSmall ? "w-3 h-3" : "w-4 h-4"} transition-colors ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>

        {/* Card Content inside Link */}
        <Link
          href={`/flyers/${store.id}?location=${encodeURIComponent(
            store.city ?? ""
          )}`}
          className="block"
        >
          <Image
            src={store.imageUrl || store.logo || "/icons/default.png"}
            alt={store.storeName || "Store image"}
            width={400}
            height={isSmall ? 128 : 192}
            className={`w-full object-cover ${isSmall ? "h-32" : "h-48"}`}
            style={{ objectFit: "cover" }}
          />
          <div
            className={`${isSmall ? "p-2" : "p-3"} border-t border-gray-200`}
          >
            <div className="flex items-center space-x-2">
              <div className="bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={store.logo || "/icons/default.png"}
                  alt={`${store.storeName} logo`}
                  width={isSmall ? 24 : 32}
                  height={isSmall ? 24 : 32}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  className={`font-medium ${
                    isSmall ? "text-xs" : "text-sm"
                  } truncate`}
                >
                  {store.storeName}
                </h3>
                <p
                  className={`${isSmall ? "text-xs" : "text-xs"} text-gray-500`}
                >
                  {store.featured ? store.status : ""}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default StoreCard;

// FlyersHeader.tsx
"use client";

import React from "react";
import { Button } from "./ui/button";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { Input } from "./ui/input";
import Link from "next/link";
import LocationDropdown from "./LocationDropdown";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { useSearch } from "@/contexts/SearchContext";
import SearchDropdown from "./SearchDropdown";
import { useRouter } from "next/navigation";
import { useCity } from "@/contexts/CityContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

interface FlyerHeaderProps {
  onToggleSidebar: () => void;
}

const FlyerHeader: React.FC<FlyerHeaderProps> = ({ onToggleSidebar }) => {
  const { searchTerm, setSearchTerm } = useSearch();
  const { itemCount } = useShoppingList();
  const router = useRouter();
  const { city } = useCity();
  const { user, isAuthenticated, logout, isLoading } = useAuth(); // Use auth hook

const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 h-16"></div>
    ); // Loading skeleton
  }

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        {/* Desktop Search */}
        <div className="relative flex-1 max-w-md mx-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search stores or items"
            className="pl-9 pr-4 w-full rounded-full border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchDropdown
            onStoreClick={(name) => {
              router.push(`/stores/${encodeURIComponent(name)}`);
            }}
            onItemClick={(item) => {
              router.push(
                `/stores/${encodeURIComponent(item)}?term=${encodeURIComponent(
                  item
                )}&city=${encodeURIComponent(city)}`
              );
            }}
          />
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          {/* Location Button - Desktop */}
          <div className="hidden md:block">
            <LocationDropdown />
          </div>

          <Link
            href="/shoppinglist"
            className="flex items-center text-gray-600 hover:text-blue-500 transition relative"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-5 -right-2 w-5 h-5 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="ml-2 hidden md:inline">Shopping List</span>
          </Link>

          {/* Conditional Auth UI */}
          {isAuthenticated && user ? (
            // Authenticated: Show user details and Sign out (as in image)
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-300 ">
                  <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center">
                    {user.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.name || user.email}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.name || user.email}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-64 p-2 shadow-lg rounded-lg border bg-white cursor-pointer"
              >
                <div className="px-3 py-2 flex items-center gap-3">
                  <div className="text-sm font-medium text-gray-900 w-12">
                    Name
                  </div>
                  <div className="text-sm text-gray-600">{user.name}</div>
                </div>
                {/* Visible Separator */}
                <DropdownMenuSeparator className="my-1 h-px bg-gray-200" />
                <div className="px-3 py-2 flex items-center gap-3">
                  <div className="text-sm font-medium text-gray-900 w-12">
                    Email
                  </div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
                {/* Visible Separator */}
                <DropdownMenuSeparator className="my-1 h-px bg-gray-200" />

                <DropdownMenuItem
                  onClick={() => router.push("/ChangePassword")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer justify-center"
                >
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer justify-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Unauthenticated: Show SignIn link
            <Link
              href="/SignIn"
              className="hidden md:flex items-center text-gray-600 hover:text-blue-500 transition"
            >
              <User className="h-5 w-5 text-blue-500" />
              <span className="ml-2 text-blue-500">SignIn</span>
            </Link>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="p-2"
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-7 w-7 text-gray-900" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlyerHeader;

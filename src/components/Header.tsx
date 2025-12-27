"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearch } from "@/contexts/SearchContext";
import SearchDropdown from "./SearchDropdown";
import { Search, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Header = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // a small function to toggle the mobile menu open or close
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo/Logo.png"
                alt="KIKHUB Logo"
                width={120} // adjust size
                height={120}
                className="object-contain"
              />
            </Link>
          </div>
          {/* desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/flyers"
              className="text-gray-600 hover:text-blue-500 font-medium  transition-colors duration-300"
            >
              Flyers
            </Link>
            <Link
              href="/shoppinglist"
              className="text-gray-600 hover:text-blue-500 font-medium  transition-colors duration-300"
            >
              Shopping List
            </Link>
            <div className="flex items-center flex-1 max-w-md mx-4 relative">
              <Search className="absolute left-3 top-2.2 h-4 w-4 text-gray-400 hover:text-blue-500" />
              <input
                type="search"
                placeholder="Search stores or items"
                className="pl-9 pr-4 py-2 w-full rounded-full border border-gray-100 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-autocomplete="list"
                aria-controls="search-results"
              />
              <SearchDropdown
                onStoreClick={(name) => {
                  router.push(`/stores/${encodeURIComponent(name)}`);
                }}
                onItemClick={(item) => {
                  router.push(`/items/${encodeURIComponent(item)}`);
                }}
              />
            </div>
          </nav>

          {/* Desktop Right Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/about"
              className="text-gray-600 hover:text-blue-500 font-medium  transition-colors duration-300"
            >
              About kik
            </Link>
            <Link
              href="/blog"
              className="text-gray-600 hover:text-blue-500 font-medium  transition-colors duration-300"
            >
              Blog
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="P-2 text-gray-500 hover:text-blue-500 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-grey-600" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu   */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-96 opacity-100 pb-4"
              : "max-h-0 opacity-0 pb-0"
          }`}
        >
          <div className="pt-4 border-t border-gray-200 space-y-4">
            <nav>
              <div className="flex items-center flex-1 max-w-md mx-4 relative">
                <Search className="absolute left-1 top-2.2 h-4 w-4 text-gray-400 hover:text-blue-500" />
                <input
                  type="search"
                  placeholder="Search stores or items"
                  className="pl-5 pr-4 w-64 py-2 rounded-full border border-gray-100 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-autocomplete="list"
                  aria-controls="search-results"
                />
                <SearchDropdown
                  onStoreClick={(name) => {
                    router.push(`/stores/${encodeURIComponent(name)}`);
                  }}
                  onItemClick={(item) => {
                    router.push(`/items/${encodeURIComponent(item)}`);
                  }}
                />
              </div>

              <div>
                <ul>
                  <li className="py-2 px-3">
                    <Link
                      href="/flyers"
                      className="text-gray-600 hover:text-blue-500 font-medium  transition-colors duration-300"
                    >
                      Flyers
                    </Link>
                  </li>
                  <li className="py-2 px-3">
                    <Link
                      href="/shopping-list"
                      className="text-gray-600 hover:text-blue-500 font-medium  transition-colors duration-300"
                    >
                      Shopping List
                    </Link>
                  </li>
                  <li className="py-2 px-3">
                    <Link
                      href="/about"
                      className="text-gray-600 hover:text-blue-500 font-medium  transition-colors duration-300"
                    >
                      About us
                    </Link>
                  </li>
                  <li className="py-2 px-3">
                    <Link
                      href="/blog"
                      className="text-gray-600 hover:text-blue-500 font-medium  transition-colors duration-300"
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;

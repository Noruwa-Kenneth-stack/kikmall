"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useCity } from "@/contexts/CityContext"; // 👈 import the CityContext hook

interface StoreResult {
  id: number;
  name: string;
  logo: string;
  city: string;
  flyerCount: number;
}

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  storeResults: StoreResult[];
  itemResults: string[];
  loading: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [storeResults, setStoreResults] = useState<StoreResult[]>([]);
  const [itemResults, setItemResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { city } = useCity(); // 👈 grab the current city

  useEffect(() => {
    if (!searchTerm.trim()) {
      setStoreResults([]);
      setItemResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(searchTerm)}&city=${encodeURIComponent(city || "")}` // 👈 include city param
        );
        const data = await res.json();
        setStoreResults(data.stores || []);
        setItemResults(data.items || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, city]); // 👈 rerun when city changes

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, storeResults, itemResults, loading }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
};

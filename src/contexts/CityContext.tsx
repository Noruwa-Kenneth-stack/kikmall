"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

interface CityContextType {
  city: string;
  setCity: (city: string) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [city, setCityState] = useState("");
  const router = useRouter();

  // ✅ SAFE: no useSearchParams
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const queryCity = params.get("city");
    const savedCity = localStorage.getItem("city");

    if (queryCity) {
      setCityState(queryCity);
      localStorage.setItem("city", queryCity);
    } else if (savedCity) {
      setCityState(savedCity);
    }
  }, []);

  const setCity = (newCity: string) => {
    setCityState(newCity);
    localStorage.setItem("city", newCity);

    const params = new URLSearchParams(window.location.search);
    params.set("city", newCity);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <CityContext.Provider value={{ city, setCity }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error("useCity must be used within CityProvider");
  }
  return context;
};

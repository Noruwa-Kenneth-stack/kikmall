"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CityContextType {
  city: string;
  setCity: (city: string) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [city, setCityState] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

useEffect(() => {
  const savedCity = localStorage.getItem("city");
  const queryCity = searchParams.get("city"); // 👈 changed from 'location' to 'city'
  if (queryCity) {
    setCityState(queryCity);
    localStorage.setItem("city", queryCity);
  } else if (savedCity) {
    setCityState(savedCity);
  }
}, [searchParams]);

const setCity = (newCity: string) => {
  setCityState(newCity);
  localStorage.setItem("city", newCity);

  const params = new URLSearchParams(window.location.search);
  params.set("city", newCity); // 👈 also changed
  router.push(`?${params.toString()}`);
};


  return <CityContext.Provider value={{ city, setCity }}>{children}</CityContext.Provider>;
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) throw new Error("useCity must be used within CityProvider");
  return context;
};

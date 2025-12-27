"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface FlyerContextType {
  city: string;
  setCity: (city: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const FlyerContext = createContext<FlyerContextType | undefined>(undefined);

export const FlyerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [city, setCityState] = useState<string>("Ikeja"); // default Ikeja
  const [selectedCategory, setSelectedCategory] = useState<string>("All Circulars");
  const [activeSection, setActiveSection] = useState<string>("weekly");

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const savedCity = localStorage.getItem("flyerCity");
    if (savedCity) setCityState(savedCity);
  }, []);

  // ✅ Persist to localStorage
  useEffect(() => {
    if (city) localStorage.setItem("flyerCity", city);
  }, [city]);

  const setCity = (newCity: string) => {
    setCityState(newCity);
    // query param sync (optional – depends on how router is used)
    const url = new URL(window.location.href);
    url.searchParams.set("location", newCity);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <FlyerContext.Provider
      value={{
        city,
        setCity,
        selectedCategory,
        setSelectedCategory,
        activeSection,
        setActiveSection,
      }}
    >
      {children}
    </FlyerContext.Provider>
  );
};

export const useFlyerContext = () => {
  const ctx = useContext(FlyerContext);
  if (!ctx) throw new Error("useFlyerContext must be used within FlyerProvider");
  return ctx;
};

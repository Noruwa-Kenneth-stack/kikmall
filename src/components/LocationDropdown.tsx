"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { useCity } from "@/contexts/CityContext";

const LocationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState("");
  const { city, setCity } = useCity();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function resolveArea(input: string) {
    if (input.toLowerCase() === "ikeja") return [{ city: "Ikeja" }];
    if (input.toLowerCase() === "ojo") return [{ city: "Ojo" }];
    return [];
  }

  const handleFindCirculars = () => {
    const trimmedInput = location.trim();
    const areas = resolveArea(trimmedInput);
    if (areas.length > 0) {
      const newCity = areas[0].city;
      setCity(newCity); // ✅ update global city
    } else {
      console.warn("No matching area found for:", trimmedInput);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative z-100" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-600 hover:text-blue-500 transition px-3 py-2"
      >
        <MapPin className="w-5 h-5 mr-1" />
        <span className="text-md">{city || "Location"}</span>
        <ChevronDown
          className={`w-5 h-5 ml-1 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-3">
              Enter your city/area (e.g., Ikeja, Ojo) to find circulars near
              you.
            </p>
            <input
              type="text"
              placeholder="Enter city or area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleFindCirculars}
              className="w-full bg-blue-500 text-white text-sm py-2 rounded-md hover:bg-blue-600"
            >
              Find Circulars
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;

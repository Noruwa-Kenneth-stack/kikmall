"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Postalcodeimageslider from "@/components/Postalcodeimageslider";
import { useCity } from "@/contexts/CityContext";
import { useRouter } from "next/navigation";

// Define Lagos areas with center lat/lon
const LAGOS_AREAS = [
  { name: "Ojo", lat: 6.49, lon: 3.19 },
  { name: "Ikeja", lat: 6.6, lon: 3.35 },
  { name: "Surulere", lat: 6.5, lon: 3.37 },
  { name: "Yaba", lat: 6.51, lon: 3.37 },
  { name: "Apapa", lat: 6.45, lon: 3.34 },
  { name: "Volks", lat: 6.4595, lon: 3.2132 },
];

// Haversine formula to compute distance (km)
function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
}

const Postalcode = () => {
  const { city, setCity } = useCity();
  const [error, setError] = useState("");
  const [isManualInput, setIsManualInput] = useState(false); // Track manual input
  const [hasFetchedLocation, setHasFetchedLocation] = useState(false); // Track if geolocation ran
  const router = useRouter();

  // Run geolocation only once on mount
  useEffect(() => {
    if (hasFetchedLocation || isManualInput) return; // Skip if already fetched or manual input

    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      setHasFetchedLocation(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Check if coords are close to a Lagos area center (increased threshold to 5km)
      const match = LAGOS_AREAS.reduce<{ area: { name: string; lat: number; lon: number } | null; dist: number }>(
  (closest, area) => {
    const dist = haversine(latitude, longitude, area.lat, area.lon);
    if (!closest.area || dist < closest.dist) {
      return { area, dist };
    }
    return closest;
  },
  { area: null, dist: Infinity }
).area;


        if (match) {
          setCity(match.name);
          setHasFetchedLocation(true);
          return;
        }

        // Fallback to Nominatim reverse geocoding
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const address = data?.address || {};
          const detectedLocation =
            address.local_government_area ||
            address.suburb ||
            address.neighbourhood ||
            address.district ||
            address.city ||
            address.state ||
            "";
          if (detectedLocation && !isManualInput) {
            // Map Nominatim result to LAGOS_AREAS if possible
            const matchedArea = LAGOS_AREAS.find((area) =>
              detectedLocation.toLowerCase().includes(area.name.toLowerCase())
            );
            setCity(matchedArea ? matchedArea.name : detectedLocation);
          } else {
            setError("Could not detect your area. Please enter manually.");
          }
          setHasFetchedLocation(true);
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
          setError("Unable to look up your location. Please enter manually.");
          setHasFetchedLocation(true);
        }
      },
      (err) => {
        console.warn("Location denied or unavailable:", err);
        setError("Location access denied. Please enter your area.");
        setHasFetchedLocation(true);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, [setCity, isManualInput, hasFetchedLocation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsManualInput(true); // Mark as manual input
    setCity(e.target.value); // Update city state
  };

  const handleStartSaving = () => {
    if (!city) {
      setError("Please enter a city or area.");
      return;
    }
    setCity(city); // Save globally
    router.push(`/flyers?city=${encodeURIComponent(city)}`);
  };

  // Optional: Allow retrying geolocation
  const handleRetryGeolocation = () => {
    setIsManualInput(false);
    setHasFetchedLocation(false);
    setError("");
    setCity("");
  };

  return (
    <section
      className="relative bg-teal-700 text-white py-4"
      style={{
        backgroundImage:
          "url('/patterns/white-doodle-vegetables-fruits-isolated-blackboard-seamless-pattern.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-teal-700/90" />
      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side */}
          <div className="space-y-8">
            <h1 className="text-3xl lg:text-4xl font-light leading-tight text-center lg:text-left">
              Shop smarter with us on Kik and save 25% weekly on groceries and
              other items.
            </h1>
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-white">
                <MapPin className="h-5 w-5 animate-bounce text-yellow-400" />
                <span>
                  Type your Area or City below{" "}
                  <span className="text-yellow-400 font-semibold">
                    to see the latest deals near you.
                  </span>
                </span>
              </label>

              <div className="relative flex gap-3 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto lg:mx-0">
                <Input
                  value={city}
                  onChange={handleInputChange}
                  placeholder="e.g., Ikeja, Alaba or Oshodi"
                  className="text-base sm:text-lg md:text-xl font-semibold placeholder:text-sm sm:placeholder:text-base md:placeholder:text-lg h-10 sm:h-12 px-3 sm:px-4 
                    focus:ring-2 text-teal-900 focus:outline-none border border-white rounded-md w-full pr-24"
                />
                <Button
                  onClick={handleStartSaving}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 sm:h-9 px-3 sm:px-4  bg-teal-700 text-white hover:bg-teal-800 font-semibold rounded-md"
                >
                  Start Saving
                </Button>
              </div>
              {error && <p className="mt-2 text-sm text-white">{error}</p>}
              <Button
                onClick={handleRetryGeolocation}
                className="mt-2 bg-transparent border border-white text-white hover:bg-white hover:text-teal-700 rounded-md"
              >
                Retry Geolocation
              </Button>
            </div>
          </div>

          {/* Right side */}
          <div className="relative flex justify-center lg:justify-end">
            <Postalcodeimageslider />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Postalcode;
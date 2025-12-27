"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { MapPin, Search, Filter } from "lucide-react";
import { useCity } from "@/contexts/CityContext";
import { Store } from "@/types/store";
import Footerheader from "@/components/Footer-header";
import Footer from "@/components/Footer";

import dynamic from "next/dynamic";
const StoreLocatorMap = dynamic(() => import("@/components/StoreLocatorMap"), {
  ssr: false,
});

export default function StoreLocatorPage() {
  const { city: selectedCity } = useCity();
  const [city, setCity] = useState<string>("");
  const [search, setSearch] = useState("");
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLon, setUserLon] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  /* ------------------------------- LOAD CITY ------------------------------- */
  useEffect(() => {
    if (selectedCity) setCity(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLon(pos.coords.longitude);
      },
      (err) => console.warn("Geolocation error:", err),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  /* ------------------------------- FETCH STORES ------------------------------- */
  useEffect(() => {
    async function fetchStores() {
      if (!city) {
        console.log("No city selected yet");
        return;
      }

      console.log("FETCHING STORES FOR CITY:", city);
      console.log("USER LOCATION:", userLat, userLon);

      setLoading(true);

      const params = new URLSearchParams();
      params.set("city", city);
      if (userLat && userLon) {
        params.set("lat", String(userLat));
        params.set("lon", String(userLon));
      }
      params.set("limit", "200");

      try {
        const res = await fetch(`/api/stores?${params.toString()}`);
        const data = await res.json();

        console.log("RAW API RESPONSE:", data); // DEBUG 1
        console.log("data.stores type:", Array.isArray(data.stores)); // DEBUG 2

        const rawStores = data.stores ?? [];

        if (!Array.isArray(rawStores)) {
          console.error("data.stores is not an array!", rawStores);
          setStores([]);
          setLoading(false);
          return;
        }

        // BULLETPROOF NORMALIZATION
        const normalized: Store[] = rawStores.map((s) => {
          const item = s as {
            id: number;
            storeName?: string;
            store_name?: string;
            logo?: string | null;
            city?: string | null;
            address?: string | null;
            opening_hours?: string | null;
            categories?: string[] | null;
            lat?: number | null;
            lon?: number | null;
            distance_km?: number | null;
          };

          return {
            id: item.id,
            store_name: item.store_name ?? item.storeName ?? "",

            logo: item.logo ?? null,
            city: item.city ?? null,
            address: item.address ?? null,
            opening_hours: item.opening_hours ?? null,

            categories: Array.isArray(item.categories) ? item.categories : [],

            lat: item.lat ?? null,
            lon: item.lon ?? null,
            distance_km: item.distance_km ?? null,
          };
        });

        setStores(normalized);
      } catch (err) {
        console.error("Fetch failed:", err);
        alert("Failed to fetch stores. Check console.");
      } finally {
        setLoading(false);
      }
    }

    fetchStores();
  }, [city, userLat, userLon]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    stores.forEach((store) => {
      (store.categories || []).forEach((c) => set.add(c));
    });
    return Array.from(set).sort();
  }, [stores]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredStores = useMemo(() => {
    const result = stores
      .filter((store) => {
        if (!store.store_name || store.store_name === "Unknown Store")
          return false;
        if (
          search &&
          !store.store_name.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (selectedCategories.length > 0) {
          if (!store.categories.some((c) => selectedCategories.includes(c)))
            return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.distance_km != null && b.distance_km != null)
          return a.distance_km - b.distance_km;
        return a.store_name.localeCompare(b.store_name);
      });

    console.log("FILTERED STORES (visible on screen):", result.length); // DEBUG 5
    return result;
  }, [stores, search, selectedCategories]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-[#031b34]/90 border-b border-white/10 sticky top-0 z-300">
        <Footerheader />
      </header>

      {/* HERO */}
      <section className="relative h-[50vh] flex items-center">
        <Image
          src="/08/Hero-Mock-scaled.jpg"
          alt="Store locator hero"
          fill
          className="object-cover brightness-[0.45]"
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Find stores near you
          </h1>
          <p className="max-w-md text-gray-200 text-lg mb-6">
            Discover stores in your area and explore their weekly circulars,
            deals and promotions.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search for a store..."
                className="w-full px-4 py-3 pr-10 rounded-full bg-white/20 backdrop-blur-md text-white placeholder:text-gray-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white" />
            </div>
          </div>

          {city && (
            <p className="mt-3 text-sm text-gray-200">
              Showing stores in <span className="font-semibold">{city}</span>
            </p>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-8xl  px-6 py-12">
        {/* GRID: left panel + right map */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-2">
          {/* LEFT PANEL: scrollable */}
          <aside className="bg-white rounded-xl shadow-md border h-[75vh] overflow-y-auto p-4">
            {/* FILTERS */}
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-cyan-600" />
              <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                Filters
              </h2>
            </div>

            <p className="text-sm font-medium text-gray-700 mb-2">Categories</p>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 mb-6">
              {allCategories.map((cat) => {
                const active = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-full border 
                ${
                  active
                    ? "bg-cyan-50 border-cyan-500 text-cyan-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* STORES HEADER */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">
                {loading ? "Loading stores..." : "Available Stores"}
              </h2>
              <span className="text-sm text-gray-500">
                {filteredStores.length} store
                {filteredStores.length !== 1 ? "s" : ""} found
              </span>
            </div>

            {/* STORE LIST - FIXED TO SINGLE COLUMN */}
            {filteredStores.length === 0 && !loading ? (
              <p className="text-gray-500">No stores found.</p>
            ) : (
              <ul className="space-y-4">
                {filteredStores.map((store) => (
                  <li
                    key={store.id}
                    className="bg-white rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition cursor-pointer p-5 flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-full bg-cyan-50 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-cyan-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-gray-800">
                          {store.store_name}
                        </h3>
                        <p className="text-xs text-orange-500">{store.city}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {store.address || "Address not available"}
                    </p>

                    {store.distance_km != null && (
                      <p className="text-xs text-gray-500 mb-2">
                        ~ {store.distance_km.toFixed(1)} km away
                      </p>
                    )}

                    {store.opening_hours && (
                      <p className="text-xs text-gray-600 mb-3">
                        <span className="font-semibold">Hours:</span>{" "}
                        {store.opening_hours}
                      </p>
                    )}

                    <div className="mt-auto pt-2">
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => setSelectedStore(store)}
                          className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-full hover:bg-orange-600"
                        >
                          View on Map
                        </button>

                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lon}`}
                          target="_blank"
                          className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-full hover:bg-orange-600"
                        >
                          Directions
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* RIGHT SIDE: MAP */}
          {userLat && userLon && filteredStores.length > 0 && (
            <div className="rounded-xl overflow-hidden shadow h-[75vh] z-10">
              <StoreLocatorMap
                stores={filteredStores}
                userLat={userLat}
                userLon={userLon}
                selectedStore={selectedStore}
                setSelectedStore={setSelectedStore}
              />
            </div>
          )}
        </div>
      </section>
      {/* === Footer === */}
      <Footer />
    </div>
  );
}

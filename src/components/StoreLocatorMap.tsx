"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Store } from "@/types/store";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// -----------------------------
// FIX Leaflet default icon issue
// -----------------------------
const defaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// -----------------------------
// FlyToStore Component
// -----------------------------
function FlyToStore({ selectedStore }: { selectedStore: Store | null }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedStore) return;

    if (selectedStore.lat && selectedStore.lon) {
      map.flyTo([selectedStore.lat, selectedStore.lon], 16, {
        duration: 1.3,
      });
    }
  }, [selectedStore, map]);

  return null;
}

// -----------------------------
// MAIN MAP COMPONENT
// -----------------------------
export default function StoreLocatorMap({
  stores,
  userLat,
  userLon,
  selectedStore,
  setSelectedStore,
}: {
  stores: Store[];
  userLat: number;
  userLon: number;
  selectedStore: Store | null;
  setSelectedStore: (store: Store | null) => void;
}) {
  // -----------------------------
  // Marker refs for auto-opening popup
  // -----------------------------
  const markerRefs = useRef<Record<number, L.Marker>>({});

  useEffect(() => {
    if (!selectedStore) return;

    const m = markerRefs.current[selectedStore.id];
    if (m) {
      setTimeout(() => {
        m.openPopup();
      }, 300); // delay ensures map moved first
    }
  }, [selectedStore]);

  // Required for Next.js SSR
  if (typeof window === "undefined") return null;

  return (
    <MapContainer
      center={
        selectedStore && selectedStore.lat && selectedStore.lon
          ? [selectedStore.lat, selectedStore.lon]
          : [userLat, userLon]
      }
      zoom={selectedStore ? 16 : 13}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Auto-fly when selected store changes */}
      <FlyToStore selectedStore={selectedStore} />

      {/* Map tiles */}
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Markers */}
      {stores.map((store) =>
        store.lat && store.lon ? (
          <Marker
            key={store.id}
            position={[store.lat, store.lon]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => setSelectedStore(store),
            }}
            ref={(ref) => {
              if (ref) markerRefs.current[store.id] = ref;
            }}
          >
            <Popup>
              <strong className="text-base">{store.store_name}</strong>
              <br />
              <span className="text-sm">{store.address}</span>
              <br />
              {store.distance_km &&
                `~${store.distance_km.toFixed(1)} km away`}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}

export interface Store {
  id: number;

  // names from API
  store_name: string;  
  storeName?: string;

  // optional fields (API does not return these)
  imageUrl?: string | null;
  status?: string | null;
  created_at?: string | null;
  featured?: boolean | null;
  logo: string | null;
  city: string | null;
  categories: string[];
  opening_hours: string | null;
  address: string | null;

  // location (from PostGIS)
  lat: number | null;
  lon: number | null;

  // computed by API
  distance_km: number | null;
  
}

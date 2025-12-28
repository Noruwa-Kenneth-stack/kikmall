// /types/flyerProduct.ts
export interface FlyerProduct {
  id: number;
  store_id: number;
  name: string;
  price: number;
  discounted_price?: number | null;
  product_status?: "In Stock" | "Out Of Stock" | "New"  | "Hot";
  item_id?: number;
  image: string;
  sku?: string;
  brands?: string[];
  brand?: string;
  weight?: string[];
  image_thumbnails?: string[];
  compare_key?: string;
  compareKey: string;
  category?: string;
  subcategory?: string;
  offer_start_date?: string | null;   // ISO string, e.g. "2025-11-08T00:00:00Z"
  offer_end_date?:   string | null;   // ISO string, e.g. "2025-11-08T00:00:00Z"
  short_description?: string;
  long_description?: string;
  created_at?: string;
  rating?: number;
  maincategory?: string;
  isPlaceholder?: boolean;

   // 🏪 Joined from stores table
  store_name: string;
  store_logo?: string;
  city: string;
}

export type Product = FlyerProduct;
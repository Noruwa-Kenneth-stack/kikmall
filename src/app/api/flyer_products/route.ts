// app/api/flyer-products/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get("store_id");
  const storeName = searchParams.get("store");
  const city = searchParams.get("city");

  try {
    let sql = `
      SELECT 
        fp.*,
        s.store_name,
        s.logo,
        s.city
      FROM flyer_products fp
      JOIN stores s ON s.id = fp.store_id
    `;

    const params: (string | number)[] = [];
    const conditions: string[] = [];

    // ✅ Handle store_id (old working logic)
    if (storeId) {
      conditions.push(`fp.store_id = $${params.length + 1}`);
      params.push(storeId);
    }

    // ✅ Allow fetching by store name (from search dropdown)
    if (storeName) {
      conditions.push(`LOWER(s.store_name) = LOWER($${params.length + 1})`);
      params.push(storeName);
    }

    // ✅ Optional city match (for location context)
    if (city) {
      conditions.push(`LOWER(s.city) = LOWER($${params.length + 1})`);
      params.push(city);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += " ORDER BY fp.id ASC";

    const res = await query(sql, params);

    type FlyerProductRow = {
      id?: number;
      store_id?: number;
      price?: number | string | null;
      discounted_price?: number | string | null;
      brand?: string | null;
      category?: string | null;
      store_name?: string | null;
      logo?: string | null;
      city?: string | null;
      [key: string]: unknown;
    };

    const rows = res.rows as FlyerProductRow[];

    const products = rows.map((p) => ({
      ...p,
      price: p.price != null ? Number(String(p.price)) : null,
      discounted_price:
        p.discounted_price != null ? Number(String(p.discounted_price)) : null,
      brand: (p.brand as string) || "Unknown",
      category: (p.category as string) || null,
    }));

    // ✅ Group products safely (no empty arrays breaking things)
    const circulars = products.filter((p) =>
      ["groceries", "electronics"].includes((p.category || "").toLowerCase())
    );
    const items = products.filter(
      (p) => !["groceries", "electronics"].includes((p.category || "").toLowerCase())
    );

    // If categories are missing, just send everything as circulars (for backward compatibility)
    if (!circulars.length && !items.length && products.length) {
      return NextResponse.json({ circulars: products, items: [] });
    }

    return NextResponse.json({ circulars, items });
  } catch (error) {
    console.error("❌ Error fetching flyer products:", error);
    return NextResponse.json(
      { error: "Failed to fetch flyer products" },
      { status: 500 }
    );
  }
}

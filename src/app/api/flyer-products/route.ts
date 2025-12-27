
//  src/app/api/flyer-products/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get("store_id");

  try {
    let sql = "SELECT * FROM flyer_products";
    const params: string[] = [];

    if (storeId) {
      sql += " WHERE store_id = $1";
      params.push(storeId);
    }

    sql += " ORDER BY id ASC";

    const res = await query(sql, params);

    // 🧹 Convert numeric strings to numbers
    const products = res.rows.map((p) => ({
      ...p,
      price: p.price ? Number(p.price) : null,
      discounted_price: p.discounted_price ? Number(p.discounted_price) : null,
      brand: p.brand || "Unknown", // Default to "Unknown" if brand is null
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching flyer products:", error);
    return NextResponse.json({ error: "Failed to fetch flyer products" }, { status: 500 });
  }
}
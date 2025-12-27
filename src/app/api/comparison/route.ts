import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const compareKey = searchParams.get("compare_key");
  const currentId = searchParams.get("current_id"); // current product id
  const city = searchParams.get("city");

  if (!compareKey) {
    return NextResponse.json(
      { error: "compare_key is required" },
      { status: 400 }
    );
  }

  try {
    const sql = `
      SELECT 
        fp.id,
        fp.name,
        fp.price,
        fp.discounted_price,
        COALESCE(fp.discounted_price, fp.price) AS effective_price,
        fp.image,
        fp.store_id,
        fp.compare_key,
        fp.product_status,
        array_to_string(fp.brands, ', ') AS brand,
        COALESCE(fp.short_description, '') AS short_description,
        COALESCE(fp.long_description, '') AS long_description,
        s.store_name AS "storeName",
        s.logo AS "storeLogo",
        s.city
      FROM flyer_products fp
      JOIN stores s ON s.id = fp.store_id
      WHERE LOWER(fp.compare_key) = LOWER($1)
      ${city ? "AND LOWER(s.city) = LOWER($2)" : ""}
      ${currentId ? `AND fp.id <> CAST($${city ? 3 : 2} AS INT)` : ""}
      AND COALESCE(fp.discounted_price, fp.price) > 0
      ORDER BY effective_price ASC
      LIMIT 7;
    `;

    const params = city
      ? currentId
        ? [compareKey, city, currentId]
        : [compareKey, city]
      : currentId
      ? [compareKey, currentId]
      : [compareKey];

    const { rows } = await query(sql, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching comparison data:", error);
    return NextResponse.json(
      { error: "Failed to fetch comparison data" },
      { status: 500 }
    );
  }
}

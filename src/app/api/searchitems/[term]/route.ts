// src/app/api/searchitems/[term]/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ term: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const rawTerm = (await context.params).term; // 👈 from the dynamic route segment

    const term = rawTerm?.trim().toLowerCase();

    if (!term) {
      return NextResponse.json({ error: "Missing term" }, { status: 400 });
    }

    const sql = `
      SELECT 
        fp.id,
        fp.name,
        fp.price,
        fp.discounted_price,
        fp.image,
        fp.product_status,
        fp.short_description,
        fp.compare_key,
        s.store_name AS "storeName",
        s.logo AS "storeLogo",
        s.city
      FROM flyer_products fp
      JOIN stores s ON s.id = fp.store_id
      WHERE LOWER(fp.compare_key) = LOWER($1)
      ${city ? `AND LOWER(s.city) = LOWER($2)` : ""}
      ORDER BY fp.price ASC
    `;

    const params = city ? [term, city] : [term];
    const { rows } = await query(sql, params);

    return NextResponse.json({ items: rows });
  } catch (err) {
    console.error("Error fetching items by compare_key:", err);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

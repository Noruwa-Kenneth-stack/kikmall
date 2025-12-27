import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("query")?.trim().toLowerCase() || "";
  const city = searchParams.get("city")?.trim().toLowerCase() || ""; // 👈 new line

  console.log("🔍 Incoming search request:", { searchTerm, city });

  if (!searchTerm) return NextResponse.json({ stores: [], items: [] });

  try {
    const storeResults = await query(
      `
      SELECT 
        s.store_name AS name,
        MIN(s.logo) AS logo,
        MIN(s.city) AS city,
        COUNT(DISTINCT s.id) AS flyercount
      FROM stores s
      WHERE LOWER(s.city) = $2
        AND LOWER(s.store_name) LIKE $1
      GROUP BY s.store_name
      ORDER BY s.store_name ASC
      LIMIT 3;
      `,
      [`${searchTerm}%`, city] // 👈 prefix search, filtered by city
    );

    const itemResults = await query(
      `
      SELECT DISTINCT compare_key
      FROM flyer_products fp
      JOIN stores s ON s.id = fp.store_id
      WHERE LOWER(s.city) = $2
        AND LOWER(fp.compare_key) LIKE $1
      ORDER BY fp.compare_key ASC
      LIMIT 3;
      `,
      [`${searchTerm}%`, city]
    );

    return NextResponse.json({
      stores: storeResults.rows.map((r) => ({
        ...r,
        flyerCount: Number(r.flyercount) || 0,
      })),
      items: itemResults.rows.map((r) => r.compare_key),
    });
  } catch (error) {
    console.error("❌ Search API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

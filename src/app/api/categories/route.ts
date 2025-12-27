// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "";

    let queryText = `
      SELECT unnest(categories) as category, COUNT(*) as count
      FROM stores
    `;
    const params: unknown[] = [];
    const conditions: string[] = [];

    if (city) {
      conditions.push(`LOWER(city) = LOWER($${params.length + 1})`);
      params.push(city);
    }

    if (conditions.length > 0) {
      queryText += ` WHERE ${conditions.join(" AND ")}`;
    }

    queryText += ` GROUP BY category`;

    const { rows } = await query(queryText, params);

    // Always include "All Circulars"
    const totalCount = rows.reduce((acc, row) => acc + parseInt(row.count), 0);
    const categories = [
      { name: "All Circulars", count: totalCount },
      ...rows.map((r) => ({ name: r.category, count: parseInt(r.count) })),
    ];

    return NextResponse.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    return NextResponse.json([], { status: 500 });
  }
}

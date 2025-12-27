import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "";
    const userLat = searchParams.get("lat");
    const userLon = searchParams.get("lon");
    const limit = Number(searchParams.get("limit") || 200);

    let sql = `
 SELECT
    id,
    "storeName" AS store_name,    
    address,
    city,
    categories,
    logo,
    "imageUrl" AS image_url,        
    status,
    ST_Y(location) AS lat,
    ST_X(location) AS lon
    `;

    const params: (string | number)[] = [];
    const whereClauses: string[] = [];

    // Distance calculation if user location exists
    if (userLat && userLon) {
      sql += `,
        ST_DistanceSphere(
          location,
          ST_SetSRID(ST_MakePoint($${params.length + 1}, $${params.length + 2}), 4326)
        ) / 1000 AS distance_km
      `;
      params.push(Number(userLon), Number(userLat)); // lon, lat
    } else {
      sql += `, NULL AS distance_km`;
    }

    sql += ` FROM stores`;

    // Filter by city
    if (city) {
      whereClauses.push(`LOWER(city) = LOWER($${params.length + 1})`);
      params.push(city);
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    sql += ` ORDER BY store_name ASC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await query(sql, params);

    return NextResponse.json({ stores: result.rows });
  } catch (err) {
    console.error("Error fetching stores:", err);
    return NextResponse.json({ stores: [] }, { status: 500 });
  }
}

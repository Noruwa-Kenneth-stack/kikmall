// app/api/stores/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const city = searchParams.get("city") || "";
    const category = searchParams.get("category") || "";
    const store = searchParams.get("store") || "";
    const favorites = searchParams.get("favorites");

    const userLat = searchParams.get("lat");
    const userLon = searchParams.get("lon");

    // Reserve $1 and $2
    const latParam = userLat ? Number(userLat) : null;
    const lonParam = userLon ? Number(userLon) : null;

    const params: unknown[] = [latParam, lonParam];
    const conditions: string[] = [];

    let queryText = `
      SELECT
        id,
        store_name AS "storeName",
        logo,
        city,
        address,
        status,
        featured,
        opening_hours,
        categories,

        -- Extract from GEOGRAPHY by casting to geometry
        ST_Y(location::geometry)::float AS lat,
        ST_X(location::geometry)::float AS lon,

        CASE
          WHEN location IS NOT NULL
           AND $1::float IS NOT NULL 
           AND $2::float IS NOT NULL
          THEN 
            ST_DistanceSphere(
              location::geometry,
              ST_SetSRID(ST_MakePoint($2, $1), 4326)
            ) / 1000
          ELSE NULL
        END AS distance_km
      FROM stores
    `;

    // Filters
    if (favorites) {
      const ids = favorites.split(",").map((id) => parseInt(id)).filter((id) => !isNaN(id));
      if (ids.length > 0) {
        conditions.push(`id = ANY($${params.length + 1})`);
        params.push(ids);
      }
    }

    if (city) {
      conditions.push(`LOWER(city) = LOWER($${params.length + 1})`);
      params.push(city);
    }

    if (category && category !== "All Circulars") {
      conditions.push(`$${params.length + 1} = ANY(categories)`);
      params.push(category);
    }

    if (store) {
      conditions.push(`LOWER(store_name) LIKE LOWER($${params.length + 1})`);
      params.push(`%${store}%`);
    }

    if (conditions.length > 0) {
      queryText += ` WHERE ${conditions.join(" AND ")}`;
    }

    const { rows } = await query(queryText, params);
    return NextResponse.json({ stores: rows });

  } catch (error) {
    console.error("API Error fetching stores:", error);
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 }
    );
  }
}

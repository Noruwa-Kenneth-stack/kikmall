// app/api/items/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const compareKey = searchParams.get("compareKey");
    const city = searchParams.get("city");

    const params: string[] = [];
    let idx = 1;

    if (name && !compareKey) {
      const prefix = name.trim();
      if (!prefix) return NextResponse.json({ suggestions: [] });

      let sql = `
        SELECT DISTINCT compare_key AS "compareKey"
        FROM flyer_products
        WHERE LOWER(compare_key) LIKE LOWER($${idx++})
      `;
      params.push(`${prefix}%`);

      if (city) {
        sql += ` AND store_id IN (
          SELECT id FROM stores WHERE LOWER(city) = LOWER($${idx++})
        )`;
        params.push(city);
      }

      sql += ` ORDER BY "compareKey" ASC LIMIT 4`;

      const { rows } = await query(sql, params);
      const suggestions: string[] = rows.map((r: { compareKey: string }) => r.compareKey);

      return NextResponse.json({ suggestions });
    }

    if (compareKey) {
      let sql = `
        SELECT id, store_id, name, price, discounted_price, product_status,
               item_id, image, sku, brands, weight, image_thumbnails,
               compare_key AS "compareKey", maincategory, category, subcategory,
               offer_end_date, short_description, long_description
        FROM flyer_products
        WHERE LOWER(compare_key) = LOWER($${idx++})
      `;
      params.push(compareKey);

      if (city) {
        sql += ` AND store_id IN (
          SELECT id FROM stores WHERE LOWER(city) = LOWER($${idx++})
        )`;
        params.push(city);
      }

      const { rows } = await query(sql, params);
      console.log("CompareKey:", compareKey, "Rows returned:", rows.length);
      return NextResponse.json({ items: rows });
    }

    return NextResponse.json({ suggestions: [] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}
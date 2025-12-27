import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city"); // optional filter by city

const query = city
  ? `
    SELECT
      pb.id AS banner_id,
      pb.headline,
      pb.title AS banner_title,
      pb.subtitle AS banner_subtitle,
      pb.image AS banner_image,
      pb.city,
      pb.product_id,
      fp.*                         -- 👈 full product row
    FROM product_banner pb
    JOIN flyer_products fp ON pb.product_id = fp.id
    WHERE LOWER(pb.city) = LOWER($1)
    ORDER BY pb.id ASC;
  `
  : `
    SELECT
      pb.id AS banner_id,
      pb.headline,
      pb.title AS banner_title,
      pb.subtitle AS banner_subtitle,
      pb.image AS banner_image,
      pb.city,
      pb.product_id,
      fp.*                         -- 👈 full product row
    FROM product_banner pb
    JOIN flyer_products fp ON pb.product_id = fp.id
    ORDER BY pb.id ASC;
  `;



    const result = city
      ? await pool.query(query, [city])
      : await pool.query(query);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching product banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch product banners" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id");

    if (!productId) {
      return NextResponse.json(
        { error: "Missing product_id" },
        { status: 400 }
      );
    }

    const sql = `
      SELECT 
        fp.*,
        s.store_name,
        s.logo AS store_logo
      FROM flyer_products fp
      JOIN stores s ON s.id = fp.store_id
      WHERE fp.id = $1
      LIMIT 1
    `;

    const { rows } = await query(sql, [productId]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("❌ /api/product-with-store error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

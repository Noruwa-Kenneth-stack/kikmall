import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "Ojo"; // default to Ojo

    const result = await query(
      `
      SELECT id, image, title, subtitle, price, offer, hotkey, city
      FROM product_ads
      WHERE city = $1
      ORDER BY id ASC
      `,
      [city]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching product ads:", error);
    return NextResponse.json(
      { error: "Failed to fetch product ads" },
      { status: 500 }
    );
  }
}

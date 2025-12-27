import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "Ojo"; // default fallback

    const res = await query(
      `SELECT * FROM store_ads WHERE city = $1 ORDER BY id ASC`,
      [city]
    );

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 });
  }
}

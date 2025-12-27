import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await query(`
      SELECT id, name, icon 
      FROM itemlist 
      ORDER BY id ASC 
      LIMIT 15;
    `);
    return NextResponse.json({ items: rows });
  } catch (error) {
    console.error("Error fetching itemlist:", error);
    return NextResponse.json({ error: "Failed to fetch itemlist" }, { status: 500 });
  }
}

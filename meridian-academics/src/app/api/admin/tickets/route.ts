import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("[tickets] fetch error:", error.message);
    return NextResponse.json({ error: "Failed to load tickets." }, { status: 500 });
  }

  return NextResponse.json(data);
}

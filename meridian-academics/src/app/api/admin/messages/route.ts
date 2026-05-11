import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("[messages] fetch error:", error.message);
    return NextResponse.json({ error: "Failed to load messages." }, { status: 500 });
  }

  return NextResponse.json(data);
}

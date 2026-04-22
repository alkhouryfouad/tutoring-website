import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validateTicketInput } from "@/lib/validation";

export async function POST(request: NextRequest) {
  // Rate-limit hint: protect with Vercel WAF or upstash-ratelimit in production
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Silently discard honeypot-filled submissions (bots)
  if (
    typeof body === "object" &&
    body !== null &&
    (body as Record<string, unknown>)._gotcha
  ) {
    return NextResponse.json({ ok: true });
  }

  const result = validateTicketInput(body);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Validation failed.", fields: result.errors },
      { status: 422 }
    );
  }

  const { error } = await supabase.from("tickets").insert(result.data);
  if (error) {
    console.error("[submit] Supabase insert error:", error.message);
    return NextResponse.json(
      { error: "Could not save your submission. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

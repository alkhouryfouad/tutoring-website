import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validateTicketInput } from "@/lib/validation";
import { notifyNewTicket } from "@/lib/notify";
import { checkRate } from "@/lib/rate-limit";

const RATE = { key: "submit", max: 5, windowMs: 60 * 60 * 1000 }; // 5 per IP per hour

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Silently discard honeypot-filled submissions (bots) — don't telegraph the rate limit
  if (
    typeof body === "object" &&
    body !== null &&
    (body as Record<string, unknown>)._gotcha
  ) {
    return NextResponse.json({ ok: true });
  }

  const rate = checkRate(request, RATE);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many submissions from this connection. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
    );
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

  // Best-effort: don't await — let the response return immediately.
  void notifyNewTicket(result.data);

  return NextResponse.json({ ok: true }, { status: 201 });
}

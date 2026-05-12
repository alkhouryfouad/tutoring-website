import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validateContactMessageInput } from "@/lib/validation";
import { notifyNewMessage } from "@/lib/notify";
import { checkRate } from "@/lib/rate-limit";

const RATE = { key: "contact", max: 10, windowMs: 60 * 60 * 1000 }; // 10 per IP per hour

export async function POST(request: NextRequest) {
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

  const rate = checkRate(request, RATE);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many messages from this connection. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
    );
  }

  const result = validateContactMessageInput(body);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Validation failed.", fields: result.errors },
      { status: 422 }
    );
  }

  const { error } = await supabase.from("contact_messages").insert(result.data);
  if (error) {
    console.error("[contact] Supabase insert error:", error.message);
    return NextResponse.json(
      { error: "Could not save your message. Please try again." },
      { status: 500 }
    );
  }

  // Best-effort: don't await — let the response return immediately.
  void notifyNewMessage(result.data);

  return NextResponse.json({ ok: true }, { status: 201 });
}

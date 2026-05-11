import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validateContactMessageInput } from "@/lib/validation";
import { notifyNewMessage } from "@/lib/notify";

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

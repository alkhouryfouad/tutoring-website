import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  validateMessageStatusUpdate,
  validateInternalNotes,
} from "@/lib/validation";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin") ?? request.headers.get("referer") ?? "";
  if (!origin) return false;
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  if (site && origin.startsWith(site)) return true;
  if (origin.startsWith("http://localhost:")) return true;
  return false;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  // CSRF defense-in-depth (cookie is already SameSite=strict)
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await context.params;

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid message ID." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (typeof body === "object" && body !== null && "status" in body) {
    const status = validateMessageStatusUpdate(body);
    if (!status) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 422 });
    }
    updates.status = status;
    if (status === "replied") updates.replied_at = new Date().toISOString();
  }

  if (typeof body === "object" && body !== null && "internal_notes" in body) {
    const notes = validateInternalNotes(body);
    if (notes === null && (body as Record<string, unknown>).internal_notes !== "") {
      return NextResponse.json({ error: "Invalid notes." }, { status: 422 });
    }
    updates.internal_notes = notes;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("[messages/update] error:", error.message);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  return NextResponse.json(data);
}

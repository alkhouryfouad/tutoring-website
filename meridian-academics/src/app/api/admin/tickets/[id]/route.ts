import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validateStatusUpdate, validateInternalNotes } from "@/lib/validation";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  // Validate UUID format to prevent injection
  if (!/^[0-9a-f-]{36}$/.test(id)) {
    return NextResponse.json({ error: "Invalid ticket ID." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (typeof body === "object" && body !== null && "status" in body) {
    const status = validateStatusUpdate(body);
    if (!status) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 422 });
    }
    updates.status = status;
    // Record when contacted/completed for audit trail
    if (status === "contacted") updates.contacted_at = new Date().toISOString();
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
    .from("tickets")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[tickets/update] error:", error.message);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }

  return NextResponse.json(data);
}

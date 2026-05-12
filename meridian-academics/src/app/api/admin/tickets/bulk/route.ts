import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_IDS = 100;
const ALLOWED_STATUS = new Set(["contacted"]);

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin") ?? request.headers.get("referer") ?? "";
  if (!origin) return false;
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  if (site && origin.startsWith(site)) return true;
  if (origin.startsWith("http://localhost:")) return true;
  return false;
}

export async function POST(request: NextRequest) {
  // CSRF defense-in-depth (cookie is already SameSite=strict)
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const status = String(b?.status ?? "");
  if (!ALLOWED_STATUS.has(status)) {
    return NextResponse.json({ error: "Invalid status for bulk update." }, { status: 422 });
  }

  const rawIds = b?.ids;
  if (!Array.isArray(rawIds) || rawIds.length === 0) {
    return NextResponse.json({ error: "ids must be a non-empty array." }, { status: 422 });
  }
  if (rawIds.length > MAX_IDS) {
    return NextResponse.json({ error: `Too many ids (max ${MAX_IDS}).` }, { status: 422 });
  }
  const ids: string[] = [];
  for (const v of rawIds) {
    if (typeof v !== "string" || !UUID_RE.test(v)) {
      return NextResponse.json({ error: "Invalid id format." }, { status: 422 });
    }
    ids.push(v);
  }

  const updates = {
    status,
    contacted_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("tickets")
    .update(updates)
    .in("id", ids)
    .eq("status", "new") // only flip rows that are still 'new' — idempotent + safe
    .select();

  if (error) {
    console.error("[tickets/bulk] error:", error.message);
    return NextResponse.json({ error: "Bulk update failed." }, { status: 500 });
  }

  return NextResponse.json({ updated: data?.length ?? 0 });
}

import { NextRequest, NextResponse } from "next/server";
import { checkAdminPassword, signAdminToken, COOKIE_NAME } from "@/lib/auth";

interface Attempt {
  failures: number;
  nextAllowedAt: number;
}

// In-memory per-IP rate limit. Single-instance scope (Vercel serverless cold
// starts reset this) — acceptable for a single-admin site. Move to Upstash
// or similar if multi-instance scaling becomes a concern.
const attempts = new Map<string, Attempt>();
const MAX_BACKOFF_MS = 30_000;

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function cleanup(now: number) {
  // Drop entries whose backoff window passed >1 minute ago.
  for (const [ip, a] of attempts) {
    if (a.nextAllowedAt < now - 60_000) attempts.delete(ip);
  }
}

export async function POST(request: NextRequest) {
  const now = Date.now();
  const ip = getClientIp(request);
  const a = attempts.get(ip);

  if (a && now < a.nextAllowedAt) {
    const retryAfter = Math.ceil((a.nextAllowedAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const password = String(
    (body as Record<string, unknown>)?.password ?? ""
  );

  if (!checkAdminPassword(password)) {
    // Uniform delay helps prevent timing-based enumeration
    await new Promise((r) => setTimeout(r, 400));
    const failures = (a?.failures ?? 0) + 1;
    const delay = Math.min(MAX_BACKOFF_MS, 1000 * 2 ** (failures - 1));
    attempts.set(ip, { failures, nextAllowedAt: now + delay });
    if (attempts.size > 200) cleanup(now);
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  attempts.delete(ip);
  const token = await signAdminToken();

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return response;
}

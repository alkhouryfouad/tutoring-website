import type { NextRequest } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

interface Options {
  /** Unique identifier per route (so different endpoints don't share counters). */
  key: string;
  /** Maximum allowed requests within the window. */
  max: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export interface RateResult {
  ok: boolean;
  /** Seconds the client should wait before retrying (only meaningful when ok=false). */
  retryAfter: number;
}

// Module-level per-instance buckets. Vercel serverless cold starts reset this
// — fine for spam-defense on a low-traffic site. Upgrade to a Redis-backed
// limiter if multi-instance accuracy ever matters.
const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5000;

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function cleanup(now: number) {
  for (const [k, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(k);
  }
}

export function checkRate(request: NextRequest, opts: Options): RateResult {
  const now = Date.now();
  const ip = getClientIp(request);
  const mapKey = `${opts.key}:${ip}`;
  const existing = buckets.get(mapKey);

  if (!existing || existing.resetAt <= now) {
    buckets.set(mapKey, { count: 1, resetAt: now + opts.windowMs });
    if (buckets.size > MAX_KEYS) cleanup(now);
    return { ok: true, retryAfter: 0 };
  }

  if (existing.count >= opts.max) {
    return { ok: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { ok: true, retryAfter: 0 };
}

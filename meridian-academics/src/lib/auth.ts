import { SignJWT, jwtVerify } from "jose";
import { timingSafeEqual } from "crypto";

const COOKIE_NAME = "ma_admin_token";
const JWT_EXPIRY = "7d";

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_JWT_SECRET must be set and at least 32 characters long."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(getSecret());
}

export async function verifyAdminToken(
  token: string
): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export function checkAdminPassword(input: string): boolean {
  const stored = process.env.ADMIN_PASSWORD ?? "";
  if (!stored || stored.length === 0) return false;
  try {
    const a = Buffer.from(input.padEnd(stored.length));
    const b = Buffer.from(stored);
    // Constant-time comparison to prevent timing attacks
    return (
      a.length === b.length && timingSafeEqual(a, b)
    );
  } catch {
    return false;
  }
}

export { COOKIE_NAME };

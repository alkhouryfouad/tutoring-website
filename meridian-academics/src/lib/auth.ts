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

const PASSWORD_COMPARE_LEN = 256;

export function checkAdminPassword(input: string): boolean {
  const stored = process.env.ADMIN_PASSWORD ?? "";
  if (!stored) return false;
  try {
    // Pad both to the same fixed length so timingSafeEqual always runs on
    // the same number of bytes regardless of input length. Without this,
    // the early-exit length check would leak whether the guess is longer
    // than the real password.
    const a = Buffer.alloc(PASSWORD_COMPARE_LEN, 0);
    const b = Buffer.alloc(PASSWORD_COMPARE_LEN, 0);
    Buffer.from(input, "utf8").copy(a, 0, 0, PASSWORD_COMPARE_LEN);
    Buffer.from(stored, "utf8").copy(b, 0, 0, PASSWORD_COMPARE_LEN);
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export { COOKIE_NAME };

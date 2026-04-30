import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "ma_admin_token";

function getSecret(): Uint8Array {
  const s = process.env.ADMIN_JWT_SECRET ?? "";
  if (!s || s.length < 32) {
    // Return a dummy key — jwtVerify will fail, treating the request as unauthenticated.
    // The real error is caught at login time via auth.ts's stricter getSecret().
    return new Uint8Array(32);
  }
  return new TextEncoder().encode(s);
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/login is always public
  if (pathname === "/admin/login") return NextResponse.next();

  // All /admin/* pages require auth
  if (pathname.startsWith("/admin")) {
    if (!(await isAuthenticated(request))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // All /api/admin/* endpoints require auth
  if (pathname.startsWith("/api/admin")) {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

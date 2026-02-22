import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "mt_access_token";

function hasAuthCookie(request: NextRequest): boolean {
  return Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedPath =
    pathname === "/today" || pathname === "/history" || pathname === "/profile";
  const authenticated = hasAuthCookie(request);

  if (isProtectedPath && !authenticated) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/today", "/history", "/profile", "/auth"],
};

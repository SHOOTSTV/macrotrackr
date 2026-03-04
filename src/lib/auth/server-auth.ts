import type { NextRequest } from "next/server";

import { supabasePublicServer } from "@/src/lib/supabase/public-server";

export class AuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
  }
}

const AUTH_COOKIE_NAME = "mt_access_token";

function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  return header.slice(7).trim();
}

function getTokenFromCookies(request: NextRequest): string | null {
  const cookie = request.cookies.get(AUTH_COOKIE_NAME);
  return cookie?.value ?? null;
}

export async function requireAuthenticatedUserId(request: NextRequest): Promise<string> {
  const token = getBearerToken(request) ?? getTokenFromCookies(request);

  if (!token) {
    throw new AuthError("Missing bearer token");
  }

  const { data, error } = await supabasePublicServer.auth.getUser(token);
  if (error || !data.user) {
    throw new AuthError("Invalid or expired token");
  }

  return data.user.id;
}

import type { NextRequest } from "next/server";

import { supabasePublicServer } from "@/src/lib/supabase/public-server";

export class AuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
  }
}

function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  return header.slice(7).trim();
}

export async function requireAuthenticatedUserId(request: NextRequest): Promise<string> {
  const token = getBearerToken(request);
  if (!token) {
    throw new AuthError("Missing bearer token");
  }

  const { data, error } = await supabasePublicServer.auth.getUser(token);
  if (error || !data.user) {
    throw new AuthError("Invalid or expired token");
  }

  return data.user.id;
}

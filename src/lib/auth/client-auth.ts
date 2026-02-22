"use client";

import { supabaseBrowser } from "@/src/lib/supabase/browser";

const AUTH_COOKIE_NAME = "mt_access_token";

function isSecureContext(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.location.protocol === "https:";
}

export function setAccessTokenCookie(token: string | null): void {
  if (typeof document === "undefined") {
    return;
  }

  const secure = isSecureContext() ? "; Secure" : "";
  if (!token) {
    document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
    return;
  }

  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=604800; SameSite=Lax${secure}`;
}

export async function syncAuthCookieFromSession(): Promise<string | null> {
  const { data, error } = await supabaseBrowser.auth.getSession();
  if (error) {
    throw new Error("Unable to read the current session.");
  }

  const token = data.session?.access_token ?? null;
  setAccessTokenCookie(token);
  return token;
}

export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await syncAuthCookieFromSession();
  if (!token) {
    throw new Error("Authentication required. Sign in from /auth.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

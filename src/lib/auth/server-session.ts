import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { supabasePublicServer } from "@/src/lib/supabase/public-server";
import { supabaseAdmin } from "@/src/lib/supabase/admin";

const AUTH_COOKIE_NAME = "mt_access_token";

export async function requireServerUserId(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect("/auth");
  }

  const { data, error } = await supabasePublicServer.auth.getUser(token);
  if (error || !data.user) {
    redirect("/auth");
  }

  return data.user.id;
}

export async function requireServerUserIdWithOnboarding(): Promise<string> {
  const userId = await requireServerUserId();

  const { data, error } = await supabaseAdmin
    .from("user_profile")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    redirect("/onboarding");
  }

  return userId;
}


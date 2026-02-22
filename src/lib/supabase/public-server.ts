import { createClient } from "@supabase/supabase-js";

import { env } from "@/src/lib/env";

export const supabasePublicServer = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false },
  },
);

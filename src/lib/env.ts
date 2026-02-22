import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
});

const envResult = envSchema.safeParse(process.env);

if (!envResult.success) {
  throw new Error(
    `Invalid environment variables: ${envResult.error.issues
      .map((issue) => issue.path.join("."))
      .join(", ")}`,
  );
}

if (
  (envResult.data.UPSTASH_REDIS_REST_URL && !envResult.data.UPSTASH_REDIS_REST_TOKEN) ||
  (!envResult.data.UPSTASH_REDIS_REST_URL && envResult.data.UPSTASH_REDIS_REST_TOKEN)
) {
  throw new Error(
    "Invalid environment variables: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must both be set",
  );
}

export const env = envResult.data;

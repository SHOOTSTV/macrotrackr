import { Redis } from "@upstash/redis";

import { env } from "@/src/lib/env";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 60;
const WINDOW_SECONDS = WINDOW_MS / 1000;

const redis =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

function checkRateLimitInMemory(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  bucket.count += 1;
  return true;
}

export async function checkRateLimit(key: string): Promise<boolean> {
  if (!redis) {
    return checkRateLimitInMemory(key);
  }

  try {
    const bucketId = Math.floor(Date.now() / WINDOW_MS);
    const redisKey = `ratelimit:${key}:${bucketId}`;
    const count = await redis.incr(redisKey);
    if (count === 1) {
      await redis.expire(redisKey, WINDOW_SECONDS);
    }

    return count <= MAX_REQUESTS_PER_WINDOW;
  } catch {
    // Fallback to local memory if Redis is unavailable.
    return checkRateLimitInMemory(key);
  }
}

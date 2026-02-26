import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

import { env } from "@/src/lib/env";
import { checkRateLimit } from "@/src/lib/http/rate-limit";
import { badRequest, fromZodError, serverError, tooManyRequests, unauthorized } from "@/src/lib/http/response";
import { getClientIp } from "@/src/lib/http/request";
import { createMeal } from "@/src/lib/services/meals";
import { ingestMealSchema } from "@/src/lib/validators/ingest";

export const runtime = "nodejs";

function safeCompare(value: string, expected: string): boolean {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(valueBuffer, expectedBuffer);
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`post:meals:ingest:${ip}`))) {
    return tooManyRequests();
  }

  if (!env.INGEST_SECRET) {
    return serverError("INGEST_SECRET is not configured");
  }

  const ingestKey = request.headers.get("x-ingest-key");
  if (!ingestKey || !safeCompare(ingestKey, env.INGEST_SECRET)) {
    return unauthorized("Invalid ingest key");
  }

  const rawBody = await request.text();

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return badRequest("Invalid JSON payload");
  }

  const parsed = ingestMealSchema.safeParse(body);
  if (!parsed.success) {
    return fromZodError(parsed.error);
  }

  try {
    const meal = await createMeal(
      {
        title: parsed.data.title,
        kcal: parsed.data.kcal,
        protein_g: parsed.data.protein_g,
        carbs_g: parsed.data.carbs_g,
        fat_g: parsed.data.fat_g,
        eaten_at: parsed.data.eaten_at ?? new Date().toISOString(),
        meal_type: parsed.data.meal_type ?? "snack",
        author: parsed.data.author ?? "manual",
        source_detail: parsed.data.source_detail ?? "api:ingest",
        confidence: parsed.data.confidence ?? null,
        notes: parsed.data.notes ?? "",
      },
      parsed.data.user_id,
    );

    return Response.json({ data: meal }, { status: 201 });
  } catch (error) {
    return serverError(error instanceof Error ? error.message : undefined);
  }
}

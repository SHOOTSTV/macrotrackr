import { AuthError, requireAuthenticatedUserId } from "@/src/lib/auth/server-auth";
import type { NextRequest } from "next/server";

import { checkRateLimit } from "@/src/lib/http/rate-limit";
import {
  badRequest,
  fromZodError,
  serverError,
  tooManyRequests,
  unauthorized,
} from "@/src/lib/http/response";
import { getClientIp } from "@/src/lib/http/request";
import { createMeal } from "@/src/lib/services/meals";
import { createMealSchema } from "@/src/lib/validators/meals";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`post:meals:${ip}`))) {
    return tooManyRequests();
  }

  const idempotencyKeyHeader = request.headers.get("Idempotency-Key")?.trim();
  if (idempotencyKeyHeader && idempotencyKeyHeader.length > 128) {
    return badRequest("Idempotency-Key must be 128 characters or less");
  }

  const idempotencyKey = idempotencyKeyHeader && idempotencyKeyHeader.length > 0
    ? idempotencyKeyHeader
    : undefined;

  try {
    const userId = await requireAuthenticatedUserId(request);
    const body = await request.json();
    const parsed = createMealSchema.safeParse(body);

    if (!parsed.success) {
      return fromZodError(parsed.error);
    }

    const { meal, replayed } = await createMeal(parsed.data, userId, idempotencyKey);

    return Response.json(
      { data: meal },
      {
        status: replayed ? 200 : 201,
        headers: replayed ? { "Idempotency-Replayed": "true" } : undefined,
      },
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return unauthorized(error.message);
    }

    return serverError(error instanceof Error ? error.message : undefined);
  }
}


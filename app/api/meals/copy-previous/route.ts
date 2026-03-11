import type { NextRequest } from "next/server";

import { AuthError, requireAuthenticatedUserId } from "@/src/lib/auth/server-auth";
import { checkRateLimit } from "@/src/lib/http/rate-limit";
import {
  badRequest,
  fromZodError,
  serverError,
  tooManyRequests,
  unauthorized,
} from "@/src/lib/http/response";
import { getClientIp } from "@/src/lib/http/request";
import { trackAnalyticsEvent } from "@/src/lib/services/analytics";
import { copyMealFromPrevious } from "@/src/lib/services/meals";
import { copyPreviousMealSchema } from "@/src/lib/validators/copy-meal";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`post:meals-copy-previous:${ip}`))) {
    return tooManyRequests();
  }

  try {
    const userId = await requireAuthenticatedUserId(request);
    const parsed = copyPreviousMealSchema.safeParse(await request.json());

    if (!parsed.success) {
      return fromZodError(parsed.error);
    }

    const meal = await copyMealFromPrevious(userId, parsed.data.meal_id);

    await trackAnalyticsEvent(userId, "meal_copied", {
      source_meal_id: parsed.data.meal_id,
      meal_type: meal.meal_type,
    });

    return Response.json({ data: meal }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return unauthorized(error.message);
    }

    return error instanceof SyntaxError
      ? badRequest("Invalid request")
      : serverError(error instanceof Error ? error.message : undefined);
  }
}


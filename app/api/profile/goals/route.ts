import type { NextRequest } from "next/server";

import { AuthError, requireAuthenticatedUserId } from "@/src/lib/auth/server-auth";
import { checkRateLimit } from "@/src/lib/http/rate-limit";
import { badRequest, fromZodError, serverError, tooManyRequests, unauthorized } from "@/src/lib/http/response";
import { getClientIp } from "@/src/lib/http/request";
import { getNutritionGoals, upsertNutritionGoals } from "@/src/lib/services/profile-goals";
import { nutritionGoalsSchema } from "@/src/lib/validators/profile";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`get:profile-goals:${ip}`))) {
    return tooManyRequests();
  }

  try {
    const userId = await requireAuthenticatedUserId(request);
    const goals = await getNutritionGoals(userId);
    return Response.json({ data: goals });
  } catch (error) {
    if (error instanceof AuthError) {
      return unauthorized(error.message);
    }

    return serverError(error instanceof Error ? error.message : undefined);
  }
}

export async function PUT(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`put:profile-goals:${ip}`))) {
    return tooManyRequests();
  }

  try {
    const userId = await requireAuthenticatedUserId(request);
    const body = await request.json();
    const parsed = nutritionGoalsSchema.safeParse(body);
    if (!parsed.success) {
      return fromZodError(parsed.error);
    }

    const goals = await upsertNutritionGoals(parsed.data, userId);
    return Response.json({ data: goals });
  } catch (error) {
    if (error instanceof AuthError) {
      return unauthorized(error.message);
    }

    return error instanceof SyntaxError
      ? badRequest("Invalid request")
      : serverError(error instanceof Error ? error.message : undefined);
  }
}

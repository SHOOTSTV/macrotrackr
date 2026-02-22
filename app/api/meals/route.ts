import { AuthError, requireAuthenticatedUserId } from "@/src/lib/auth/server-auth";
import type { NextRequest } from "next/server";

import { checkRateLimit } from "@/src/lib/http/rate-limit";
import { fromZodError, serverError, tooManyRequests, unauthorized } from "@/src/lib/http/response";
import { getClientIp } from "@/src/lib/http/request";
import { createMeal } from "@/src/lib/services/meals";
import { createMealSchema } from "@/src/lib/validators/meals";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`post:meals:${ip}`))) {
    return tooManyRequests();
  }

  try {
    const userId = await requireAuthenticatedUserId(request);
    const body = await request.json();
    const parsed = createMealSchema.safeParse(body);

    if (!parsed.success) {
      return fromZodError(parsed.error);
    }

    const meal = await createMeal(parsed.data, userId);
    return Response.json({ data: meal }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return unauthorized(error.message);
    }

    return serverError(error instanceof Error ? error.message : undefined);
  }
}

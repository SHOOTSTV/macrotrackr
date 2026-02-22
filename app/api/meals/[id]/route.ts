import type { NextRequest } from "next/server";
import { z } from "zod";

import { AuthError, requireAuthenticatedUserId } from "@/src/lib/auth/server-auth";
import { checkRateLimit } from "@/src/lib/http/rate-limit";
import { fromZodError, serverError, tooManyRequests, unauthorized } from "@/src/lib/http/response";
import { getClientIp } from "@/src/lib/http/request";
import { patchMeal } from "@/src/lib/services/meals";
import { patchMealSchema } from "@/src/lib/validators/meals";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`patch:meal:${ip}`))) {
    return tooManyRequests();
  }

  if (request.headers.get("x-dashboard-ui") !== "1") {
    return Response.json(
      {
        error: "forbidden",
        message: "Meal updates are only allowed from dashboard UI",
      },
      { status: 403 },
    );
  }

  try {
    const userId = await requireAuthenticatedUserId(request);
    const routeParams = paramsSchema.safeParse(await params);
    if (!routeParams.success) {
      return fromZodError(routeParams.error);
    }

    const body = await request.json();
    const parsed = patchMealSchema.safeParse(body);

    if (!parsed.success) {
      return fromZodError(parsed.error);
    }

    const meal = await patchMeal(routeParams.data.id, userId, parsed.data);
    return Response.json({ data: meal });
  } catch (error) {
    if (error instanceof AuthError) {
      return unauthorized(error.message);
    }

    return serverError(error instanceof Error ? error.message : undefined);
  }
}

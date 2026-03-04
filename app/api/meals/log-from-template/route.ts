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
import { logFromTemplate } from "@/src/lib/services/favorites";
import { logFromTemplateSchema } from "@/src/lib/validators/favorites";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`post:meals-log-template:${ip}`))) {
    return tooManyRequests();
  }

  try {
    const userId = await requireAuthenticatedUserId(request);
    const parsed = logFromTemplateSchema.safeParse(await request.json());

    if (!parsed.success) {
      return fromZodError(parsed.error);
    }

    const meal = await logFromTemplate(userId, parsed.data);

    await trackAnalyticsEvent(userId, "meal_logged", {
      source: parsed.data.source,
      meal_type: parsed.data.meal_type,
      query_length: parsed.data.title.length,
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

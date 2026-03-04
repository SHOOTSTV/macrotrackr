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
import { macroAlertEventSchema } from "@/src/lib/validators/analytics";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`post:analytics-macro-alert:${ip}`))) {
    return tooManyRequests();
  }

  try {
    const userId = await requireAuthenticatedUserId(request);
    const parsed = macroAlertEventSchema.safeParse(await request.json());

    if (!parsed.success) {
      return fromZodError(parsed.error);
    }

    await trackAnalyticsEvent(userId, "macro_alert_triggered", parsed.data);

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return unauthorized(error.message);
    }

    return error instanceof SyntaxError
      ? badRequest("Invalid request")
      : serverError(error instanceof Error ? error.message : undefined);
  }
}

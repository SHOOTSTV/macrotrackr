import type { NextRequest } from "next/server";

import { AuthError, requireAuthenticatedUserId } from "@/src/lib/auth/server-auth";
import { checkRateLimit } from "@/src/lib/http/rate-limit";
import { badRequest, fromZodError, serverError, tooManyRequests, unauthorized } from "@/src/lib/http/response";
import { getClientIp } from "@/src/lib/http/request";
import { trackAnalyticsEvent } from "@/src/lib/services/analytics";
import { buildWeightTrend, createWeightLog, listWeightLogsForRange } from "@/src/lib/services/weight";
import { createWeightLogSchema, weightRangeQuerySchema } from "@/src/lib/validators/weight";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`get:weight:${ip}`))) {
    return tooManyRequests();
  }

  try {
    const userId = await requireAuthenticatedUserId(request);
    const parsed = weightRangeQuerySchema.safeParse({
      from: request.nextUrl.searchParams.get("from"),
      to: request.nextUrl.searchParams.get("to"),
    });

    if (!parsed.success) {
      return fromZodError(parsed.error);
    }

    const logs = await listWeightLogsForRange(userId, parsed.data.from, parsed.data.to);
    const trend = buildWeightTrend(logs, parsed.data.from, parsed.data.to);
    return Response.json({ data: trend });
  } catch (error) {
    if (error instanceof AuthError) {
      return unauthorized(error.message);
    }

    return serverError(error instanceof Error ? error.message : undefined);
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`post:weight:${ip}`))) {
    return tooManyRequests();
  }

  try {
    const userId = await requireAuthenticatedUserId(request);
    const parsed = createWeightLogSchema.safeParse(await request.json());

    if (!parsed.success) {
      return fromZodError(parsed.error);
    }

    const log = await createWeightLog(userId, parsed.data.weight_kg, parsed.data.logged_at);
    await trackAnalyticsEvent(userId, "weight_logged", {
      weight_kg: Number(log.weight_kg),
    });

    return Response.json({ data: log }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return unauthorized(error.message);
    }

    return error instanceof SyntaxError
      ? badRequest("Invalid request")
      : serverError(error instanceof Error ? error.message : undefined);
  }
}

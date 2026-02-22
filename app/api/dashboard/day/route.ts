import type { NextRequest } from "next/server";

import { AuthError, requireAuthenticatedUserId } from "@/src/lib/auth/server-auth";
import { checkRateLimit } from "@/src/lib/http/rate-limit";
import { badRequest, fromZodError, serverError, tooManyRequests, unauthorized } from "@/src/lib/http/response";
import { getClientIp } from "@/src/lib/http/request";
import { getDayDashboard } from "@/src/lib/services/dashboard";
import { dayQuerySchema } from "@/src/lib/validators/meals";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`get:dashboard-day:${ip}`))) {
    return tooManyRequests();
  }

  try {
    const userId = await requireAuthenticatedUserId(request);
    const date = request.nextUrl.searchParams.get("date");

    const parsed = dayQuerySchema.safeParse({
      date,
    });

    if (!parsed.success) {
      return fromZodError(parsed.error);
    }

    const payload = await getDayDashboard(userId, parsed.data.date);
    return Response.json({ data: payload });
  } catch (error) {
    if (error instanceof AuthError) {
      return unauthorized(error.message);
    }

    return error instanceof SyntaxError
      ? badRequest("Invalid request")
      : serverError(error instanceof Error ? error.message : undefined);
  }
}

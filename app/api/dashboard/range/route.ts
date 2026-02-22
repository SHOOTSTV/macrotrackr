import type { NextRequest } from "next/server";

import { AuthError, requireAuthenticatedUserId } from "@/src/lib/auth/server-auth";
import { checkRateLimit } from "@/src/lib/http/rate-limit";
import { fromZodError, serverError, tooManyRequests, unauthorized } from "@/src/lib/http/response";
import { getClientIp } from "@/src/lib/http/request";
import { getRangeDashboard } from "@/src/lib/services/dashboard";
import { rangeQuerySchema } from "@/src/lib/validators/meals";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`get:dashboard-range:${ip}`))) {
    return tooManyRequests();
  }

  try {
    const userId = await requireAuthenticatedUserId(request);
    const from = request.nextUrl.searchParams.get("from");
    const to = request.nextUrl.searchParams.get("to");

    const parsed = rangeQuerySchema.safeParse({
      from,
      to,
    });

    if (!parsed.success) {
      return fromZodError(parsed.error);
    }

    const payload = await getRangeDashboard(userId, parsed.data.from, parsed.data.to);
    return Response.json({ data: payload });
  } catch (error) {
    if (error instanceof AuthError) {
      return unauthorized(error.message);
    }

    return serverError(error instanceof Error ? error.message : undefined);
  }
}

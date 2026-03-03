import type { NextRequest } from "next/server";

import { AuthError, requireAuthenticatedUserId } from "@/src/lib/auth/server-auth";
import { checkRateLimit } from "@/src/lib/http/rate-limit";
import { fromZodError, serverError, tooManyRequests, unauthorized } from "@/src/lib/http/response";
import { getClientIp } from "@/src/lib/http/request";
import { deleteMealsForDate } from "@/src/lib/services/meals";
import { dayQuerySchema } from "@/src/lib/validators/meals";

export async function DELETE(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`delete:meals-day:${ip}`))) {
    return tooManyRequests();
  }

  if (request.headers.get("x-dashboard-ui") !== "1") {
    return Response.json(
      {
        error: "forbidden",
        message: "Bulk meal deletion is only allowed from dashboard UI",
      },
      { status: 403 },
    );
  }

  try {
    const userId = await requireAuthenticatedUserId(request);
    const parsed = dayQuerySchema.safeParse({
      date: request.nextUrl.searchParams.get("date"),
    });

    if (!parsed.success) {
      return fromZodError(parsed.error);
    }

    const deletedCount = await deleteMealsForDate(userId, parsed.data.date);
    return Response.json({ data: { deleted_count: deletedCount } });
  } catch (error) {
    if (error instanceof AuthError) {
      return unauthorized(error.message);
    }

    return serverError(error instanceof Error ? error.message : undefined);
  }
}

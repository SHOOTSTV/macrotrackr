import type { NextRequest } from "next/server";

import { AuthError, requireAuthenticatedUserId } from "@/src/lib/auth/server-auth";
import { checkRateLimit } from "@/src/lib/http/rate-limit";
import { fromZodError, serverError, tooManyRequests, unauthorized } from "@/src/lib/http/response";
import { getClientIp } from "@/src/lib/http/request";
import { trackAnalyticsEvent } from "@/src/lib/services/analytics";
import { searchMeals } from "@/src/lib/services/favorites";
import { mealSearchQuerySchema } from "@/src/lib/validators/favorites";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`get:meals-search:${ip}`))) {
    return tooManyRequests();
  }

  try {
    const userId = await requireAuthenticatedUserId(request);
    const parsed = mealSearchQuerySchema.safeParse({
      q: request.nextUrl.searchParams.get("q") ?? "",
      favoritesOnly: request.nextUrl.searchParams.get("favoritesOnly") ?? false,
      limit: request.nextUrl.searchParams.get("limit") ?? 20,
    });

    if (!parsed.success) {
      return fromZodError(parsed.error);
    }

    const results = await searchMeals(userId, parsed.data);

    if (parsed.data.q.length > 0 || parsed.data.favoritesOnly) {
      await trackAnalyticsEvent(userId, "search_used", {
        query_length: parsed.data.q.length,
        favorites_only: parsed.data.favoritesOnly,
      });
    }

    return Response.json({ data: results });
  } catch (error) {
    if (error instanceof AuthError) {
      return unauthorized(error.message);
    }

    return serverError(error instanceof Error ? error.message : undefined);
  }
}

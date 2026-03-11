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
import { trackAnalyticsEvent, trackAnalyticsEventOnce } from "@/src/lib/services/analytics";
import { completeOnboarding, getUserProfile } from "@/src/lib/services/onboarding";
import { onboardingSchema } from "@/src/lib/validators/onboarding";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`get:profile-onboarding:${ip}`))) {
    return tooManyRequests();
  }

  try {
    const userId = await requireAuthenticatedUserId(request);
    const profile = await getUserProfile(userId);
    return Response.json({ data: profile });
  } catch (error) {
    if (error instanceof AuthError) {
      return unauthorized(error.message);
    }

    return serverError(error instanceof Error ? error.message : undefined);
  }
}

export async function PUT(request: NextRequest) {
  const ip = getClientIp(request);
  if (!(await checkRateLimit(`put:profile-onboarding:${ip}`))) {
    return tooManyRequests();
  }

  try {
    const userId = await requireAuthenticatedUserId(request);
    const parsed = onboardingSchema.safeParse(await request.json());

    if (!parsed.success) {
      return fromZodError(parsed.error);
    }

    const goals = await completeOnboarding(userId, parsed.data);

    await trackAnalyticsEventOnce(userId, "signup_completed", {
      goal: parsed.data.goal,
      activity_level: parsed.data.activity_level,
      source: "onboarding_flow",
    });

    await trackAnalyticsEvent(userId, "onboarding_completed", {
      goal: parsed.data.goal,
      activity_level: parsed.data.activity_level,
    });

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


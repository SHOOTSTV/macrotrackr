import { ZodError } from "zod";

export function badRequest(message: string, issues?: unknown) {
  return Response.json(
    {
      error: "bad_request",
      message,
      issues,
    },
    { status: 400 },
  );
}

export function serverError(message = "Internal server error") {
  return Response.json(
    {
      error: "internal_error",
      message,
    },
    { status: 500 },
  );
}

export function tooManyRequests() {
  return Response.json(
    {
      error: "rate_limited",
      message: "Too many requests, try again later",
    },
    { status: 429 },
  );
}

export function unauthorized(message = "Unauthorized") {
  return Response.json(
    {
      error: "unauthorized",
      message,
    },
    { status: 401 },
  );
}

export function fromZodError(error: ZodError) {
  return badRequest("Invalid payload", error.flatten());
}

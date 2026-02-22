# MacroTrackr

AI-first nutrition tracking MVP with fast meal logging, clean dashboards, and secure Supabase-backed APIs.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20RLS-3ECF8E)
![License](https://img.shields.io/badge/License-Private-lightgrey)

## Why MacroTrackr

- **Fast capture flow**: add meals instantly (AI/manual), no pending queue.
- **Useful dashboards**: daily totals, multi-day history, goal progress.
- **Secure by default**: authenticated APIs + Row Level Security + schema validation.
- **MVP-friendly architecture**: simple vertical slices, easy to iterate.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Database and Migrations](#database-and-migrations)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Routes](#routes)
- [Security Notes](#security-notes)
- [RLS Verification](#rls-verification)
- [Release Checklist](#release-checklist)
- [Troubleshooting](#troubleshooting)

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Backend**: Next.js route handlers
- **Database**: Supabase Postgres
- **Auth**: Supabase Auth
- **Validation**: Zod
- **Charts**: Recharts
- **Utilities**: date-fns
- **Package manager**: pnpm

## Quick Start

1. Copy environment template:

```bash
cp .env.example .env.local
```

2. Configure variables (see section below).
3. Install dependencies:

```bash
pnpm install
```

4. Start dev server:

```bash
pnpm dev
```

5. Open:

- `http://localhost:3000/auth`

## Environment Variables

Required in `.env.local`:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key (client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key (server only) |
| `UPSTASH_REDIS_REST_URL` | Optional | Redis URL for persistent rate limit |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Redis token for persistent rate limit |

## Database and Migrations

### Option A (quick setup)

Run `supabase/schema.sql` in Supabase SQL Editor.

### Option B (recommended)

Use versioned migrations from `supabase/migrations/`:

- `20260222151000_init_macrotrackr.sql`
- `20260222201000_drop_meal_items.sql`

Supabase CLI flow:

```bash
# one-time
pnpm exec supabase login
pnpm exec supabase link --project-ref <your-project-ref>

# apply migrations
pnpm exec supabase db push
```

Create future migration:

```bash
pnpm exec supabase migration new add_feature_name
```

## Project Structure

```text
app/                      Next.js routes and pages
src/components/           Shared UI components
src/features/             Feature modules (dashboard, profile, ...)
src/lib/                  Auth, services, validators, utilities
src/types/                Shared TypeScript models
supabase/                 SQL schema, migrations, RLS tests
scripts/                  Seed and project scripts
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm seed
```

## Routes

### UI routes

- `/auth`
- `/today`
- `/history`
- `/profile`

### API routes

- `POST /api/meals` - create meal (AI/manual)
- `PATCH /api/meals/:id` - update meal (dashboard-only via `x-dashboard-ui: 1`)
- `GET /api/dashboard/day?date=YYYY-MM-DD`
- `GET /api/dashboard/range?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /api/profile/goals`
- `PUT /api/profile/goals`

Auth header required for protected APIs:

`Authorization: Bearer <access_token>`

### Route guard behavior

- `/today`, `/history`, `/profile` -> redirect to `/auth` if no session.
- `/auth` -> redirect to `/today` when session is active.

## Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` is server-only.
- API payloads are validated with Zod.
- Rate limiting uses Upstash Redis with local-memory fallback.
- RLS is enforced via `user_id` policies in `supabase/schema.sql`.

## RLS Verification

Use:

- `supabase/tests/rls_check.sql`

Run in Supabase SQL Editor:

1. Open SQL Editor
2. Paste the script
3. Execute

The script simulates two users and checks that user B cannot access user A's rows in:

- `meals`
- `nutrition_goals`

It ends with `rollback`, so test data is not persisted.

## Release Checklist

Before shipping:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Then confirm:

- Migrations were applied: `pnpm exec supabase db push`
- Smoke test passed on `/auth`, `/today`, `/history`, `/profile`

## Troubleshooting

- **Build fails with auth/session behavior**: clear stale browser cookie `mt_access_token` and retry.
- **Supabase schema mismatch**: re-run `pnpm exec supabase db push`.
- **Rate limit weirdness in local**: if Upstash env is missing, fallback memory limiter is used.

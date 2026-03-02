# MacroTrackr

AI-first nutrition tracking MVP with fast meal logging, clean dashboards, and secure Supabase-backed APIs.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20RLS-3ECF8E)
![License](https://img.shields.io/badge/License-Private-lightgrey)

## Why MacroTrackr

- **Fast capture flow**: add meals instantly (AI/manual), no pending queue.
- **Full meal management**: edit or delete individual meals, or clear an entire day from the dashboard.
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
- [Ingest API (External AI Agent)](#ingest-api-external-ai-agent)
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
| `INGEST_SECRET` | Optional | Shared secret for the external meal ingest API (`x-ingest-key` header) |
| `APP_TIME_ZONE` | Optional | IANA time zone for date-bound queries (default: `Europe/Paris`) |
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
- `POST /api/meals/ingest` - create meal from external source (authenticated via `x-ingest-key` header)
- `PATCH /api/meals/:id` - update meal (dashboard-only via `x-dashboard-ui: 1`)
- `DELETE /api/meals/:id` - delete single meal (dashboard-only via `x-dashboard-ui: 1`)
- `DELETE /api/meals/day?date=YYYY-MM-DD` - delete all meals for a date (dashboard-only via `x-dashboard-ui: 1`)
- `GET /api/dashboard/day?date=YYYY-MM-DD`
- `GET /api/dashboard/range?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /api/profile/goals`
- `PUT /api/profile/goals`

Auth header required for session-protected APIs:

`Authorization: Bearer <access_token>`

The ingest endpoint uses a shared secret instead of user sessions:

`x-ingest-key: <INGEST_SECRET>`

### Route guard behavior

- `/today`, `/history`, `/profile` -> redirect to `/auth` if no session.
- `/auth` -> redirect to `/today` when session is active.

## Ingest API (External AI Agent)

The ingest endpoint (`POST /api/meals/ingest`) lets an external AI agent push meals into MacroTrackr on behalf of a user, without needing the user's session token.

### How it works

```text
┌──────────┐    photo     ┌──────────────┐   POST /api/meals/ingest   ┌──────────────┐
│          │  ─────────►  │              │  ────────────────────────►  │              │
│   User   │              │   AI Agent   │    x-ingest-key + JSON     │  MacroTrackr │
│          │  ◄─────────  │              │  ◄────────────────────────  │              │
└──────────┘   summary    └──────────────┘        201 Created         └──────────────┘
```

1. **User sends a photo** of their meal to an external AI agent (chatbot, mobile app, Shortcut, etc.).
2. **The AI agent analyzes the image** and extracts nutritional data (title, calories, macros).
3. **The agent POSTs to `/api/meals/ingest`** with:
   - `x-ingest-key` header set to the shared `INGEST_SECRET`.
   - A JSON body containing the user's `user_id` (UUID) and the extracted nutrition fields.
4. **MacroTrackr validates** the secret (timing-safe), parses the payload with Zod, and inserts the meal via the service-role Supabase client.
5. **The meal appears instantly** on the user's `/today` dashboard.

### Prerequisites for the AI agent

| What the agent needs | Where it comes from |
|---|---|
| `INGEST_SECRET` | Set in `.env.local`, shared with the agent securely |
| User `user_id` (UUID) | Provided by the user or resolved from their profile |

### Example request

```bash
curl -X POST https://your-app.vercel.app/api/meals/ingest \
  -H "Content-Type: application/json" \
  -H "x-ingest-key: YOUR_INGEST_SECRET" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Grilled chicken salad",
    "kcal": 420,
    "protein_g": 38,
    "carbs_g": 22,
    "fat_g": 18,
    "meal_type": "lunch",
    "author": "ai",
    "source_detail": "chatgpt-vision",
    "confidence": 0.85,
    "notes": "Photo analysis — dressing estimated"
  }'
```

### Payload reference

| Field | Type | Required | Description |
|---|---|---|---|
| `user_id` | `string` (UUID) | Yes | Target user |
| `title` | `string` | Yes | Meal name (1-180 chars) |
| `kcal` | `number` | Yes | Calories (0-10 000) |
| `protein_g` | `number` | Yes | Protein in grams (0-500) |
| `carbs_g` | `number` | Yes | Carbs in grams (0-1 000) |
| `fat_g` | `number` | Yes | Fat in grams (0-500) |
| `eaten_at` | `string` (ISO 8601 with offset) | No | Defaults to now |
| `meal_type` | `"breakfast"` \| `"lunch"` \| `"dinner"` \| `"snack"` | No | Defaults to `"snack"` |
| `author` | `"ai"` \| `"manual"` | No | Defaults to `"manual"` |
| `source_detail` | `string` | No | Free-form origin tag (e.g. `"chatgpt-vision"`) |
| `confidence` | `number` (0-1) \| `null` | No | AI confidence score |
| `notes` | `string` | No | Extra context (max 800 chars) |

### Error responses

| Status | Meaning |
|---|---|
| `400` | Invalid JSON or Zod validation failure |
| `401` | Missing or incorrect `x-ingest-key` |
| `429` | Rate limited |
| `500` | Server error (e.g. `INGEST_SECRET` not configured) |

## Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` is server-only.
- API payloads are validated with Zod (strict schemas reject unknown fields).
- Rate limiting uses Upstash Redis with local-memory fallback.
- RLS is enforced via `user_id` policies in `supabase/schema.sql`.
- The ingest endpoint authenticates via `INGEST_SECRET` using timing-safe comparison to prevent timing attacks.

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

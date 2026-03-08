# Phase 1 Audit — 2026-03-05

## Scope run today

- Static quality gates (`test`, `typecheck`, `lint`)
- Build verification
- Hosted smoke test against `https://macrotrackr.vercel.app`
- Critical streak/weekly/weight logic coverage review

## Results summary

### Local quality gates

- `npm run test` ✅ (16 tests passed)
- `npm run typecheck` ✅
- `npm run lint` ✅
- `npm run build` ✅ with env vars present

> Note: build fails early when required Supabase env vars are missing (expected behavior via `src/lib/env.ts` validation).

### Hosted smoke (`scripts/hosted-smoke.mjs`)

- Landing page reachable ✅
- `/auth` reachable ✅
- `/today` redirects to `/auth` without session ✅
- Protected APIs return `401` without bearer token ✅
- `GET /api/weight` returns `404` ❌

## P0 finding

### P0-1: `/api/weight` missing in hosted environment

- **Expected**: `401 unauthorized` when unauthenticated (route exists + auth guard)
- **Observed**: `404` in production
- **Impact**: Weight feature appears partially deployed/non-functional in production
- **Likely causes**:
  1. Deployment does not include commit adding `app/api/weight/route.ts`
  2. Vercel project points to a different branch/repo root than expected
  3. Deployment cache artifact mismatch

## Immediate action plan

1. In Vercel, verify latest deployment commit SHA includes `feat: add weight tracking...`.
2. Confirm project root is `projects/macrotrackr` and build command targets this app.
3. Trigger a clean redeploy (clear cache).
4. Re-run `node scripts/hosted-smoke.mjs` and confirm `/api/weight => 401`.

## Added assets

- `scripts/hosted-smoke.mjs` — reusable hosted smoke check script for pre-release and post-release validation.
- Extended tests:
  - `src/lib/services/progress.test.ts` (weekly target clamp coverage)
  - `src/lib/services/weight.test.ts` (unknown trend when not enough history)

## Next focus (Phase 1 continuation)

- Add integration-style tests for deletion/backfill/recompute chain
- Add timezone-sensitive scenario tests around day boundaries
- Keep nightly smoke on hosted target before further release changes

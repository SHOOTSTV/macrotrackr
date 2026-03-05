# MacroTrackr — Design: Search + Favorites (P0 Retention)

**Date:** 2026-03-04  
**Status:** Approved (Product)  
**Priority:** P0 (Sprint 1 quick win)  
**Language scope:** English UI only (current app state)

## 1) Context and Goal

MacroTrackr needs a fast reuse flow for recurring meals to improve retention. This feature delivers:

- Instant search across prior logged meals
- Favorite a logged meal for quick reuse
- 1-tap primary action: **Log now**
- Secondary action: **Edit then log**

This implements roadmap item **#4 Search + favorites aliments/repas** for MVP scope **A**:
- Favorite = a **full previously logged meal** (title + macros), not individual food items.

## 2) Scope (MVP)

### In scope
- Search experience combining:
  - favorites
  - logged meal history
- Favorites management:
  - add favorite from a logged meal
  - remove favorite
- Meal reuse flow:
  - log directly from result
  - edit before logging
- Event-based analytics
- Basic unit + light integration tests
- RLS-safe persistence

### Out of scope
- Single-food favorites (option B, future)
- Barcode / external food database
- Meal plan automation
- Advanced ranking/ML

## 3) Chosen Approach

### Selected: **Approach 1 — Favorites-first index**

Create a dedicated `favorite_meals` table and a unified search endpoint returning favorites + history.

Why selected:
- Fast time-to-value for retention
- Clean data model (favorites not mixed with raw logs)
- Easy extension later to B (single-food favorites)
- Better long-term maintainability and analytics clarity

## 4) UX Design

## Entry points
- Today flow (primary)
- Add-meal modal/section (same search component behavior)

## Search UI
- Search input with instant feedback
- Toggle: **Favorites only**
- Results list with:
  - meal title
  - macros (kcal / protein / carbs / fat)
  - favorite badge/state

## Result actions
- Primary: **Log now**
- Secondary: **Edit** (pre-filled values, then confirm log)
- Favorite star: add/remove

## UX behavior
- Default ranking:
  1. matching favorites
  2. matching recent historical meals
- Empty states:
  - no query: “Search your meals…”
  - no result: “No meals found”
- Feedback:
  - toast success/error
  - optimistic star/unstar update

## 5) Data Model & API

## Database
New table: `favorite_meals`

Suggested columns:
- `id` (uuid, pk)
- `user_id` (uuid, not null, fk auth user)
- `source_meal_id` (uuid, nullable)
- `title` (text, not null)
- `kcal` (numeric/int, not null)
- `protein_g` (numeric/int, not null)
- `carbs_g` (numeric/int, not null)
- `fat_g` (numeric/int, not null)
- `last_used_at` (timestamptz, nullable)
- `created_at` (timestamptz, default now)

Constraints/indexes:
- uniqueness guard per user + normalized signature (or equivalent anti-dup strategy)
- indexes on `(user_id, created_at desc)`
- search support index on title (or ILIKE + btree depending current DB strategy)

## API endpoints
- `POST /api/favorites`
  - add favorite from meal snapshot/logged meal
- `DELETE /api/favorites/:id`
  - remove favorite
- `GET /api/meals/search?q=...&favoritesOnly=...`
  - return normalized list from favorites + history
- `POST /api/meals/log-from-template`
  - create meal from selected result (favorite/history)

## RLS
Policies per table operation (SELECT/INSERT/DELETE) scoped by `user_id = auth.uid()`.

## 6) Analytics Plan

Required/expected events:
- `favorite_added` (required by MVP P0 acceptance)
- `meal_logged` (existing event, fired for log from search)

Recommended bonus event:
- `search_used`

Payload minimum (when applicable):
- `source`: `favorite | history`
- `query_length`
- `meal_type`
- stable user/session identifiers (following existing telemetry conventions)

## 7) Testing Strategy

## Unit tests
- query normalization / parsing
- merge/ranking logic (favorites then recency)
- API response mapper normalization

## Light integration tests
- add favorite -> appears in search
- favoritesOnly=true -> history excluded
- log from favorite -> meal persisted correctly
- auth/RLS boundary checks

## Non-regression
- existing meal logging flow remains unaffected
- existing dashboard and history routes keep current behavior

## 8) Acceptance Criteria (Feature-level)

Feature considered done when:
- UI is functional (English)
- Data persists in DB and is isolated by RLS
- required analytics are emitted
- unit + integration-light tests pass
- no regression on current meal logging UX

## 9) Rollout Notes

- Ship behind normal release process (no feature flag required unless team decides otherwise)
- Verify KPI baseline before/after:
  - D1/D7 retention
  - meals logged/user/week
  - % users with >=1 favorite
  - % active users using search reuse flow

## 10) Next step

After this approved design: create implementation plan and execute feature in Sprint 1 sequence.

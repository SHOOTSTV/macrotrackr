# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- SEO baseline setup: metadata templates, sitemap, robots directives, and dynamic Open Graph image routes (PR [#32](https://github.com/SHOOTSTV/macrotrackr/pull/32)).
- Branded Open Graph fallback image for social previews (PR [#35](https://github.com/SHOOTSTV/macrotrackr/pull/35)).

### Fixed
- Embedded-browser fallback flow for sign-in reliability (PR [#24](https://github.com/SHOOTSTV/macrotrackr/pull/24)).
- Open Graph fallback rendering and social preview compatibility (PRs [#34](https://github.com/SHOOTSTV/macrotrackr/pull/34), [#35](https://github.com/SHOOTSTV/macrotrackr/pull/35)).

### Changed
- CI workflow now uses pnpm with a clearer quality-gate pipeline (PR [#30](https://github.com/SHOOTSTV/macrotrackr/pull/30)).
- Expanded services test coverage for progress and weight edge cases (PR [#25](https://github.com/SHOOTSTV/macrotrackr/pull/25)).

## [1.3.0] - 2026-03-06

### Added
- Weight tracking in kg with a 30-day chart, 7-day trend line, and weekly change summary on Today and Profile.
- New weight API (`GET/POST /api/weight`) and `weight_logs` migrations with RLS support.

### Fixed
- Weight charts now use the latest daily log, and weight tracking remains limited to the Profile page where intended.

## [1.2.0] - 2026-03-04

### Added
- Adaptive onboarding flow (`/onboarding`) with auto-calculated nutrition goals from profile inputs.
- Mandatory onboarding gate before accessing Today, History, and Profile pages.
- Smart in-app meal log reminders based on recent logging patterns.
- Search and favorites quick-log flow for faster meal reuse.
- One-click copy previous meal with Sonner toast feedback.
- Macro budget overrun alerts with analytics tracking.
- New onboarding and favorites APIs plus the supporting `user_profile` and favorites database migrations.

### Changed
- Dashboard meal entry UX now includes reminder, quick-log, and copy-previous workflows in a single flow.

## [1.1.0] - 2026-03-03

### Added
- Streak and weekly progress MVP foundation (`user_progress`, weekly target support, and progress APIs).
- New UI cards for streak and weekly goal visibility on Today and History pages.
- Analytics event storage for `streak_day_completed` and `weekly_goal_hit`.
- Meal idempotency support to prevent duplicate inserts on retries/double submit.

### Fixed
- Included missing progress type contracts required by streak UI.

### Changed
- Progress recalculation now syncs after relevant meal operations.
- Added release QA checklist for streak/weekly rollout validation.

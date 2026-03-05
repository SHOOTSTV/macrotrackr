# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Weight tracking in kg with 30-day chart, 7-day trend line, and weekly change summary on Today + Profile.
- New weight API (`GET/POST /api/weight`) and `weight_logs` migration with RLS.
- Adaptive onboarding flow (`/onboarding`) with auto-calculated nutrition goals from profile inputs.
- Mandatory onboarding gate before accessing Today/History/Profile pages.
- New onboarding API (`GET/PUT /api/profile/onboarding`) and analytics event `onboarding_completed`.
- `user_profile` migration with RLS policies.

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

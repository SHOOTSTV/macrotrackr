-- RLS checks for MacroTrackr
-- Run this file in Supabase SQL Editor.
-- Expected: user A can access only own rows, user B cannot access A rows.

begin;

-- Pretend we are an authenticated user A.
set local role authenticated;
select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);

-- USER A: insert one meal.
insert into meals (
  user_id, author, source_detail, eaten_at, meal_type, title,
  kcal, protein_g, carbs_g, fat_g, confidence, notes
)
values (
  auth.uid()::text, 'manual', 'manual_form', now(), 'lunch', 'RLS test meal',
  500, 30, 40, 20, null, 'rls check'
)
returning id;

-- USER A: upsert goals (should work).
insert into nutrition_goals (user_id, kcal_target, protein_g_target, carbs_g_target, fat_g_target)
values (auth.uid()::text, 2200, 150, 250, 70)
on conflict (user_id) do update
set kcal_target = excluded.kcal_target
returning user_id;

-- Switch to authenticated user B.
select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', true);

-- USER B should NOT see USER A meals (expect 0 rows).
select count(*) as meals_visible_to_user_b
from meals
where title = 'RLS test meal';

-- USER B should NOT update USER A meal (expect 0 affected rows).
update meals
set title = 'HACKED'
where title = 'RLS test meal';

-- USER B should NOT see USER A goals (expect 0 rows).
select count(*) as goals_visible_to_user_b
from nutrition_goals
where user_id = '11111111-1111-1111-1111-111111111111';

-- Leave DB clean after checks.
rollback;

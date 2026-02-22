-- MacroTrackr - PostgreSQL schema for Supabase
create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'meal_author') then
    create type meal_author as enum ('ai', 'manual');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'meal_type') then
    create type meal_type as enum ('breakfast', 'lunch', 'dinner', 'snack');
  end if;
end
$$;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  author meal_author not null,
  source_detail text not null check (char_length(source_detail) <= 80),
  eaten_at timestamptz not null,
  meal_type meal_type not null,
  title text not null check (char_length(title) between 1 and 180),
  kcal numeric(10,2) not null check (kcal >= 0),
  protein_g numeric(10,2) not null check (protein_g >= 0),
  carbs_g numeric(10,2) not null check (carbs_g >= 0),
  fat_g numeric(10,2) not null check (fat_g >= 0),
  confidence numeric(4,3) null check (confidence >= 0 and confidence <= 1),
  low_confidence boolean generated always as (
    coalesce(confidence, 1) < 0.60
  ) stored,
  notes text not null default '',
  updated_from_dashboard boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists nutrition_goals (
  user_id text primary key,
  kcal_target numeric(10,2) not null check (kcal_target >= 0),
  protein_g_target numeric(10,2) not null check (protein_g_target >= 0),
  carbs_g_target numeric(10,2) not null check (carbs_g_target >= 0),
  fat_g_target numeric(10,2) not null check (fat_g_target >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_meals_user_eaten_at on meals (user_id, eaten_at desc);
create index if not exists idx_meals_low_confidence on meals (user_id, low_confidence);

drop trigger if exists trg_meals_updated_at on meals;
create trigger trg_meals_updated_at
before update on meals
for each row
execute function set_updated_at();

drop trigger if exists trg_nutrition_goals_updated_at on nutrition_goals;
create trigger trg_nutrition_goals_updated_at
before update on nutrition_goals
for each row
execute function set_updated_at();

create or replace view daily_summary
with (security_invoker = true)
as
select
  m.user_id,
  date(m.eaten_at) as day,
  count(*)::int as meals_count,
  coalesce(sum(m.kcal), 0)::numeric(10,2) as kcal_total,
  coalesce(sum(m.protein_g), 0)::numeric(10,2) as protein_total,
  coalesce(sum(m.carbs_g), 0)::numeric(10,2) as carbs_total,
  coalesce(sum(m.fat_g), 0)::numeric(10,2) as fat_total
from meals m
group by m.user_id, date(m.eaten_at);

alter table meals enable row level security;
alter table nutrition_goals enable row level security;

drop policy if exists "meals_select_own" on meals;
drop policy if exists "meals_insert_own" on meals;
drop policy if exists "meals_update_own" on meals;
drop policy if exists "meals_delete_own" on meals;
drop policy if exists "nutrition_goals_select_own" on nutrition_goals;
drop policy if exists "nutrition_goals_insert_own" on nutrition_goals;
drop policy if exists "nutrition_goals_update_own" on nutrition_goals;

create policy "meals_select_own"
on meals
for select
to authenticated
using (auth.uid()::text = user_id);

create policy "meals_insert_own"
on meals
for insert
to authenticated
with check (auth.uid()::text = user_id);

create policy "meals_update_own"
on meals
for update
to authenticated
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

create policy "meals_delete_own"
on meals
for delete
to authenticated
using (auth.uid()::text = user_id);

create policy "nutrition_goals_select_own"
on nutrition_goals
for select
to authenticated
using (auth.uid()::text = user_id);

create policy "nutrition_goals_insert_own"
on nutrition_goals
for insert
to authenticated
with check (auth.uid()::text = user_id);

create policy "nutrition_goals_update_own"
on nutrition_goals
for update
to authenticated
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

grant select on daily_summary to authenticated;

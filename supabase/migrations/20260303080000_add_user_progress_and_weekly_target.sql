alter table nutrition_goals
add column if not exists weekly_target numeric(10,2) not null default 7;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'nutrition_goals_weekly_target_range'
  ) then
    alter table nutrition_goals
    add constraint nutrition_goals_weekly_target_range
    check (weekly_target >= 1 and weekly_target <= 7);
  end if;
end
$$;

create table if not exists user_progress (
  user_id text primary key,
  timezone text not null default 'UTC' check (char_length(timezone) between 1 and 64),
  current_streak integer not null default 0 check (current_streak >= 0),
  best_streak integer not null default 0 check (best_streak >= 0),
  weekly_completed_days integer not null default 0 check (weekly_completed_days between 0 and 7),
  week_start_date date not null default (current_date),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_progress_best_gte_current check (best_streak >= current_streak)
);

drop trigger if exists trg_user_progress_updated_at on user_progress;
create trigger trg_user_progress_updated_at
before update on user_progress
for each row
execute function set_updated_at();

alter table user_progress enable row level security;

drop policy if exists "user_progress_select_own" on user_progress;
drop policy if exists "user_progress_insert_own" on user_progress;
drop policy if exists "user_progress_update_own" on user_progress;
drop policy if exists "user_progress_delete_own" on user_progress;

create policy "user_progress_select_own"
on user_progress
for select
to authenticated
using (auth.uid()::text = user_id);

create policy "user_progress_insert_own"
on user_progress
for insert
to authenticated
with check (auth.uid()::text = user_id);

create policy "user_progress_update_own"
on user_progress
for update
to authenticated
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

create policy "user_progress_delete_own"
on user_progress
for delete
to authenticated
using (auth.uid()::text = user_id);

-- Rollback reference (manual):
-- drop policy if exists "user_progress_delete_own" on user_progress;
-- drop policy if exists "user_progress_update_own" on user_progress;
-- drop policy if exists "user_progress_insert_own" on user_progress;
-- drop policy if exists "user_progress_select_own" on user_progress;
-- drop trigger if exists trg_user_progress_updated_at on user_progress;
-- drop table if exists user_progress;
-- alter table nutrition_goals drop constraint if exists nutrition_goals_weekly_target_range;
-- alter table nutrition_goals drop column if exists weekly_target;

create table if not exists user_profile (
  user_id text primary key,
  sex text not null check (sex in ('male', 'female')),
  age int not null check (age between 16 and 90),
  height_cm numeric(5,2) not null check (height_cm between 120 and 230),
  weight_kg numeric(6,2) not null check (weight_kg between 35 and 300),
  activity_level text not null check (activity_level in ('sedentary','light','moderate','active','very_active')),
  goal text not null check (goal in ('lose','maintain','gain')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_profile_goal
on user_profile (goal);

alter table user_profile enable row level security;

drop trigger if exists trg_user_profile_updated_at on user_profile;
create trigger trg_user_profile_updated_at
before update on user_profile
for each row
execute function set_updated_at();

drop policy if exists "user_profile_select_own" on user_profile;
create policy "user_profile_select_own"
on user_profile
for select
to authenticated
using (auth.uid()::text = user_id);

drop policy if exists "user_profile_insert_own" on user_profile;
create policy "user_profile_insert_own"
on user_profile
for insert
to authenticated
with check (auth.uid()::text = user_id);

drop policy if exists "user_profile_update_own" on user_profile;
create policy "user_profile_update_own"
on user_profile
for update
to authenticated
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

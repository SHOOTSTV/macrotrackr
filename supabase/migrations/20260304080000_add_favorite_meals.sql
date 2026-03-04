create table if not exists favorite_meals (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  source_meal_id uuid null references meals(id) on delete set null,
  title text not null check (char_length(title) between 1 and 180),
  kcal numeric(10,2) not null check (kcal >= 0),
  protein_g numeric(10,2) not null check (protein_g >= 0),
  carbs_g numeric(10,2) not null check (carbs_g >= 0),
  fat_g numeric(10,2) not null check (fat_g >= 0),
  signature text not null,
  last_used_at timestamptz null,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_favorite_meals_user_signature
on favorite_meals (user_id, signature);

create index if not exists idx_favorite_meals_user_created_at
on favorite_meals (user_id, created_at desc);

create index if not exists idx_favorite_meals_user_last_used_at
on favorite_meals (user_id, last_used_at desc);

alter table favorite_meals enable row level security;

drop policy if exists "favorite_meals_select_own" on favorite_meals;
create policy "favorite_meals_select_own"
on favorite_meals
for select
to authenticated
using (auth.uid()::text = user_id);

drop policy if exists "favorite_meals_insert_own" on favorite_meals;
create policy "favorite_meals_insert_own"
on favorite_meals
for insert
to authenticated
with check (auth.uid()::text = user_id);

drop policy if exists "favorite_meals_delete_own" on favorite_meals;
create policy "favorite_meals_delete_own"
on favorite_meals
for delete
to authenticated
using (auth.uid()::text = user_id);

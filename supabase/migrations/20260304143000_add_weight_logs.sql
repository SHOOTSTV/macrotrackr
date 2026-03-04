create table if not exists weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  logged_at timestamptz not null default now(),
  weight_kg numeric(6,2) not null check (weight_kg between 20 and 400),
  source text not null default 'manual' check (source in ('manual')),
  created_at timestamptz not null default now()
);

create index if not exists idx_weight_logs_user_logged_at
on weight_logs (user_id, logged_at asc);

alter table weight_logs enable row level security;

drop policy if exists "weight_logs_select_own" on weight_logs;
create policy "weight_logs_select_own"
on weight_logs
for select
to authenticated
using (auth.uid()::text = user_id);

drop policy if exists "weight_logs_insert_own" on weight_logs;
create policy "weight_logs_insert_own"
on weight_logs
for insert
to authenticated
with check (auth.uid()::text = user_id);

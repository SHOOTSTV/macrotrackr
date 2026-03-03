create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  event_name text not null check (char_length(event_name) between 1 and 80),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_analytics_events_user_created_at
on analytics_events (user_id, created_at desc);

create index if not exists idx_analytics_events_event_name
on analytics_events (event_name);

alter table analytics_events enable row level security;

drop policy if exists "analytics_events_select_own" on analytics_events;
create policy "analytics_events_select_own"
on analytics_events
for select
to authenticated
using (auth.uid()::text = user_id);

alter table meals
add column if not exists idempotency_key text;

create unique index if not exists meals_user_id_idempotency_key_key
on meals (user_id, idempotency_key)
where idempotency_key is not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'meals_idempotency_key_length'
  ) then
    alter table meals
    add constraint meals_idempotency_key_length
    check (idempotency_key is null or char_length(idempotency_key) between 1 and 128);
  end if;
end
$$;

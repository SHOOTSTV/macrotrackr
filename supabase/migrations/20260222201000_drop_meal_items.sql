-- Remove meal_items detail table now that the app keeps only meal-level macros/notes.

drop policy if exists "meal_items_select_own" on meal_items;
drop policy if exists "meal_items_write_own" on meal_items;

drop index if exists idx_meal_items_meal_id;

drop table if exists meal_items;

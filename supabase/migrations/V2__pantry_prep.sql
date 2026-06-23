-- ============================================================
-- RecipeOS — Migration V2: Pantry + Prep
-- Run AFTER V1. Paste into Supabase SQL Editor.
-- ============================================================

-- ============================================================
-- PANTRY ITEMS
-- ============================================================
create table if not exists pantry_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete set null,
  name_override text,
  quantity numeric not null default 0,
  unit text not null default 'g',
  reorder_at numeric,
  location text,
  updated_at timestamptz not null default now()
);

alter table pantry_items enable row level security;

create policy "Users can manage own pantry"
  on pantry_items for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- PREP LISTS
-- ============================================================
create table if not exists prep_lists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  recipe_id uuid references recipes(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table prep_lists enable row level security;

create policy "Users can manage own prep lists"
  on prep_lists for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- PREP TASKS
-- ============================================================
create table if not exists prep_tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prep_list_id uuid references prep_lists(id) on delete cascade,
  recipe_id uuid references recipes(id) on delete set null,
  task text not null,
  station text,
  estimated_minutes integer,
  scheduled_for timestamptz not null default now(),
  is_done boolean not null default false,
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table prep_tasks enable row level security;

create policy "Users can manage own prep tasks"
  on prep_tasks for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, display_name)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

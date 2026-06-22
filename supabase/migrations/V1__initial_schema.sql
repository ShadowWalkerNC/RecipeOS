-- ============================================================
-- RecipeOS — V1 Initial Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url   text,
  role         text not null default 'home_cook' check (role in ('home_cook', 'professional', 'admin')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ============================================================
-- CATEGORIES
-- ============================================================
create table public.categories (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null unique,
  icon       text,
  sort_order int  not null default 0
);

insert into public.categories (name, icon, sort_order) values
  ('Protein',    'flame',       1),
  ('Sauce',      'droplet',     2),
  ('Soup',       'bowl',        3),
  ('Bread',      'wheat',       4),
  ('Pastry',     'cookie',      5),
  ('Dessert',    'cake',        6),
  ('Salad',      'leaf',        7),
  ('Veg Prep',   'carrot',      8),
  ('Base',       'container',   9),
  ('Other',      'circle',      10);

-- ============================================================
-- RECIPES
-- ============================================================
create table public.recipes (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  name          text not null,
  category_id   uuid references public.categories(id),
  description   text,
  yield_amount  numeric(10,3),
  yield_unit    text,                              -- 'portions', 'ml', 'g', 'loaves', etc.
  base_servings int  not null default 1,           -- the denominator for ratio scaling
  difficulty    text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  source        text,                              -- book, URL, or 'original'
  notes         text,
  is_public     boolean not null default false,
  tags          text[]  not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_recipes_user_id    on public.recipes(user_id);
create index idx_recipes_category   on public.recipes(category_id);
create index idx_recipes_tags       on public.recipes using gin(tags);
create index idx_recipes_name_trgm  on public.recipes using gin(name gin_trgm_ops);

-- ============================================================
-- RECIPE STEPS
-- ============================================================
create table public.recipe_steps (
  id          uuid primary key default uuid_generate_v4(),
  recipe_id   uuid not null references public.recipes(id) on delete cascade,
  step_number int  not null,
  instruction text not null,
  tip         text,
  created_at  timestamptz not null default now()
);

create index idx_recipe_steps_recipe on public.recipe_steps(recipe_id, step_number);

-- ============================================================
-- INGREDIENTS MASTER LIST
-- ============================================================
create table public.ingredients (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null unique,
  default_unit     text not null default 'g',
  grams_per_cup    numeric(10,3),                 -- for gram <-> cup conversion
  category         text,                          -- 'dairy', 'protein', 'pantry', etc.
  created_at       timestamptz not null default now()
);

-- Seed common ingredients
insert into public.ingredients (name, default_unit, grams_per_cup, category) values
  ('All-Purpose Flour',  'g',    125,   'pantry'),
  ('Bread Flour',        'g',    130,   'pantry'),
  ('Cake Flour',         'g',    100,   'pantry'),
  ('Granulated Sugar',   'g',    200,   'pantry'),
  ('Brown Sugar',        'g',    220,   'pantry'),
  ('Powdered Sugar',     'g',    120,   'pantry'),
  ('Unsalted Butter',    'g',    227,   'dairy'),
  ('Whole Milk',         'ml',   240,   'dairy'),
  ('Heavy Cream',        'ml',   238,   'dairy'),
  ('Kosher Salt',        'g',    273,   'pantry'),
  ('Eggs',               'each', null,  'protein'),
  ('Egg Yolks',          'each', null,  'protein'),
  ('Olive Oil',          'ml',   216,   'pantry'),
  ('Vegetable Oil',      'ml',   218,   'pantry'),
  ('Water',              'ml',   237,   'pantry'),
  ('Baking Powder',      'g',    230,   'pantry'),
  ('Baking Soda',        'g',    288,   'pantry'),
  ('Instant Yeast',      'g',    144,   'pantry'),
  ('Vanilla Extract',    'ml',   null,  'pantry'),
  ('Chicken Stock',      'ml',   null,  'liquid'),
  ('Veal Stock',         'ml',   null,  'liquid'),
  ('White Wine',         'ml',   null,  'liquid'),
  ('Garlic',             'g',    null,  'produce'),
  ('Shallots',           'g',    null,  'produce'),
  ('Fresh Thyme',        'g',    null,  'produce');

-- ============================================================
-- RECIPE INGREDIENTS (join: recipes <-> ingredients)
-- ============================================================
create table public.recipe_ingredients (
  id            uuid primary key default uuid_generate_v4(),
  recipe_id     uuid not null references public.recipes(id) on delete cascade,
  ingredient_id uuid references public.ingredients(id),
  name_override text,                             -- if not in master list, free-text name
  amount        numeric(12,4) not null,           -- base amount (matches base_servings)
  unit          text not null,
  preparation   text,                             -- 'brunoise', 'chiffonade', 'room temp'
  is_optional   boolean not null default false,
  sort_order    int     not null default 0,
  created_at    timestamptz not null default now()
);

create index idx_ri_recipe     on public.recipe_ingredients(recipe_id, sort_order);
create index idx_ri_ingredient on public.recipe_ingredients(ingredient_id);

-- ============================================================
-- PANTRY (user's current stock)
-- ============================================================
create table public.pantry (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  ingredient_id   uuid references public.ingredients(id),
  name_override   text,
  quantity        numeric(12,3) not null default 0,
  unit            text not null,
  reorder_at      numeric(12,3),                  -- low-stock threshold
  location        text,                           -- 'walk-in', 'dry store', 'freezer'
  updated_at      timestamptz not null default now()
);

create unique index idx_pantry_user_ingredient on public.pantry(user_id, ingredient_id) where ingredient_id is not null;
create index idx_pantry_user on public.pantry(user_id);

-- ============================================================
-- PREP TASKS
-- ============================================================
create table public.prep_tasks (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null references public.profiles(id) on delete cascade,
  recipe_id          uuid references public.recipes(id) on delete set null,
  task               text not null,
  station            text,                        -- 'Sauce', 'Pastry', 'Butchery', etc.
  estimated_minutes  int,
  scheduled_for      date not null default current_date,
  is_done            boolean not null default false,
  completed_at       timestamptz,
  sort_order         int not null default 0,
  created_at         timestamptz not null default now()
);

create index idx_prep_user_date on public.prep_tasks(user_id, scheduled_for);

-- ============================================================
-- SCANNED RECIPES (raw OCR/AI results before confirmation)
-- ============================================================
create table public.recipe_scans (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  image_url    text not null,
  raw_text     text,                              -- OCR output
  parsed_json  jsonb,                             -- AI-parsed recipe structure
  status       text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected')),
  recipe_id    uuid references public.recipes(id) on delete set null, -- linked after confirmation
  created_at   timestamptz not null default now()
);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_recipes_updated_at       before update on public.recipes       for each row execute function public.set_updated_at();
create trigger trg_profiles_updated_at      before update on public.profiles      for each row execute function public.set_updated_at();
create trigger trg_pantry_updated_at        before update on public.pantry        for each row execute function public.set_updated_at();

-- ============================================================
-- RecipeOS — Migration V1: Core Schema
-- Run this in Supabase SQL Editor (Project → SQL Editor → New query)
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role text not null default 'home_cook' check (role in ('home_cook', 'professional', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- ============================================================
-- CATEGORIES
-- ============================================================
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  icon text,
  sort_order integer not null default 0
);

alter table categories enable row level security;

create policy "Categories are public read"
  on categories for select using (true);

-- ============================================================
-- RATIO BLUEPRINTS
-- ============================================================
create table if not exists ratio_blueprints (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  category text not null default '',
  ratio jsonb not null default '[]',
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table ratio_blueprints enable row level security;

create policy "Users can manage own ratio blueprints"
  on ratio_blueprints for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- RECIPES
-- ============================================================
create table if not exists recipes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category_id uuid references categories(id) on delete set null,
  description text,
  yield_amount numeric,
  yield_unit text,
  base_servings integer not null default 1,
  difficulty text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  source text,
  notes text,
  is_public boolean not null default false,
  tags text[] not null default '{}',
  ratio_id uuid references ratio_blueprints(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table recipes enable row level security;

create policy "Users can manage own recipes"
  on recipes for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Public recipes are readable by all"
  on recipes for select using (is_public = true);

-- ============================================================
-- RECIPE STEPS
-- ============================================================
create table if not exists recipe_steps (
  id uuid primary key default uuid_generate_v4(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  step_number integer not null,
  instruction text not null,
  tip text,
  created_at timestamptz not null default now()
);

alter table recipe_steps enable row level security;

create policy "Users can manage steps for own recipes"
  on recipe_steps for all
  using (exists (select 1 from recipes where recipes.id = recipe_steps.recipe_id and recipes.user_id = auth.uid()))
  with check (exists (select 1 from recipes where recipes.id = recipe_steps.recipe_id and recipes.user_id = auth.uid()));

-- ============================================================
-- INGREDIENTS (global lookup table)
-- ============================================================
create table if not exists ingredients (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  default_unit text not null default 'g',
  grams_per_cup numeric,
  category text
);

alter table ingredients enable row level security;

create policy "Ingredients are public read"
  on ingredients for select using (true);

-- ============================================================
-- RECIPE INGREDIENTS
-- ============================================================
create table if not exists recipe_ingredients (
  id uuid primary key default uuid_generate_v4(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete set null,
  name_override text,
  amount numeric not null,
  unit text not null,
  preparation text,
  is_optional boolean not null default false,
  ratio_part text,
  sort_order integer not null default 0
);

alter table recipe_ingredients enable row level security;

create policy "Users can manage ingredients for own recipes"
  on recipe_ingredients for all
  using (exists (select 1 from recipes where recipes.id = recipe_ingredients.recipe_id and recipes.user_id = auth.uid()))
  with check (exists (select 1 from recipes where recipes.id = recipe_ingredients.recipe_id and recipes.user_id = auth.uid()));

-- ============================================================
-- RecipeOS — V2 Row Level Security Policies
-- ============================================================

-- Enable RLS on all user-facing tables
alter table public.profiles        enable row level security;
alter table public.recipes         enable row level security;
alter table public.recipe_steps    enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.pantry          enable row level security;
alter table public.prep_tasks      enable row level security;
alter table public.recipe_scans    enable row level security;

-- categories and ingredients are read-only reference data (no RLS needed)
alter table public.categories  enable row level security;
alter table public.ingredients enable row level security;

create policy "categories_public_read" on public.categories  for select using (true);
create policy "ingredients_public_read" on public.ingredients for select using (true);

-- ---- PROFILES ----
create policy "profiles_select_own"  on public.profiles for select  using (auth.uid() = id);
create policy "profiles_insert_own"  on public.profiles for insert  with check (auth.uid() = id);
create policy "profiles_update_own"  on public.profiles for update  using (auth.uid() = id);

-- ---- RECIPES ----
-- Own recipes: full CRUD
create policy "recipes_select_own"   on public.recipes for select  using (auth.uid() = user_id);
create policy "recipes_select_public" on public.recipes for select  using (is_public = true);
create policy "recipes_insert_own"   on public.recipes for insert  with check (auth.uid() = user_id);
create policy "recipes_update_own"   on public.recipes for update  using (auth.uid() = user_id);
create policy "recipes_delete_own"   on public.recipes for delete  using (auth.uid() = user_id);

-- ---- RECIPE STEPS ----
create policy "steps_select" on public.recipe_steps for select
  using (exists (select 1 from public.recipes r where r.id = recipe_id and (r.user_id = auth.uid() or r.is_public)));
create policy "steps_insert" on public.recipe_steps for insert
  with check (exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = auth.uid()));
create policy "steps_update" on public.recipe_steps for update
  using (exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = auth.uid()));
create policy "steps_delete" on public.recipe_steps for delete
  using (exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = auth.uid()));

-- ---- RECIPE INGREDIENTS ----
create policy "ri_select" on public.recipe_ingredients for select
  using (exists (select 1 from public.recipes r where r.id = recipe_id and (r.user_id = auth.uid() or r.is_public)));
create policy "ri_insert" on public.recipe_ingredients for insert
  with check (exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = auth.uid()));
create policy "ri_update" on public.recipe_ingredients for update
  using (exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = auth.uid()));
create policy "ri_delete" on public.recipe_ingredients for delete
  using (exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = auth.uid()));

-- ---- PANTRY ----
create policy "pantry_select_own" on public.pantry for select  using (auth.uid() = user_id);
create policy "pantry_insert_own" on public.pantry for insert  with check (auth.uid() = user_id);
create policy "pantry_update_own" on public.pantry for update  using (auth.uid() = user_id);
create policy "pantry_delete_own" on public.pantry for delete  using (auth.uid() = user_id);

-- ---- PREP TASKS ----
create policy "prep_select_own" on public.prep_tasks for select  using (auth.uid() = user_id);
create policy "prep_insert_own" on public.prep_tasks for insert  with check (auth.uid() = user_id);
create policy "prep_update_own" on public.prep_tasks for update  using (auth.uid() = user_id);
create policy "prep_delete_own" on public.prep_tasks for delete  using (auth.uid() = user_id);

-- ---- RECIPE SCANS ----
create policy "scans_select_own" on public.recipe_scans for select  using (auth.uid() = user_id);
create policy "scans_insert_own" on public.recipe_scans for insert  with check (auth.uid() = user_id);
create policy "scans_update_own" on public.recipe_scans for update  using (auth.uid() = user_id);
create policy "scans_delete_own" on public.recipe_scans for delete  using (auth.uid() = user_id);

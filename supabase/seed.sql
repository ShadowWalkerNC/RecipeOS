-- ============================================================
-- RecipeOS — Seed Data (development only)
-- ============================================================
-- Run after migrations. Creates a demo user + sample recipes.
-- DO NOT run in production.

-- Demo profile (insert via auth if needed, or use service role)
-- Assumes auth user with id '00000000-0000-0000-0000-000000000001' exists

insert into public.profiles (id, display_name, role) values
  ('00000000-0000-0000-0000-000000000001', 'Chef Demo', 'professional')
  on conflict (id) do nothing;

-- ---- RECIPE 1: Beurre Blanc ----
with r as (
  insert into public.recipes (id, user_id, name, description, yield_amount, yield_unit, base_servings, difficulty, source)
  values (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Classic Beurre Blanc',
    'A classic French emulsified butter sauce. Base recipe yields 500ml.',
    500, 'ml', 4, 'Advanced', 'Escoffier'
  )
  returning id
)
insert into public.recipe_ingredients (recipe_id, name_override, amount, unit, preparation, sort_order)
select r.id, ing.name, ing.amount, ing.unit, ing.prep, ing.sort
from r,
(values
  ('Shallots',       80,   'g',   'finely minced',  1),
  ('White Wine',     200,  'ml',  null,             2),
  ('White Wine Vinegar', 60, 'ml', null,            3),
  ('Unsalted Butter',400,  'g',   'cold, cubed',    4),
  ('Kosher Salt',    5,    'g',   null,             5),
  ('White Pepper',   2,    'g',   null,             6)
) as ing(name, amount, unit, prep, sort);

-- Steps for Beurre Blanc
insert into public.recipe_steps (recipe_id, step_number, instruction, tip) values
  ('10000000-0000-0000-0000-000000000001', 1, 'Combine shallots, white wine, and vinegar in a saucepan. Reduce over medium heat until nearly dry (au sec) — about 2 tablespoons remain.', 'Do not let it burn. Low and slow.'),
  ('10000000-0000-0000-0000-000000000001', 2, 'Reduce heat to lowest setting. Begin whisking in cold butter cubes one at a time, adding each before the previous is fully melted.', 'Butter must stay cold — the emulsion breaks above 70°C.'),
  ('10000000-0000-0000-0000-000000000001', 3, 'Continue until all butter is incorporated and sauce is creamy and coats a spoon.', null),
  ('10000000-0000-0000-0000-000000000001', 4, 'Strain through fine-mesh sieve. Season with salt and white pepper. Serve immediately.', 'Hold warm in a bain-marie if needed, not on direct heat.');

-- ---- RECIPE 2: Buttermilk Fried Chicken ----
with r as (
  insert into public.recipes (id, user_id, name, description, yield_amount, yield_unit, base_servings, difficulty)
  values (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Buttermilk Fried Chicken',
    'Southern-style crispy fried chicken with a 24-hour buttermilk brine.',
    4, 'portions', 4, 'Intermediate'
  )
  returning id
)
insert into public.recipe_ingredients (recipe_id, name_override, amount, unit, preparation, sort_order)
select r.id, ing.name, ing.amount, ing.unit, ing.prep, ing.sort
from r,
(values
  ('Chicken Thighs', 800,  'g',   'bone-in, skin-on', 1),
  ('Buttermilk',     500,  'ml',  null,               2),
  ('All-Purpose Flour', 300, 'g', null,               3),
  ('Kosher Salt',    12,   'g',   null,               4),
  ('Black Pepper',   6,    'g',   'ground',           5),
  ('Smoked Paprika', 8,    'g',   null,               6),
  ('Garlic Powder',  4,    'g',   null,               7),
  ('Cayenne',        2,    'g',   null,               8),
  ('Vegetable Oil',  1000, 'ml',  'for frying',       9)
) as ing(name, amount, unit, prep, sort);

-- ---- PANTRY SEED ----
insert into public.pantry (user_id, name_override, quantity, unit, reorder_at, location) values
  ('00000000-0000-0000-0000-000000000001', 'All-Purpose Flour',  12500, 'g',   2000, 'dry store'),
  ('00000000-0000-0000-0000-000000000001', 'Unsalted Butter',    1200,  'g',   500,  'walk-in'),
  ('00000000-0000-0000-0000-000000000001', 'Whole Eggs',         24,    'each', 6,   'walk-in'),
  ('00000000-0000-0000-0000-000000000001', 'Kosher Salt',        300,   'g',   100,  'dry store'),
  ('00000000-0000-0000-0000-000000000001', 'Heavy Cream',        4000,  'ml',  500,  'walk-in'),
  ('00000000-0000-0000-0000-000000000001', 'White Wine',         2000,  'ml',  500,  'dry store'),
  ('00000000-0000-0000-0000-000000000001', 'Vegetable Oil',      5000,  'ml',  1000, 'dry store');

-- ---- PREP TASKS SEED ----
insert into public.prep_tasks (user_id, task, station, estimated_minutes, scheduled_for) values
  ('00000000-0000-0000-0000-000000000001', 'Brine 20 chicken thighs in buttermilk overnight',    'Butchery', 20,  current_date),
  ('00000000-0000-0000-0000-000000000001', 'Reduce veal stock to demi-glace (2L → 500ml)',        'Sauce',    90,  current_date),
  ('00000000-0000-0000-0000-000000000001', 'Scale brioche dough x3, proof 1 hour',                'Pastry',   30,  current_date),
  ('00000000-0000-0000-0000-000000000001', 'Brunoise 5kg mirepoix (onion, carrot, celery)',        'Veg Prep', 60,  current_date),
  ('00000000-0000-0000-0000-000000000001', 'Portion 4kg salmon at 180g each, vacuum seal',         'Fish',     40,  current_date);

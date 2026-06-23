-- =============================================================
-- RecipeOS — Demo Seed Data
-- =============================================================
-- 1. Create a user in Supabase Auth: demo@recipeos.app
-- 2. Copy the UUID from Authentication → Users
-- 3. Replace every occurrence of DEMO_USER_ID below with that UUID
-- 4. Run this file in Supabase → SQL Editor
-- =============================================================

-- Recipes
INSERT INTO recipes (id, user_id, name, description, base_servings, difficulty, tags, is_public, yield_amount, yield_unit)
VALUES
  (gen_random_uuid(), 'DEMO_USER_ID', 'Classic Vinaigrette', 'A simple 3:1 oil-to-acid ratio dressing. Endlessly adaptable.', 4, 'Beginner', ARRAY['dressing', 'quick', 'vegan'], true, 4, 'tbsp'),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Overnight Focaccia', 'High-hydration dough with a long cold ferment for maximum flavour.', 8, 'Intermediate', ARRAY['bread', 'baking', 'italian'], true, 1, 'loaf'),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Roast Chicken Stock', 'Rich, golden stock from roasted carcasses. Freeze in 500ml portions.', 6, 'Beginner', ARRAY['stock', 'batch-cook', 'savory'], true, 2, 'litres'),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Chocolate Ganache', '2:1 chocolate-to-cream ratio. Works as glaze, truffle base, or frosting.', 8, 'Beginner', ARRAY['dessert', 'chocolate', 'sauce'], true, 1, 'cup'),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Herb Compound Butter', 'Softened butter blended with garlic, parsley, and lemon. Roll and freeze.', 12, 'Beginner', ARRAY['condiment', 'butter', 'freeze-ahead'], true, 200, 'g');

-- Pantry items
INSERT INTO pantry_items (id, user_id, name_override, quantity, unit, reorder_at)
VALUES
  (gen_random_uuid(), 'DEMO_USER_ID', 'All-purpose flour', 2000, 'g', 500),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Extra virgin olive oil', 750, 'ml', 200),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Unsalted butter', 450, 'g', 100),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Eggs', 6, '', 2),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Whole milk', 200, 'ml', 250),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Dark chocolate (70%)', 150, 'g', 100),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Heavy cream', 120, 'ml', 150),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Kosher salt', 800, 'g', 200),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Instant dry yeast', 50, 'g', 15),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Garlic', 3, 'heads', 1);

-- Prep list
INSERT INTO prep_lists (id, user_id, name)
VALUES
  ('DEMO_PREP_LIST_ID', 'DEMO_USER_ID', 'Sunday Batch Cook');

-- Prep tasks (replace DEMO_PREP_LIST_ID with the UUID you chose above)
INSERT INTO prep_tasks (id, user_id, task, station, estimated_minutes, scheduled_for, is_done, sort_order, prep_list_id)
VALUES
  (gen_random_uuid(), 'DEMO_USER_ID', 'Roast chicken carcasses at 220°C for 30 min', 'Oven', 35, NOW(), false, 1, 'DEMO_PREP_LIST_ID'),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Make focaccia dough and refrigerate overnight', 'Prep', 20, NOW(), false, 2, 'DEMO_PREP_LIST_ID'),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Prepare compound butter and roll in cling film', 'Prep', 10, NOW(), true, 3, 'DEMO_PREP_LIST_ID'),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Make ganache and portion into ramekins', 'Pastry', 15, NOW(), false, 4, 'DEMO_PREP_LIST_ID'),
  (gen_random_uuid(), 'DEMO_USER_ID', 'Whisk vinaigrette and store in jar', 'Cold', 5, NOW(), true, 5, 'DEMO_PREP_LIST_ID');

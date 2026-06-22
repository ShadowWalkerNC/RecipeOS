# RecipeOS — Supabase Schema

## Tables

| Table | Description |
|---|---|
| `profiles` | Extends `auth.users` — display name, role |
| `categories` | Recipe categories (Sauce, Protein, Bread, etc.) |
| `recipes` | Core recipe records with yield and base servings |
| `recipe_steps` | Ordered method steps per recipe |
| `ingredients` | Master ingredient list with unit conversions |
| `recipe_ingredients` | Join table: recipe ↔ ingredients with amounts |
| `pantry` | User’s current stock levels with reorder thresholds |
| `prep_tasks` | Daily kitchen prep checklist items |
| `recipe_scans` | Raw OCR/AI scan results pending confirmation |

## Key Design Decisions

- **`base_servings`** on `recipes` is the ratio denominator — all ingredient amounts are stored at this yield. The ratio engine scales from this.
- **`recipe_ingredients.amount`** is always a numeric (never a string) so the scaling math is clean.
- **`grams_per_cup`** on `ingredients` powers the g ↔ cups converter.
- **`pantry.reorder_at`** threshold drives low-stock detection and shopping list generation.
- RLS locks every user to their own data. Public recipes are readable by all authenticated users.

## Running Migrations

```bash
# Using Supabase CLI
supabase db push

# Or apply manually in SQL editor:
# 1. supabase/migrations/V1__initial_schema.sql
# 2. supabase/migrations/V2__rls_policies.sql
# 3. supabase/seed.sql (dev only)
```

## Applying to Your Project

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `mobile/.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJh...
   ```
3. Run migrations in order
4. Run seed.sql for dev data

# RecipeOS MCP Tools

> Version 2.0.0 — Updated June 2026

The RecipeOS MCP server exposes 9 tools across 4 domains. All tools communicate with the RecipeOS REST API via bearer token authentication.

## Setup

```bash
cd mcp
npm install
```

Create a `.env` file in `mcp/`:

```env
RECIPEOS_API_URL=https://recipeos.onrender.com
RECIPEOS_API_KEY=your-api-key-here
```

Run the server:

```bash
npx ts-node recipeos-server.ts
```

---

## Recipe Tools

### `get_recipe`
Search recipes by name or keyword.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | ✅ | Name or keyword to search |
| `category` | string | ❌ | Optional category filter |

**Returns:** Array of matching recipe objects with ingredients and category.

---

### `add_recipe`
Add a new recipe to the vault.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | ✅ | Recipe name |
| `description` | string | ❌ | Short description |
| `base_servings` | number | ❌ | Default serving count (default: 4) |
| `difficulty` | string | ❌ | `Beginner`, `Intermediate`, or `Advanced` |
| `tags` | string[] | ❌ | Array of tag strings |
| `yield_amount` | number | ❌ | Yield quantity |
| `yield_unit` | string | ❌ | Yield unit (e.g. `loaf`, `cups`) |

**Returns:** Created recipe object.

---

### `scale_recipe`
Scale a recipe’s ingredients from base to target servings.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `recipe_id` | string | ✅ | UUID of the recipe |
| `base_servings` | number | ✅ | Original serving count |
| `target_servings` | number | ✅ | Desired serving count |

**Returns:** Recipe name, scale factor, and array of scaled ingredients.

---

### `search_by_ingredient`
Find recipes that contain a specific ingredient.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ingredient` | string | ✅ | Ingredient name to search for |

**Returns:** Array of matching recipes.

---

## Pantry Tools

### `get_pantry`
Get current pantry stock.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `low_stock_only` | boolean | ❌ | If `true`, return only items at or below reorder threshold |

**Returns:** Array of pantry items with `isLow` flag.

---

### `update_pantry`
Update quantity for a pantry item.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `item_id` | string | ✅ | UUID of the pantry item |
| `quantity` | number | ✅ | New quantity value |

**Returns:** Updated pantry item.

---

### `get_shopping_list`
Get all pantry items that need restocking.

**Returns:** `{ items: PantryItem[], count: number }` — items at or below their `reorder_at` threshold.

---

## Prep Tools

### `generate_prep_list`
Generate a kitchen prep list for a given date.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date` | string | ❌ | Target date `YYYY-MM-DD`. Defaults to today. |

**Returns:** Prep tasks grouped by station for the given date.

---

## Conversion Tools

### `convert_units`
Convert between weight and volume units for common baking ingredients.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `value` | number | ✅ | Numeric value to convert |
| `from_unit` | string | ✅ | Source unit (`g`, `grams`, `cups`, `cup`) |
| `to_unit` | string | ✅ | Target unit |
| `ingredient` | string | ❌ | Ingredient name for density lookup (e.g. `flour`, `sugar`, `butter`) |

**Supported conversions:** `grams ↔ cups` for flour, sugar, butter, salt, rice, oats.

**Returns:** `{ value, fromUnit, toUnit, ingredient, result }`

---

## Error Handling

All tools return `{ isError: true, content: [{ type: 'text', text: 'Error: ...' }] }` on failure. API errors include the HTTP status code and path.

# RecipeOS — Project Plan

> v2.0 — Updated June 22, 2026
> Stack: TypeScript · React Native + Expo · Supabase · Commander.js · MCP

---

## Phase 0 — Migration & Scaffold ✅ Complete

- [x] Scaffold React Native + Expo mobile app (`mobile/`)
- [x] Implement ratio-based scaling engine (`mobile/lib/ratio-engine.ts`)
- [x] Implement 5 core screens: Recipe Vault, Scale, Pantry, Prep List, Scan
- [x] Scaffold `recipe-cli` with 5 command groups
- [x] Scaffold MCP server with 9 tools
- [x] Rewrite README, ARCHITECTURE, PROJECT_PLAN to reflect TypeScript stack

---

## Phase 1 — Core Data + Screens 🔄 In Progress (target: Aug 2026)

### Supabase Schema
- [ ] Write migration: `ratio_blueprints`, `recipes`, `recipe_ingredients`
- [ ] Write migration: `pantry_items`, `prep_lists`, `prep_tasks`
- [ ] Seed: Basic Donut Dough as a RatioBlueprint with a Half Baked variant
- [ ] Enable Row Level Security on all tables (user_id scoping)

### Mobile — Live Data
- [ ] Wire Recipe Vault screen to TanStack Query + Supabase
- [ ] Wire Pantry screen to TanStack Query + Supabase
- [ ] Wire Prep List screen to TanStack Query + Supabase
- [ ] Implement Expo SQLite offline queue + sync engine
- [ ] Google Sign-In → Supabase Auth

### CLI — Core Commands
- [ ] `recipe list` — list all recipes
- [ ] `recipe show <name>` — display recipe with scaled output
- [ ] `pantry list` — show current inventory
- [ ] `prep generate <recipe>` — output prep list to terminal
- [ ] `sync` — push local changes to Supabase

### MCP Server — Wire Tools
- [ ] Connect all 10 tools to live Supabase data
- [ ] Add auth (service role key for CulinaryOS agent)
- [ ] Write tool schemas and descriptions for CulinaryOS discovery

---

## Phase 2 — Pro Kitchen Tools ⏳ Pending (target: Oct 2026)

- [ ] Barcode scan → Open Food Facts API → create PantryItem
- [ ] Scan-a-Recipe: Camera → Expo OCR → Gemini parse → pre-filled form
- [ ] Ingredient AI suggestions: select pantry items → Gemini recipe ideas
- [ ] Density-aware unit conversion (flour, sugar, butter, cream, oil lookup)
- [ ] Prep list template save/load
- [ ] Time-block view for prep tasks
- [ ] Missing ingredient detection → grocery list export
- [ ] EAS Build setup for Google Play + App Store

---

## Phase 3 — Intelligence & Sync ⏳ Pending (target: Dec 2026)

- [ ] AI skill-level adaptation: Gemini adapts instructions by skill level → stored as recipe variant
- [ ] Recipe card PDF export + share sheet
- [ ] Prep list checklist PDF export
- [ ] Cross-device sync via Supabase Realtime
- [ ] Conflict resolution: last-write-wins with `updated_at` timestamps
- [ ] Offline sync stress testing

---

## Phase 4 — CulinaryOS Integration ⏳ Pending (target: 2027)

- [ ] MCP server registered as CulinaryOS extension
- [ ] Recipe → CulinaryOS MenuItem sync via `sync_menu_item` tool
- [ ] PantryItem → CulinaryOS purchasing module bridge
- [ ] PrepList → CulinaryOS labor/shift planning
- [ ] Recipe steps stream to KDS display via CulinaryOS WebSocket
- [ ] Joint auth: CulinaryOS JWT accepted by RecipeOS Supabase Edge Function

---

## Ratio Blueprint Data Model

The schema everything else depends on:

```typescript
// ratio_blueprints
interface RatioBlueprint {
  id: string           // UUID
  name: string         // "Basic Vinaigrette"
  description: string
  category: string     // "Dressing" | "Bread" | "Pastry" | "Sauce"
  ratio: RatioPart[]   // [{part: "fat", ratio: 3}, {part: "acid", ratio: 1}]
  notes: string
  created_at: string
  user_id: string
}

// recipes
interface Recipe {
  id: string
  title: string
  description: string
  skill_level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "PRO"
  cuisine: string
  servings: number
  yield_unit: string   // "servings" | "oz" | "loaves"
  ratio_id?: string    // FK → ratio_blueprints (null = standalone)
  is_blueprint: boolean
  instructions: RecipeStep[]
  tags: string[]
  created_at: string
  user_id: string
}

// recipe_ingredients
interface RecipeIngredient {
  id: string
  recipe_id: string
  name: string
  amount: number
  unit: string         // g | oz | cup | tbsp | tsp | ml | l | lb | kg | piece
  ratio_part?: string  // "fat" | "acid" — links to blueprint ratio
  notes: string
}

// pantry_items
interface PantryItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  barcode?: string
  updated_at: string
  user_id: string
}
```

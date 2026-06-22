# RecipeOS — Architecture

> v3.0 — Updated June 22, 2026

---

## Governing Constraint

RecipeOS is a **TypeScript-first, offline-capable culinary toolkit** that operates as both a standalone app and an MCP server extension to CulinaryOS. Every architectural decision must serve two masters: the solo chef using the mobile app, and the professional kitchen integrating with CulinaryOS.

**The hardest requirement:** Core recipe and prep functionality must work with zero internet connectivity.

---

## Platform Surface Map

| Client | Platform | Users | Connectivity |
|---|---|---|
---|
| Mobile App | React Native + Expo (iOS + Android) | Chefs, home cooks, food entrepreneurs | Offline-first |
| CLI | Node.js / Commander.js | Power users, automation, scripting | Online preferred |
| MCP Server | TypeScript / Node.js | CulinaryOS AI agent, LLM tool calls | Online required |

All three surfaces share the same TypeScript codebase and Supabase backend.

This split is intentional:
- **Mobile** needs offline capability, camera access (scan-a-recipe), and native UX.
- **CLI** enables scripting, CI pipelines, and headless automation.
- **MCP Server** exposes RecipeOS data and tools to CulinaryOS and AI agents as callable functions.

---

## Stack Decisions

### Mobile — React Native + Expo

- **React Native + Expo SDK 52** — iOS + Android from a single TypeScript codebase
- **Expo Router** — file-based navigation
- **Zustand** — lightweight client state (auth, UI state)
- **TanStack Query** — server state, caching, background sync
- **Expo SQLite** — local offline queue; survives crashes and reboots
- **Expo Camera + OCR** — scan-a-recipe feature (Phase 2)
- **EAS Build** — Google Play + App Store CI/CD

### CLI — Commander.js

- `recipe-cli` built on **Commander.js**
- Five command groups: `recipe`, `pantry`, `prep`, `scale`, `sync`
- Talks directly to Supabase via service role key
- Designed for power users and automation pipelines

### MCP Server — TypeScript

- **`mcp/recipeos-server.ts`** — 10 MCP tools exposed to CulinaryOS and AI agents
- Authenticated via **CulinaryOS JWT** (Phase 4) or service role key (Phase 1–3)
- Tool discovery schema written for CulinaryOS's extension registry
- Tools cover: recipe CRUD, pantry queries, prep list generation, ratio scaling, ingredient suggestions

### Backend — Supabase

- **PostgreSQL** via Supabase — ACID, UUID PKs, Row Level Security on all tables
- **Supabase Auth** — Google Sign-In → JWT; `user_id` scoping enforced on every table
- **Supabase Realtime** — cross-device sync (Phase 3)
- **Supabase Edge Functions** — CulinaryOS joint auth bridge (Phase 4)
- **Supabase JS SDK** — used by mobile, CLI, and MCP server

---

## Local-First Architecture

### The Rule

```
Write to Expo SQLite first → apply to UI immediately → sync to Supabase in background
```

No user action in the mobile app waits for a network round-trip.

### Offline Event Flow

```
User action (e.g. add recipe)
  ↓
Local Expo SQLite write
  ↓
UI updated optimistically
  ↓
Sync engine (background task) picks it up
  ↓
Supabase upsert → conflict resolved by updated_at (last-write-wins)
  ↓
Local record marked synced
```

### Connectivity States

| State | Mobile Behavior |
|---|---|
| Online | Changes sync in real time via Supabase Realtime |
| Offline | Changes queue locally; UI works normally |
| Reconnecting | Queue drains automatically; catch-up from Supabase |

---

## Data Model

The schema everything else depends on:

```typescript
// ratio_blueprints — the core abstraction
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

// recipes — instances of blueprints, or standalone
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

// prep_lists / prep_tasks
interface PrepList {
  id: string
  name: string
  recipe_id?: string
  created_at: string
  user_id: string
}

interface PrepTask {
  id: string
  prep_list_id: string
  description: string
  duration_minutes: number
  completed: boolean
  order: number
}
```

---

## Repository Structure

```
RecipeOS/
├── mobile/                        ← React Native + Expo app (iOS + Android)
│   ├── app/                         ← Expo Router screens
│   │   ├── (tabs)/
│   │   │   ├── vault.tsx              ← Recipe Vault screen
│   │   │   ├── scale.tsx              ← Ratio scaling screen
│   │   │   ├── pantry.tsx             ← Pantry tracker screen
│   │   │   ├── prep.tsx               ← Prep list builder screen
│   │   │   └── scan.tsx               ← Scan-a-recipe screen
│   │   └── _layout.tsx
│   ├── lib/
│   │   ├── ratio-engine.ts            ← Ratio blueprint scaling logic
│   │   ├── supabase.ts                ← Supabase client
│   │   ├── offline-queue.ts           ← Expo SQLite sync engine
│   │   └── ai.ts                      ← Gemini API calls (isolated)
│   ├── store/                         ← Zustand state stores
│   └── components/                    ← Shared UI components
├── cli/                           ← recipe-cli (Commander.js)
│   ├── commands/
│   │   ├── recipe.ts
│   │   ├── pantry.ts
│   │   ├── prep.ts
│   │   ├── scale.ts
│   │   └── sync.ts
│   └── index.ts
├── mcp/                           ← MCP server (CulinaryOS integration)
│   ├── recipeos-server.ts           ← 10 MCP tools
│   ├── tools/
│   │   ├── recipe-tools.ts
│   │   ├── pantry-tools.ts
│   │   ├── prep-tools.ts
│   │   └── scale-tools.ts
│   └── auth.ts                      ← CulinaryOS JWT bridge
├── supabase/
│   ├── migrations/                  ← Numbered SQL migrations
│   └── seed.sql                     ← Dev seed data
├── ARCHITECTURE.md                ← you are here
├── MIGRATION.md                   ← Kotlin → TypeScript migration log
├── PROJECT_PLAN.md                ← Phase-by-phase build plan
└── README.md
```

---

## CulinaryOS Integration

RecipeOS connects to CulinaryOS as a registered MCP extension. The integration surface (Phase 4):

| RecipeOS | → | CulinaryOS |
|---|---|---|
| Recipe | → | MenuItem sync via `sync_menu_item` tool |
| PantryItem | → | Purchasing module bridge |
| PrepList | → | Labor/shift planning |
| Recipe steps | → | KDS display via WebSocket |
| Auth | → | CulinaryOS JWT accepted by Supabase Edge Function |

---

## System Rules

1. **Offline-First:** Mobile app writes to Expo SQLite first; Supabase sync is always background.
2. **AI Isolation:** Gemini API calls live exclusively in `mobile/lib/ai.ts`. They enhance but are never required for core functionality.
3. **Single Source of Truth:** TanStack Query manages all server state. UI observes query results only.
4. **Ratio-First:** The application prioritizes RatioBlueprints. Recipes are variants that inherit proportional logic for intelligent scaling.
5. **user_id Scoping:** Every Supabase table has Row Level Security. Every query is scoped by `user_id`. An unscoped query is a critical bug.
6. **TypeScript Everywhere:** Mobile, CLI, and MCP server all share TypeScript. No language boundary between surfaces.

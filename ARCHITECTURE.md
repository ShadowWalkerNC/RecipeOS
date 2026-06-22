# RecipeOS — Architecture

> v2.0 — Updated June 22, 2026

---

## Governing Constraint

RecipeOS must work in a professional kitchen environment: no reliable internet, fast-moving staff, zero tolerance for data loss.

**The hardest requirement:** A chef must be able to create a recipe, scale it, and generate a prep list with zero network connectivity.

---

## Platform Surface Map

| Surface | Platform | Users | Connectivity |
|---|---|---|---|
| Mobile App | iOS + Android (React Native/Expo) | Chefs, Home cooks | Offline-first |
| CLI (`recipe-cli`) | macOS, Linux, Windows | Power users, operators | Online preferred |
| MCP Server (`recipeos-server`) | Any (Node.js) | CulinaryOS AI agent | Online required |

All three surfaces share the same TypeScript codebase and Supabase backend.

---

## Repository Structure

```
RecipeOS/
├── mobile/                        ← React Native + Expo SDK 52
│   ├── app/                       ← Expo Router screens
│   │   ├── (tabs)/
│   │   │   ├── index.tsx          ← Recipe Vault
│   │   │   ├── scale.tsx          ← Scaling engine UI
│   │   │   ├── pantry.tsx         ← Pantry tracker
│   │   │   ├── prep.tsx           ← Prep list builder
│   │   │   └── scan.tsx           ← Scan-a-recipe
│   ├── lib/
│   │   ├── ratio-engine.ts        ← Ratio-aware scaling logic
│   │   ├── ai/                    ← Gemini API calls (isolated)
│   │   ├── db/                    ← Expo SQLite schema + queries
│   │   ├── store/                 ← Zustand state stores
│   │   └── supabase/              ← Supabase client + sync
│   └── components/                ← Shared React Native components
├── cli/                           ← recipe-cli (Commander.js)
│   ├── src/
│   │   ├── commands/              ← recipe, pantry, prep, scale, sync
│   │   └── index.ts               ← CLI entry point
├── mcp/                           ← MCP server (CulinaryOS integration)
│   ├── src/
│   │   ├── tools/                 ← 10 MCP tool definitions
│   │   └── recipeos-server.ts     ← MCP server entry point
├── supabase/                      ← Supabase migrations + edge functions
│   ├── migrations/
│   └── functions/
├── .env.example
├── README.md
├── ARCHITECTURE.md                ← this file
├── MIGRATION.md
└── PROJECT_PLAN.md
```

---

## Stack Decisions

### React Native + Expo — Mobile

React Native + Expo was chosen over Kotlin/Compose for full platform support (iOS + Android from one codebase) and alignment with the ShadowWalkerNC TypeScript standard across all GUI + CLI + MCP surfaces.

Key libraries:
- **Expo Router** — file-based navigation
- **Expo SQLite** — local offline-first database (replaces Room)
- **Expo Camera** — barcode scan + scan-a-recipe
- **TanStack Query** — server state, background sync
- **Zustand** — lightweight local UI state
- **Supabase JS SDK** — auth + cloud sync

### Offline-First Rule

```
Write to Expo SQLite first → update UI immediately → sync to Supabase in background
```

No user action in the mobile app waits for a network round-trip.
The sync engine pushes local changes to Supabase on reconnect.

### AI Isolation Rule

All Gemini API calls live exclusively in `mobile/lib/ai/`.
AI enhances the experience but is never required for core functionality.
Every AI feature has a manual fallback.

### Ratio-First Data Model

Every recipe is either:
- A **Ratio Blueprint** — a proportional formula (e.g. 3-part fat : 1-part acid for vinaigrette)
- A **Recipe Variant** — a specific instance linked to a blueprint, inheriting its proportional logic

This enables intelligent scaling that preserves ratios, not just multiplies quantities.

---

## CulinaryOS Integration

RecipeOS connects to [CulinaryOS](https://github.com/ShadowWalkerNC/CulinaryOS) via the MCP server in `mcp/`.

The `recipeos-server` exposes 10 MCP tools:

| Tool | What It Does |
|---|---|
| `get_recipe` | Fetch a recipe by name or ID with full ingredient list |
| `scale_recipe` | Return scaled ingredient quantities for a target yield |
| `list_recipes` | Search and filter recipe vault |
| `check_pantry` | Check if ingredients are available in pantry |
| `get_prep_list` | Generate a prep list for a recipe |
| `sync_menu_item` | Push a Recipe → CulinaryOS MenuItem |
| `get_ratio_blueprint` | Fetch ratio formula for a recipe category |
| `list_pantry` | Return current pantry inventory |
| `create_recipe` | Create a new recipe via MCP |
| `update_prep_task` | Mark prep tasks complete |

CulinaryOS calls these tools via its AI agent layer to power menu planning, inventory bridging, and prep scheduling.

---

## Supabase Schema (Target)

| Table | Purpose |
|---|---|
| `ratio_blueprints` | Proportional formulas by category |
| `recipes` | Recipe instances, optionally linked to a blueprint |
| `recipe_ingredients` | Ingredient lines belonging to a recipe |
| `pantry_items` | Current inventory with quantities and units |
| `prep_lists` | Named prep sessions, optionally linked to a recipe |
| `prep_tasks` | Individual tasks within a prep list |

All tables include `user_id` for per-user isolation and `updated_at` for sync conflict resolution.

---

## Performance Targets

| Metric | Target |
|---|---|
| Recipe load from local SQLite | ≤ 50ms |
| Scaling engine computation | ≤ 10ms |
| Supabase sync on reconnect | ≤ 2s for full queue |
| MCP tool response (cached) | ≤ 200ms |

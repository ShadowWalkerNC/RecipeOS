# RecipeOS — Architecture

> v4.0 — Updated June 23, 2026

---

## Governing Constraint

RecipeOS is a **TypeScript-first, open-source culinary toolkit** that operates as a web application, MCP server extension, CLI tool, and eventually a standalone mobile app. It is **self-hostable for free** — anyone can fork, clone, and run it on their own infrastructure. The managed hosted version is the commercial SaaS offering.

Every architectural decision must serve three users:
1. **The home cook / food entrepreneur** using the web app in a browser
2. **The power user / developer** running the CLI or self-hosting
3. **The AI agent / CulinaryOS** calling RecipeOS tools via MCP

**The primary constraint:** The web app is the first and primary surface. Mobile is Phase 4.

---

## Surface Priority Order

```
Phase 1 → Web App       (Next.js — website + user portal)
Phase 2 → MCP Server    (live Supabase, CulinaryOS-ready)
Phase 3 → CLI           (recipe-cli, power users, self-hosters)
Phase 4 → Mobile App    (Expo, iOS + Android, offline-first) ← FROZEN
Phase 5 → CulinaryOS    (JWT bridge, KDS sync, full integration)
```

---

## Platform Surface Map

| Client | Platform | Users | Connectivity | Status |
|---|---|---|---|---|
| Web App | Next.js 15 (App Router) | Chefs, home cooks, food entrepreneurs | Online (PWA future) | **Phase 1 — Active** |
| MCP Server | TypeScript / Node.js | CulinaryOS AI agent, LLM tool calls | Online required | Phase 2 |
| CLI | Node.js / Commander.js | Power users, automation, self-hosters | Online preferred | Phase 3 |
| Mobile App | React Native + Expo (iOS + Android) | On-the-go chefs | Offline-first | Phase 4 — Frozen |

All surfaces share the same Supabase backend and `shared/` TypeScript types.

---

## Stack Decisions

### Web — Next.js 15

- **Next.js 15 App Router** — file-based routing, Server Components, API routes
- **Supabase SSR helpers** — server-side auth session management
- **TanStack Query** — client-side server state, caching, optimistic updates
- **Zustand** — lightweight UI state (modals, toasts, active filters)
- **Magic Link auth** — Supabase email magic link; no passwords to manage
- **Vercel** — zero-config deployment, preview deploys on every push to `main`
- **Tailwind CSS** — utility-first styling

### MCP Server — TypeScript

- **`mcp/recipeos-server.ts`** — orchestrator; tools split into `mcp/tools/`
- Authenticated via **service role key** (Phase 2) → **CulinaryOS JWT** (Phase 5)
- Tool discovery schema written for CulinaryOS extension registry
- Publicly hostable — self-hosters can run their own MCP server instance
- Tools cover: recipe CRUD, pantry queries, prep list generation, ratio scaling, ingredient suggestions

### CLI — Commander.js

- `recipe-cli` built on **Commander.js**
- Five command groups: `recipe`, `pantry`, `prep`, `scale`, `sync`
- Talks directly to Supabase via service role key
- Designed for power users, automation pipelines, and self-hosting scripts

### Mobile — React Native + Expo ← FROZEN UNTIL PHASE 4

- **React Native + Expo SDK 52** — iOS + Android from a single TypeScript codebase
- **Expo Router** — file-based navigation
- **Expo SQLite** — local offline queue; survives crashes and reboots
- **EAS Build** — Google Play + App Store CI/CD
- All `mobile/` code is frozen. No changes until Phase 4 begins.

### Backend — Supabase

- **PostgreSQL** via Supabase — ACID, UUID PKs, Row Level Security on all tables
- **Supabase Auth** — Magic Link email auth → JWT; `user_id` scoping enforced on every table
- **Supabase Realtime** — cross-device sync (Phase 4+)
- **Supabase Edge Functions** — CulinaryOS joint auth bridge (Phase 5)
- **Supabase JS SDK** — used by web, CLI, and MCP server

---

## Open-Source Model

RecipeOS is **fully open-source (MIT)**. The business model is:

| Tier | Who | Cost |
|---|---|---|
| Self-hosted | Developers, power users | Free — fork + host yourself |
| Managed (SaaS) | Everyone else | Paid — hosted at recipeos.app |

Self-hosters get 100% feature parity. Documentation for self-hosting lives in `docs/self-hosting.md`.

---

## Authentication Flow

```
User visits /auth/login
  ↓
Enters email → Supabase sends magic link
  ↓
User clicks link → /auth/callback
  ↓
Supabase session created → redirect to /vault
  ↓
All queries scoped to auth.uid() via RLS
```

Demo access: A shared demo account seeded with sample recipes. A magic link button on the landing page logs directly into the demo user — no sign-up required to explore.

---

## Data Model

The schema everything else depends on. Single source of truth lives in `shared/types.ts`.

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
├── web/                           ← Next.js 15 web app (PRIMARY surface)
│   ├── app/
│   │   ├── (marketing)/             ← Public pages, no auth required
│   │   │   ├── page.tsx               ← Hero / landing page
│   │   │   └── layout.tsx
│   │   ├── (app)/                   ← Auth-gated user portal
│   │   │   ├── vault/page.tsx         ← Recipe Vault
│   │   │   ├── scale/page.tsx         ← Ratio scaling
│   │   │   ├── pantry/page.tsx        ← Pantry tracker
│   │   │   ├── prep/page.tsx          ← Prep list builder
│   │   │   └── layout.tsx             ← Auth gate wrapper
│   │   ├── auth/
│   │   │   ├── login/page.tsx         ← Magic link login form
│   │   │   └── callback/route.ts      ← Supabase auth callback
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                      ← Shared UI primitives
│   │   └── features/                ← Feature-specific components
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              ← Browser Supabase client
│   │   │   └── server.ts              ← Server-side Supabase client
│   │   └── queries/                 ← TanStack Query hooks
│   └── package.json
├── shared/                        ← Shared TypeScript (all surfaces import from here)
│   ├── types.ts                     ← Single source of truth for all interfaces
│   └── ratio-engine.ts              ← Ratio blueprint scaling logic
├── mobile/                        ← FROZEN — Phase 4 (React Native + Expo)
├── cli/                           ← Phase 3 (Commander.js)
├── mcp/                           ← Phase 2 (MCP server)
│   ├── recipeos-server.ts           ← Thin orchestrator
│   ├── tools/
│   │   ├── recipe-tools.ts
│   │   ├── pantry-tools.ts
│   │   ├── prep-tools.ts
│   │   └── scale-tools.ts
│   └── auth.ts                      ← CulinaryOS JWT bridge (Phase 5)
├── supabase/
│   ├── migrations/                  ← Numbered SQL migrations
│   └── seed.sql                     ← Dev seed + demo user data
├── docs/                          ← Public documentation
│   ├── self-hosting.md              ← Self-hosting guide (Docker, Railway, Render)
│   ├── api-reference.md             ← REST API reference
│   └── mcp-tools.md                 ← MCP tool schemas + descriptions
├── .github/
│   └── workflows/
│       └── deploy.yml               ← Vercel CI/CD on push to main
├── ARCHITECTURE.md                ← you are here
├── MIGRATION.md                   ← Kotlin → TypeScript migration log
├── PROJECT_PLAN.md                ← Phase-by-phase build plan
└── README.md
```

---

## CulinaryOS Integration (Phase 5)

RecipeOS connects to CulinaryOS as a registered MCP extension:

| RecipeOS | → | CulinaryOS |
|---|---|---|
| Recipe | → | MenuItem sync via `sync_menu_item` tool |
| PantryItem | → | Purchasing module bridge |
| PrepList | → | Labor/shift planning |
| Recipe steps | → | KDS display via WebSocket |
| Auth | → | CulinaryOS JWT accepted by Supabase Edge Function |

---

## System Rules

1. **Web-First:** The Next.js web app is the primary surface. All features land here before CLI or mobile.
2. **Shared Types:** All TypeScript interfaces live in `shared/types.ts`. No surface defines its own duplicate types.
3. **Ratio-First:** RatioBlueprints are the core abstraction. Recipes inherit proportional logic for intelligent scaling.
4. **user_id Scoping:** Every Supabase table has Row Level Security. Every query is scoped by `user_id`. An unscoped query is a critical bug.
5. **AI Isolation:** Gemini/AI API calls are isolated to dedicated files. They enhance but are never required for core functionality.
6. **TypeScript Everywhere:** Web, CLI, MCP server, and mobile all share TypeScript. No language boundary between surfaces.
7. **Open-Source Safe:** No secrets in the repository. `.env.example` is always updated alongside any new environment variable.
8. **Mobile Frozen:** No changes to `mobile/` until Phase 4 is formally started.

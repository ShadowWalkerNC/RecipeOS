# AGENTS.md — RecipeOS

> **Extends:** `ShadowWalkerNC/.github/AGENTS.md` — all global rules apply unconditionally.
> **Auto-loaded by:** Claude Code · GitHub Copilot · OpenAI Codex · Cursor · Windsurf
> **Canonical global system:** [ShadowWalkerNC/.github](https://github.com/ShadowWalkerNC/.github)

---

## Project Identity

```
Project:      RecipeOS
Description:  Open-source culinary toolkit — recipe vault, ratio scaling, pantry
              tracking, and prep list builder. Web app + MCP server + CLI.
Status:       In development
Phase:        Phase 1 — Web App (Next.js) — Active
Priority:     Active
Open-source:  Yes (MIT) — self-hostable at full feature parity
```

---

## Tech Stack

```
Language:     TypeScript (all surfaces)
Web:          Next.js 15 (App Router) + Tailwind CSS + TanStack Query + Zustand
MCP Server:   TypeScript / Node.js (Commander.js)
CLI:          Node.js / Commander.js
Mobile:       React Native + Expo SDK 52 ← FROZEN until Phase 4
Database:     Supabase (PostgreSQL) — RLS enforced on all tables
Auth:         Supabase Magic Link (no passwords)
Hosting:      Vercel (web) + Render (MCP server / CLI)
CI/CD:        GitHub Actions — .github/workflows/deploy.yml → Vercel on push to main
Key APIs:     Anthropic Claude (AI features, isolated), Supabase JS SDK
Monorepo:     No — flat with surface directories (web/, mobile/, cli/, mcp/, shared/)
```

---

## Repository Structure

```
RecipeOS/
├── web/                     ← PRIMARY surface — Next.js 15 App Router
│   ├── app/
│   │   ├── (marketing)/       ← Public pages, no auth
│   │   ├── (app)/             ← Auth-gated portal (vault, scale, pantry, prep)
│   │   └── auth/              ← Magic link login + Supabase callback
│   ├── components/
│   │   ├── ui/                ← Shared UI primitives (design system)
│   │   └── features/          ← Feature-specific components
│   └── lib/
│       ├── supabase/          ← client.ts + server.ts (browser + SSR clients)
│       └── queries/           ← TanStack Query hooks
├── shared/                  ← Single source of truth for all TypeScript types
│   ├── types.ts               ← All interfaces — never duplicate in surfaces
│   └── ratio-engine.ts        ← Ratio blueprint scaling logic
├── mcp/                     ← Phase 2 — MCP server (CulinaryOS integration)
│   ├── recipeos-server.ts     ← Thin orchestrator
│   ├── tools/                 ← recipe, pantry, prep, scale tools
│   └── auth.ts                ← CulinaryOS JWT bridge (Phase 5)
├── cli/                     ← Phase 3 — Commander.js CLI
├── mobile/                  ← FROZEN — Phase 4 (React Native + Expo)
├── supabase/
│   ├── migrations/            ← Forward-only numbered SQL migrations
│   └── seed.sql               ← Dev seed + demo user — do not modify casually
├── docs/                    ← self-hosting.md, api-reference.md, mcp-tools.md
├── assets/
├── ARCHITECTURE.md          ← read every session
├── PROJECT_PLAN.md          ← phase-by-phase build plan
├── MIGRATION.md             ← Kotlin → TypeScript migration log
└── .env.example             ← required env vars — always update alongside new vars
```

---

## Active Agents for RecipeOS

```
Always active:    COHERENCE · SECURITY · DOCS

Default on-demand (most sessions will need these):
  ENGINEER      ← Next.js, TypeScript, Supabase queries, API routes
  DATABASE      ← Schema changes, migrations, RLS policies
  UX            ← UI components, user journeys, accessibility
  QA            ← Tests, performance, release gates

Load when relevant:
  ARCHITECT     ← Adding a new surface, cross-surface integration, MCP design
  DEVOPS        ← CI/CD changes, Vercel config, Render deployment
  AI            ← Any work in AI-isolated files or Anthropic integration
  PRODUCT       ← Phase planning, scope decisions, roadmap

Rarely needed:
  BUSINESS      ← Load only for pricing, SEO, open-source licensing decisions
```

---

## Project-Specific Rules

These extend global rules. Global Tier 1–3 rules cannot be overridden.

1. **Web-first.** All features land in `web/` before CLI or mobile. No exceptions.
2. **Shared types only.** All TypeScript interfaces live in `shared/types.ts`. No surface defines its own duplicate types. Violating this is a critical bug.
3. **Ratio-first.** `RatioBlueprint` is the core abstraction. Recipes inherit proportional logic. Do not build scaling logic outside `shared/ratio-engine.ts`.
4. **RLS on every table.** Every Supabase query is scoped by `user_id`. An unscoped query is a critical security bug — SECURITY agent has hard veto.
5. **Mobile is frozen.** No changes to `mobile/` until Phase 4 is formally started. Any PR touching `mobile/` must be rejected.
6. **AI isolation.** All Anthropic/AI API calls are isolated to dedicated files. They enhance but are never required for core functionality. Core features must work without AI.
7. **Open-source safe.** No secrets in any committed file. `.env.example` must be updated alongside every new environment variable. SECURITY agent checks this on every commit.
8. **Migrations are forward-only.** No rollback migrations. Every migration in `supabase/migrations/` must be numbered sequentially and reviewed by DATABASE agent before push.
9. **seed.sql is protected.** Do not modify `supabase/seed.sql` without explicit user approval and DATABASE agent review. It contains the demo user data.
10. **Design system.** All UI components must follow the shared primitives in `web/components/ui/`. No one-off inline styling that bypasses the design system without UX agent approval.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (server/MCP) | Service role key — never expose client-side |
| `ANTHROPIC_API_KEY` | AI features only | Claude API key — isolated to AI files |
| `NEXT_PUBLIC_APP_URL` | Yes | Base URL for auth callbacks |

Never commit values. Always use `.env.example`.

---

## Surface Priority Order

```
Phase 1 → Web App       (Next.js) — ACTIVE
Phase 2 → MCP Server    (TypeScript/Node.js, CulinaryOS-ready)
Phase 3 → CLI           (Commander.js, power users + self-hosters)
Phase 4 → Mobile App    (React Native + Expo) — FROZEN
Phase 5 → CulinaryOS    (JWT bridge, KDS sync, full integration)
```

---

## Current Phase Context

```
Phase:              1 — Web App (Next.js 15)
Phase goal:         Ship the full web app with recipe vault, ratio scaling,
                    pantry tracking, and prep list builder.
Definition of done: All four core features work end-to-end in production.
                    Magic link auth works. Demo user seeded. Self-hosting docs live.
Current status:     In development
Next phase:         Phase 2 — MCP Server (CulinaryOS integration)
```

---

## Known Issues / Watch List

- **Mobile frozen:** `mobile/` directory contains React Native code from an earlier Kotlin-era migration. Do not touch it. See `MIGRATION.md` for context.
- **CulinaryOS JWT bridge:** `mcp/auth.ts` is a Phase 5 stub. Do not implement it until Phase 5 is formally started.
- **Demo user:** `supabase/seed.sql` contains demo user data. Changes here break the demo magic link on the landing page.
- **RLS required:** Any new table added to Supabase without RLS policies is an open security hole. DATABASE + SECURITY agents must both review before migration is pushed.
- **Open-source model:** RecipeOS is MIT-licensed. Do not add any dependency or feature that would compromise the self-hosting promise (e.g., locked-in third-party services without open alternatives).

---

## CulinaryOS Integration Context

RecipeOS is designed to be consumed by CulinaryOS as a registered MCP extension:

| RecipeOS | → | CulinaryOS |
|---|---|---|
| Recipe | → | MenuItem sync via `sync_menu_item` tool |
| PantryItem | → | Purchasing module bridge |
| PrepList | → | Labor/shift planning |
| Recipe steps | → | KDS display via WebSocket |
| Auth | → | CulinaryOS JWT accepted by Supabase Edge Function |

All MCP tool schemas in `mcp/tools/` must be designed with CulinaryOS consumption in mind.

---

## Agent Confirmation for RecipeOS

After loading this file, add to `DISPATCH CONFIRMED`:

```
Project AGENTS.md: loaded — RecipeOS
Stack: TypeScript · Next.js 15 · Supabase · Vercel
Phase: 1 — Web App (Active)
Project rules active: 10 overrides
Mobile status: FROZEN — no changes to mobile/ permitted
Known issues noted: yes
```

---

*Version: 1.0 | Extends: ShadowWalkerNC/.github/AGENTS.md | Project: RecipeOS*

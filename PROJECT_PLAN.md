# RecipeOS — Project Plan

> v3.0 — Updated June 23, 2026
> Stack: TypeScript · Next.js 15 · Supabase · Commander.js · MCP · React Native + Expo (Phase 4)

---

## Phase 0 — Repo Housekeeping 🔄 In Progress

- [x] Scaffold React Native + Expo mobile app (`mobile/`) — **frozen at Phase 4**
- [x] Implement ratio-based scaling engine (`mobile/lib/ratio-engine.ts`)
- [x] Implement 5 core screens in mobile: Vault, Scale, Pantry, Prep List, Scan — **frozen**
- [x] Scaffold `recipe-cli` with 5 command groups
- [x] Scaffold MCP server with 10 tools
- [x] Rewrite README, ARCHITECTURE, PROJECT_PLAN to reflect TypeScript stack
- [x] Update ARCHITECTURE.md to v4.0 — web-first, Next.js, open-source SaaS
- [ ] **0.2** Update PROJECT_PLAN.md to v3.0 — reorder phases, freeze mobile ← *you are here*
- [ ] **0.3** Create `shared/` directory — `shared/types.ts` + `shared/ratio-engine.ts`
- [ ] **0.4** Scaffold `web/` Next.js 15 app — stub routes only, no logic
- [ ] **0.5** Add Vercel CI/CD — `.github/workflows/deploy.yml` + `vercel.json`

---

## Phase 1 — Supabase + Auth ⏳ Pending (target: July 2026)

### Supabase Setup
- [ ] **1.1** Create Supabase project (manual — Supabase dashboard)
- [ ] **1.1** Apply V1 migration: `ratio_blueprints`, `recipes`, `recipe_ingredients`
- [ ] **1.1** Apply V2 migration: `pantry_items`, `prep_lists`, `prep_tasks`
- [ ] **1.1** Enable Row Level Security on all tables (`user_id` scoping)
- [ ] **1.1** Add `.env.example` with `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Web — Supabase Clients
- [ ] **1.2** `web/lib/supabase/client.ts` — browser Supabase client
- [ ] **1.2** `web/lib/supabase/server.ts` — server-side client for Server Components
- [ ] **1.2** `web/lib/supabase/middleware.ts` — session refresh middleware

### Web — Magic Link Auth
- [ ] **1.3** `web/app/auth/login/page.tsx` — email input form, sends magic link
- [ ] **1.3** `web/app/auth/callback/route.ts` — handles Supabase redirect + session
- [ ] **1.3** `web/app/(app)/layout.tsx` — redirects unauthenticated users to `/auth/login`

---

## Phase 2 — Web Portal Screens ⏳ Pending (target: Aug 2026)

One commit per screen. No screen file is touched while building another.

- [ ] **2.1** Recipe Vault screen — `web/app/(app)/vault/page.tsx` + `useRecipes()` hook
- [ ] **2.2** Pantry screen — `web/app/(app)/pantry/page.tsx` + `usePantryItems()` + `useAddPantryItem()`
- [ ] **2.3** Prep List screen — `web/app/(app)/prep/page.tsx` + `usePrepLists()` + `useTogglePrepTask()`
- [ ] **2.4** Scale screen — `web/app/(app)/scale/page.tsx` — driven by `shared/ratio-engine.ts`
- [ ] **2.5** Public landing/hero page — `web/app/(marketing)/page.tsx` — 100% static, no auth
- [ ] **2.6** Guided demo mode — shared demo account + seed data + magic link on landing page

---

## Phase 3 — MCP Server Live Wiring ⏳ Pending (target: Sep 2026)

- [ ] **3.1** Split MCP server into `mcp/tools/` subdirectory — one file per domain
- [ ] **3.2** Connect all 10 MCP tools to live Supabase (service role key)
- [ ] **3.2** Add `mcp/auth.ts` — CulinaryOS JWT stub (full impl in Phase 5)
- [ ] **3.3** Write `docs/mcp-tools.md` — all 10 tools documented with schemas
- [ ] **3.3** Write `docs/api-reference.md`
- [ ] **3.3** Write `docs/self-hosting.md` — Docker + Railway/Render self-hosting guide

---

## Phase 4 — CLI ⏳ Pending (target: Oct 2026)

- [ ] `recipe list` — list all recipes
- [ ] `recipe show <name>` — display recipe with scaled output
- [ ] `pantry list` — show current inventory
- [ ] `prep generate <recipe>` — output prep list to terminal
- [ ] `sync` — push local changes to Supabase
- [ ] Publish `recipe-cli` to npm

---

## Phase 5 — Mobile App ⏳ Pending (target: Q1 2027) — FROZEN

> The `mobile/` directory is frozen. No changes until Phase 5 begins.
> All mobile code written to date is preserved as the Phase 5 starting point.

- [ ] Unfreeze `mobile/` — update Expo SDK if needed
- [ ] Update `mobile/lib/supabase.ts` — swap in live Supabase credentials
- [ ] Replace Google Sign-In with Magic Link (align with web auth)
- [ ] Wire all 5 screens to TanStack Query + Supabase (mirrors Phase 2 web logic)
- [ ] Implement Expo SQLite offline queue + sync engine
- [ ] Barcode scan → Open Food Facts API → create PantryItem
- [ ] Scan-a-Recipe: Camera → Expo OCR → Gemini parse → pre-filled form
- [ ] Density-aware unit conversion (flour, sugar, butter, cream, oil lookup)
- [ ] EAS Build setup for Google Play + App Store

---

## Phase 6 — CulinaryOS Integration ⏳ Pending (target: Q2 2027)

- [ ] MCP server registered as CulinaryOS extension
- [ ] Recipe → CulinaryOS MenuItem sync via `sync_menu_item` tool
- [ ] PantryItem → CulinaryOS purchasing module bridge
- [ ] PrepList → CulinaryOS labor/shift planning
- [ ] Recipe steps stream to KDS display via CulinaryOS WebSocket
- [ ] Joint auth: CulinaryOS JWT accepted by RecipeOS Supabase Edge Function

---

## Phase 7 — Intelligence & Cross-Device ⏳ Pending (target: Q3 2027)

- [ ] AI skill-level adaptation: Gemini adapts instructions by skill level → stored as recipe variant
- [ ] Ingredient AI suggestions: select pantry items → Gemini recipe ideas
- [ ] Recipe card PDF export + share sheet
- [ ] Prep list checklist PDF export
- [ ] Cross-device sync via Supabase Realtime
- [ ] Conflict resolution: last-write-wins with `updated_at` timestamps
- [ ] Missing ingredient detection → grocery list export
- [ ] Time-block view for prep tasks

---

## Governing Rules

1. **Web-first:** Every feature lands on the web app before CLI or mobile.
2. **One concern per commit:** Single file or single feature unit per commit.
3. **`shared/types.ts` is the single source of truth:** All surfaces import types from here.
4. **`mobile/` is frozen:** No changes until Phase 5 is formally started.
5. **Open-source safe:** No secrets in the repo. `.env.example` updated with every new env var.
6. **Docs in same commit as feature:** Documentation never drifts behind code.
7. **Read SHA before every write:** Never overwrite a file via MCP without reading its current SHA first.

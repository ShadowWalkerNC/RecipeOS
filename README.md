# RecipeOS

[![Phase](https://img.shields.io/badge/phase-1%20Core%20Data-blue)](PROJECT_PLAN.md)
[![Stack](https://img.shields.io/badge/stack-TypeScript%20%7C%20React%20Native%20%7C%20Supabase-purple)](ARCHITECTURE.md)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**RecipeOS** is a TypeScript-first culinary toolkit for professional chefs, home cooks, and food entrepreneurs. It runs as a standalone mobile app (iOS + Android) and as an MCP server extension to [CulinaryOS](https://github.com/ShadowWalkerNC/CulinaryOS).

Every recipe is built on a **Ratio Blueprint** — a proportional formula that scales intelligently. Specific instances are called **Variants**. Scale for 2 or 200, the ratios hold.

---

## ⚡ Quick Start

```bash
# 1. Clone
git clone https://github.com/ShadowWalkerNC/RecipeOS.git
cd RecipeOS

# 2. Install dependencies
cd mobile && npm install

# 3. Configure environment
cp .env.example .env
# Set SUPABASE_URL and SUPABASE_ANON_KEY

# 4. Start the app
npx expo start
```

> **Prerequisites:** Node.js 20+, Expo CLI, iOS Simulator or Android Emulator

---

## 📊 Build Progress

| Phase | Name | Status | Target |
|---|---|---|---|
| 0 | Migration & Scaffold | ✅ Complete | Jun 2026 |
| 1 | Core Data + Screens | 🔄 In Progress | Aug 2026 |
| 2 | Pro Kitchen Tools | ⏳ Pending | Oct 2026 |
| 3 | Intelligence & Sync | ⏳ Pending | Dec 2026 |
| 4 | CulinaryOS Integration | ⏳ Pending | 2027 |

See [`PROJECT_PLAN.md`](PROJECT_PLAN.md) for full phase checklists.

---

## 🏗️ What It Does

| Module | What It Does |
|---|---|
| **Recipe Vault** | Create, browse, and manage recipes built on ratio blueprints |
| **Scale** | Intelligent ratio-aware scaling for any yield or serving count |
| **Pantry** | Track inventory, get low-stock alerts, detect missing ingredients |
| **Prep List** | Generate time-blocked prep task lists from any recipe |
| **Scan** | Camera scan → OCR → Gemini parse → pre-filled recipe form |
| **CLI** | Headless recipe and pantry management via `recipe-cli` |
| **MCP Server** | 10 tools exposing RecipeOS data to CulinaryOS and AI agents |

---

## 🧩 Architecture

| Layer | Technology | Why |
|---|---|---|
| Mobile app | **React Native + Expo** | iOS + Android from one TypeScript codebase |
| Navigation | **Expo Router** | File-based routing, native feel |
| Server state | **TanStack Query** | Caching, background sync, optimistic updates |
| Client state | **Zustand** | Lightweight, no boilerplate |
| Offline queue | **Expo SQLite** | Survives crashes; syncs on reconnect |
| Backend | **Supabase** | PostgreSQL, Auth, Realtime, Edge Functions |
| CLI | **Commander.js** | Headless recipe + pantry management |
| MCP Server | **TypeScript / Node.js** | CulinaryOS extension + AI agent tools |
| AI features | **Gemini API** | Scan-a-recipe, ingredient suggestions, skill adaptation |

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for full stack decisions, data model, and CulinaryOS integration spec.

---

## 🔗 CulinaryOS Integration

RecipeOS registers as an MCP extension to [CulinaryOS](https://github.com/ShadowWalkerNC/CulinaryOS). The MCP server exposes 10 tools that allow the CulinaryOS AI agent to:

- Sync recipes as menu items
- Bridge pantry inventory to the purchasing module
- Push prep lists to labor/shift planning
- Stream recipe steps to KDS displays

Integration is planned for Phase 4 (2027). See [`PROJECT_PLAN.md`](PROJECT_PLAN.md).

---

## 📚 Documentation

| Doc | Purpose |
|---|---|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Stack decisions, data model, offline sync, CulinaryOS integration |
| [`PROJECT_PLAN.md`](PROJECT_PLAN.md) | Phase-by-phase build plan with checklists |
| [`MIGRATION.md`](MIGRATION.md) | Kotlin → TypeScript migration log and checklist |

---

## 🤖 AI Agent Directive

> **Current phase:** Phase 1 — Core Data + Screens
> **Current action:** Build Supabase schema + wire live data to mobile screens
> **Stack:** TypeScript · React Native + Expo · Supabase · TanStack Query · Zustand · Commander.js · MCP
> **Do NOT:** use Kotlin · use Room · skip RLS on any table · make unscoped Supabase queries
> **Always:** write `user_id` RLS on every new table · keep AI calls isolated in `mobile/lib/ai.ts` · offline-first for all mobile writes
> **GitHub:** https://github.com/ShadowWalkerNC/RecipeOS

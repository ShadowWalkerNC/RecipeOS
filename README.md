# RecipeOS

[![Stack](https://img.shields.io/badge/stack-TypeScript%20%7C%20React%20Native-blue)]()
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20CLI%20%7C%20MCP-purple)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

**RecipeOS** is a ratio-first, offline-capable recipe and kitchen management system built on a unified TypeScript stack.

It runs as three surfaces from one codebase:
- **Mobile app** — React Native + Expo (iOS + Android)
- **CLI** — `recipe-cli` for terminal-based kitchen workflows
- **MCP Server** — `recipeos-server` plugs RecipeOS into [CulinaryOS](https://github.com/ShadowWalkerNC/CulinaryOS) as a first-class tool server

This is not a recipe book. Every recipe is a ratio blueprint that scales intelligently, adapts by skill level, and syncs with restaurant operations.

---

## ⚡ Quick Start

```bash
# 1. Clone
git clone https://github.com/ShadowWalkerNC/RecipeOS.git
cd RecipeOS

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Set SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY

# 4. Start mobile app
cd mobile && npx expo start

# 5. Start MCP server
cd mcp && npm run dev
```

> **Prerequisites:** Node 20+, Expo CLI, EAS CLI (for builds)

---

## 📊 Build Progress

| Phase | Name | Status | Target |
|---|---|---|---|
| 0 | Migration & Scaffold | ✅ Complete | Done |
| 1 | Core Data + Screens | 🔄 In Progress | Aug 2026 |
| 2 | Pro Kitchen Tools | ⏳ Pending | Oct 2026 |
| 3 | Intelligence & Sync | ⏳ Pending | Dec 2026 |
| 4 | CulinaryOS Integration | ⏳ Pending | 2027 |

---

## 🏗️ Architecture

| Layer | Technology | Purpose |
|---|---|---|
| Mobile App | React Native + Expo SDK 52 | iOS + Android, offline-first |
| State Management | Zustand + TanStack Query | Local state + server sync |
| Local Database | Expo SQLite | Offline-first data persistence |
| Cloud Sync | Supabase (Postgres + Auth) | Cross-device sync, Google Sign-In |
| CLI | Commander.js (`recipe-cli`) | Terminal kitchen workflows |
| MCP Server | TypeScript (`recipeos-server`) | CulinaryOS integration, 10 tools |
| AI Layer | Gemini API | Scan-a-recipe, skill adaptation, suggestions |

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for full stack decisions and module map.

---

## 🧩 Core Features

| Domain | What It Does |
|---|---|
| **Recipe Vault** | Create, browse, and manage recipes with ratio blueprint linking |
| **Scaling Engine** | Ratio-aware scaling — preserves proportions, outputs clean fractions |
| **Pantry Tracker** | Inventory management with barcode scan + Open Food Facts lookup |
| **Prep List Builder** | Pre-service checklist generator with time-block view |
| **Scan-a-Recipe** | Camera → OCR → Gemini parse → pre-filled recipe form |
| **AI Suggestions** | Select pantry items → Gemini generates ratio-aware recipe ideas |
| **Unit Converter** | Weight ↔ volume ↔ temperature with density-aware ingredient lookup |

---

## 🔗 CulinaryOS Integration

RecipeOS connects to [CulinaryOS](https://github.com/ShadowWalkerNC/CulinaryOS) as an MCP tool server.
The `recipeos-server` exposes 10 MCP tools that CulinaryOS can call:

- Recipe lookup and scaling
- Pantry availability checks
- Prep list generation
- Menu item sync (Recipe → CulinaryOS MenuItem)
- Ingredient → purchasing module bridge

See [`mcp/`](mcp/) for server implementation.

---

## 📚 Documentation

| Doc | Purpose |
|---|---|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Stack decisions, module map, platform rules |
| [`MIGRATION.md`](MIGRATION.md) | Kotlin → TypeScript migration status and checklist |
| [`PROJECT_PLAN.md`](PROJECT_PLAN.md) | Full phase roadmap with feature specs |

---

## 🤖 AI Agent Directive

> **Current phase:** Phase 1 — Core Data + Screens
> **Current action:** Build Supabase schema + wire live data via TanStack Query
> **Stack:** React Native + Expo · TypeScript · Zustand · TanStack Query · Expo SQLite · Supabase · Gemini API · Commander.js · MCP
> **Do NOT:** use Kotlin/Room/Gradle for new features · mix Supabase and Room · add web browser targets (mobile + CLI + MCP only)
> **Always:** keep AI isolated in `mobile/lib/ai/` · write offline-first (SQLite first, sync second) · match CulinaryOS event patterns for sync
> **GitHub:** https://github.com/ShadowWalkerNC/RecipeOS

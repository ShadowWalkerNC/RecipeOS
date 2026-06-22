# RecipeOS — Kotlin → React Native Migration

## Status: In Progress

The original Android app (Kotlin/Compose) is being replaced with a full TypeScript stack aligned to the ShadowWalkerNC standard: **GUI + CLI + MCP**.

## What Changed

| Old (Kotlin) | New (TypeScript) |
|---|---|
| Kotlin/Compose Android app | React Native + Expo SDK 52 |
| Hilt dependency injection | Zustand + TanStack Query |
| Retrofit + OkHttp | Supabase JS SDK + fetch |
| Room local database | Expo SQLite |
| Gradle DSL build | EAS Build (Expo) |
| No CLI | `recipe-cli` (Commander.js) |
| No MCP server | `mcp/recipeos-server.ts` (10 tools) |

## Migration Checklist

- [x] Scaffold React Native + Expo mobile app (`mobile/`)
- [x] Implement ratio-based scaling engine (`mobile/lib/ratio-engine.ts`)
- [x] Implement 5 core screens: Recipe Vault, Scale, Pantry, Prep List, Scan
- [x] Scaffold `recipe-cli` with 5 command groups
- [x] Scaffold MCP server with 9 tools
- [ ] Build Supabase schema (recipes, ingredients, pantry, prep_tasks)
- [ ] Wire live data to all screens via TanStack Query
- [ ] Implement scan-a-recipe (Expo Camera + OCR/AI)
- [ ] Implement offline sync with Expo SQLite
- [ ] EAS Build setup for Google Play
- [ ] Remove Kotlin build files once migration complete

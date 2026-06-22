# RecipeOS Mobile

React Native + Expo mobile app for RecipeOS. Replaces the previous Kotlin/Compose Android build.

## Stack

- **React Native + Expo SDK 52** (TypeScript)
- **Expo Router** — file-based navigation
- **NativeWind** — Tailwind CSS styling
- **TanStack Query** — server state
- **Zustand** — global state
- **Supabase JS SDK** — auth + cloud sync
- **Expo SQLite** — offline recipe vault
- **Expo Camera** — scan-a-recipe feature

## Screens

| Screen | Description |
|---|---|
| Recipe Vault | Browse, search, and open recipes |
| Scale | Ratio-based recipe scaler with live factor display |
| Pantry | Ingredient stock levels with low-stock indicators |
| Prep List | Professional kitchen prep checklist |
| Scan | Camera-based recipe import |

## Getting Started

```bash
cd mobile
npm install
# Create .env with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
npx expo start
```

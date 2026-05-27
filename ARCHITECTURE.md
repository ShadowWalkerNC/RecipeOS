# RecipeOS Architecture

## Folder Structure

```
RecipeOS/
├── app/
│   ├── data/
│   │   ├── db/          ← Room database + DAOs
│   │   ├── model/       ← Entity classes
│   │   └── repository/  ← Repository pattern (single source of truth)
│   ├── ui/
│   │   ├── recipes/     ← Recipe list, detail, create/edit screens
│   │   ├── inventory/   ← Pantry tracker screens
│   │   ├── prep/        ← Prep list builder screens
│   │   ├── converter/   ← Unit conversion screen
│   │   └── components/  ← Shared Composables
│   ├── ai/              ← Gemini API calls (isolated layer)
│   └── util/            ← Conversion math, ratio engine, formatting
├── build.gradle.kts     ← Already configured
└── .env / secrets       ← GEMINI_API_KEY via Secrets plugin
```

## System Rules

1.  **Offline-First:** The app runs entirely locally using Room for storage.
2.  **AI Isolation:** Gemini API integrations live exclusively within `app/ai/`. They enhance the experience but are not required for core functionality.
3.  **Single Source of Truth:** Repositories handle all data operations. UI layers observe flows from the repository via ViewModels.
4.  **Ratio-First Rationale:** The application prioritizes Ratio Blueprints; specific instances of recipes are called variants which can inherit proportional logic for intelligent scaling.

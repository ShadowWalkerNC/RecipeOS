# RecipeOS — Revised Stable Plan

Decision: Kotlin + Jetpack Compose, Android-first, single canonical repo.

## Architecture — Locked

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

Rule: AI is isolated in `/ai/`. Everything else works offline. Gemini is an enhancement, not a dependency.

## The Ratio Blueprint Data Model — Issue #12a (do this first)

This is the schema everything else depends on. Lock it before writing more UI.

```kotlin
// RatioBlueprint — the formula
@Entity(tableName = "ratio_blueprints")
data class RatioBlueprint(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,           // "Basic Vinaigrette"
    val description: String,
    val category: String,       // "Dressing", "Bread", "Pastry", "Sauce"
    val ratioJson: String,      // JSON: [{"part":"fat","ratio":3},{"part":"acid","ratio":1}]
    val notes: String,
    val createdAt: Long = System.currentTimeMillis()
)

// Recipe — a specific instance, may be linked to a blueprint
@Entity(tableName = "recipes")
data class Recipe(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val description: String,
    val skillLevel: String,     // BEGINNER, INTERMEDIATE, ADVANCED, PRO
    val cuisine: String,
    val servings: Int,
    val yieldUnit: String,      // "servings", "oz", "loaves", etc.
    val ratioId: Long? = null,  // FK → RatioBlueprint (nullable = standalone recipe)
    val isBlueprint: Boolean = false,
    val instructions: String,   // JSON array of steps
    val tags: String,           // comma-separated
    val createdAt: Long = System.currentTimeMillis()
)

// RecipeIngredient — belongs to a Recipe
@Entity(tableName = "recipe_ingredients",
    foreignKeys = [ForeignKey(Recipe::class, ["id"], ["recipeId"], onDelete = CASCADE)])
data class RecipeIngredient(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val recipeId: Long,
    val name: String,
    val amount: Double,
    val unit: String,           // g, oz, cup, tbsp, tsp, ml, l, lb, kg, piece
    val ratioPart: String? = null, // "fat", "acid" — links to blueprint ratio
    val notes: String = ""
)

// PantryItem — inventory
@Entity(tableName = "pantry_items")
data class PantryItem(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val quantity: Double,
    val unit: String,
    val category: String,
    val barcode: String? = null,
    val updatedAt: Long = System.currentTimeMillis()
)

// PrepList + PrepTask
@Entity(tableName = "prep_lists")
data class PrepList(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,           // "Baking Prep", "Soup Day"
    val recipeId: Long? = null, // optional link
    val date: Long,
    val isTemplate: Boolean = false
)

@Entity(tableName = "prep_tasks",
    foreignKeys = [ForeignKey(PrepList::class, ["id"], ["prepListId"], onDelete = CASCADE)])
data class PrepTask(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val prepListId: Long,
    val taskType: String,   // WASH, PEEL, CHOP, DICE, MINCE, JULIENNE, BRUNOISE,
                            // WEIGH, PORTION, MARINATE, BLANCH, REDUCE, LABEL_STORE
    val description: String,
    val ingredient: String,
    val estimatedMinutes: Int,
    val isComplete: Boolean = false,
    val sortOrder: Int = 0
)
```

## Revised Roadmap — Stable Phases

### Phase 0 — Stabilize (This Week)

Turn the AI Studio scaffold into a real Android project.
- Replace README with RecipeOS-specific docs
- Remove `signingConfig = signingConfigs.getByName("debugConfig")` from app build.gradle.kts
- Add `local.properties` to `.gitignore`
- Create `ARCHITECTURE.md`
- Create Issue #12a: Ratio Blueprint Schema
- Create Issue #13: Architecture stabilization + README

### Phase 1 — Foundation (Weeks 1–4)

Issues #1, #2, #3, #4 + new #12a

**#12a — Ratio Blueprint schema (do first)**
- Implement all Room entities above
- Write DAOs for CRUD on all tables
- Wire up AppDatabase with migrations versioned from v1

**#1 — Recipe CRUD**
- RecipeListScreen → RecipeDetailScreen → RecipeEditScreen
- ViewModel + Repository pattern
- Skill level filter chips on list screen

**#2 — Ingredient inventory**
- PantryScreen with add/edit/delete
- Quantity editing inline
- Category grouping

**#3 — Scaling engine**
- RecipeScaler.kt utility: takes a Recipe + target servings → returns scaled RecipeIngredient list
- Ratio-aware: if recipe is linked to a blueprint, scale preserves ratios
- Fraction formatter: output ½, ⅓, ¾ not 0.5, 0.33

**#4 — Unit converter**
- UnitConverter.kt — weight ↔ volume ↔ temperature
- Standalone converter screen + embedded in recipe detail

### Phase 2 — Pro Kitchen Tools (Weeks 4–8)

Issues #5, #6, #7, #8, #12

**#5 — Prep list builder**
- PrepListScreen → PrepTaskScreen
- Task type picker
- Time-block view
- Pre-service checklist mode
- Template save/load

**#12 — Barcode scanner**
- ML Kit Vision + Open Food Facts API
- On scan: check local Room DB first → fall back to API → create PantryItem
- Handle unknown barcodes gracefully (manual entry fallback)

**#6 — Scan-a-Recipe**
- Camera intent → ML Kit OCR → Gemini parse prompt
- Output: pre-filled RecipeEditScreen

**#7 — Ingredient → AI recipe ideas**
- Input: selected PantryItems
- Output: Gemini-generated recipe suggestions (ratio awareness)

**#8 — Density-aware conversions**
- Ingredient density table (flour, sugar, butter, water, cream, oil)
- Lookup table in Room or constants
- Applied automatically in unit converter

### Phase 3 — Intelligence & Sync (Weeks 8–12)

Issues #9, #10, #11 + cloud

**#9 — Missing ingredient detection + grocery list**
- Compare RecipeIngredient list vs. PantryItem quantities
- Generate ShoppingList entity
- Export as text/share

**#10 — AI skill-level adaptation**
- Gemini prompt: take recipe JSON + target skill level → return adapted instructions
- Store as a new Recipe variant linked to same ratio blueprint

**#11 — Export (PDF + share sheet)**
- Recipe card as formatted PDF
- Prep list as checklist PDF
- Share via Android share sheet

**Cloud sync — Supabase**
- Mirror Room schema in Supabase Postgres
- Auth: Google Sign-In → Supabase JWT
- Sync strategy: local-first, push on connect

### Phase 4 — CulinaryOS Integration (2027)

- REST API layer: RecipeOS Supabase DB → CulinaryOS reads via Edge Functions
- Menu sync: Recipe → MenuItem in CulinaryOS POS
- Inventory sync: PantryItem → purchasing module
- Prep schedule sync: PrepList → labor/shift planning
- KDS: recipe steps stream to kitchen display

### Immediate Next Actions (in order)
1. Create Issue #12a in GitHub — Ratio Blueprint Schema (paste the Kotlin above as the spec)
2. Create Issue #13 — Phase 0 stabilization tasks
3. Implement the 5 Room entities — get the DB layer solid before any more UI
4. Write one seed recipe — Basic Donut Dough as a RatioBlueprint with a Half Baked variant. This validates the schema against a real use case.
5. Replace the README — point it at the PROJECT_PLAN and ARCHITECTURE docs

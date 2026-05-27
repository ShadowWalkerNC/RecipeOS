# RecipeOS — Project Plan & Vision Document

> **The professional kitchen — for everyone.** From the first-time home cook to the seasoned chef, RecipeOS is a kitchen operating system built around the way real kitchens actually think and work.

---

## Vision & Philosophy

RecipeOS bridges the gap between home cooking and professional kitchen practice. The core belief is that the tools professionals use — ratio-based recipes, mise en place prep lists, batch scaling, unit precision — should be accessible to anyone, at any skill level, with an interface that meets them where they are.

This app is also the **culinary engine** that will power a larger ecosystem. RecipeOS feeds directly into **CulinaryOS**, a full restaurant operations platform that includes a custom-built POS and KDS (Kitchen Display System). The recipe intelligence, ratio logic, prep workflows, and inventory data built in RecipeOS become the source of truth for everything upstream in that system.

---

## The Bigger Picture — RecipeOS → CulinaryOS

```
RecipeOS (Mobile App)
  │
  ├── Recipes (with ratio blueprints & variants)
  ├── Inventory & Ingredient Data
  ├── Prep Lists & Mise en Place
  ├── Unit Conversion Engine
  └── AI (Gemini) — scan, generate, adapt
         │
         ▼
  CulinaryOS (Restaurant Operations Platform)
  ├── POS — Point of Sale (custom-built)
  ├── KDS — Kitchen Display System (custom-built)
  ├── Menu Management (sourced from RecipeOS recipes)
  ├── Inventory Control (sourced from RecipeOS inventory)
  └── Labor / Prep Scheduling (sourced from prep lists)
```

RecipeOS is not just a standalone app — it is the **culinary data layer** for CulinaryOS. Every recipe, ratio, ingredient, and prep workflow created here becomes a node in the larger operating system.

---

## The Ratio Recipe System

### What Is a Ratio Recipe?

A ratio recipe is a **base formula expressed as proportional parts rather than fixed quantities**. Professional bakers and cooks have always worked this way — a standard vinaigrette is always 3 parts oil to 1 part acid, regardless of batch size. A basic bread dough is always 5:3 flour to water by weight.

Ratios make recipes:
- **Infinitely scalable** — scale to any batch size without recalculating each ingredient
- **Teachable** — a beginner who understands the ratio understands the recipe at a deeper level
- **Variable** — swap ingredients within a ratio category to create endless legal variations

### How It Works in RecipeOS

Every recipe in RecipeOS can be designated as a **Ratio Blueprint** or linked to one as a **Variant**.

```
Ratio Blueprint: Basic Vinaigrette
  Ratio: 3 parts fat : 1 part acid : season to taste

  Variants:
  ├── Classic French Vinaigrette    (olive oil + red wine vinegar + Dijon)
  ├── Asian Sesame Dressing         (sesame oil + rice vinegar + soy + ginger)
  ├── Honey Citrus Vinaigrette      (avocado oil + lemon juice + honey)
  └── Balsamic Reduction Dressing   (olive oil + balsamic + garlic)
```

---

## Core Feature Set

### 📖 Recipe Management
- Create, edit, and browse recipes tagged by skill level: `Beginner` → `Intermediate` → `Advanced` → `Pro`
- Designate any recipe as a **Ratio Blueprint** and create linked **Variants**
- Search and filter by skill level, cuisine, ingredient, or ratio family
- Step-by-step instructions with technique callouts

### 🥕 Ingredient & Inventory (Including Barcode Scanning)
- Full pantry tracker linked to recipes
- Input ingredients on hand → get AI recipe ideas
- Auto-detect missing ingredients when a recipe is selected
- Grocery list generation from recipe needs vs. current stock
- **[NEW] Barcode Scanner**: Add to pantry instantly using the device camera.
  - Checks local SQLite `AppDatabase` for existing custom ingredients.
  - Queries public Internet databases (like Open Food Facts API) to auto-fetch product names, categories, and volumes for unrecognized barcodes.

### ⚖️ Unit Conversion & Scaling
- Weight ↔ Volume ↔ Temperature: all professional kitchen units
- Ratio-based scaling: scale by servings, batch size, yield %, or ratio multiplier
- Density-aware conversions (ingredient-specific weight-to-volume)
- Fraction display: ½, ⅓, ¼, ⅔, ¾ — not decimals

### 📋 Prep Lists (Professional Kitchen Workflow)
- Build mise en place prep lists task-by-task
- Task types: wash, peel, chop, dice, mince, julienne, brunoise, weigh, portion, marinate, blanch, reduce, label & store
- Time-block tasks across a prep window
- Pre-service checklist mode with progress tracking
- Save reusable templates: "Baking Prep", "Soup Day", "Protein Butchery"

### 🤖 AI Integration (Gemini)
- **Scan-a-Recipe**: photograph a recipe card or cookbook page → OCR + AI parse → import
- **Ingredient → Ideas**: input what you have, get AI-generated recipe suggestions
- **Skill Adaptation**: take any recipe and simplify it for a beginner or elevate it for a pro
- **Substitution Engine**: suggest ingredient swaps that preserve the ratio

---

## Roadmap

### Phase 1 — Foundation (Now → 4 weeks)
Issues: [#1][#2][#3][#4]

- [x] **#1** Recipe CRUD with skill-level tagging
- [x] **#2** Ingredient inventory with quantity tracking
- [x] **#3** Recipe scaling engine (servings, batch, yield %)
- [ ] **#4** Full unit converter — weight, volume, temperature
- [x] Room database for persistent local storage
- [ ] Ratio Blueprint data model — define ratio schema and link recipes as variants

### Phase 2 — Pro Kitchen Tools & Inventory Scanning (4–8 weeks)
Issues: [#5][#6][#7][#8][#12]

- [ ] **#12** Barcode scanner for inventory input 
      * Implementation: Google ML Kit Vision API + Open Food Facts API + fallback to local DB.
- [ ] **#5** Prep list builder with task types, time blocks, and pre-service checklist mode
- [ ] **#6** Scan-a-recipe (camera OCR + Gemini AI parse)
- [ ] **#7** Ingredient list → AI recipe idea generator
- [ ] **#8** Density-aware unit conversions (ingredient-specific weight ↔ volume)
- [ ] Ratio Variant creator — fork any Ratio Blueprint into a new recipe variant
- [ ] Ratio library — browse community ratio blueprints (standard culinary ratios pre-loaded)

### Phase 3 — Intelligence & Polish (8–12 weeks)
Issues: [#9][#10][#11]

- [ ] **#9** Missing ingredient detection + auto grocery list
- [ ] **#10** AI skill-level adaptation (simplify or elevate any recipe)
- [ ] **#11** Recipe & prep list export (PDF + share sheet)
- [ ] Cloud sync (Firebase or Supabase)
- [ ] AI Ratio Suggestion — analyze a user's recipe and suggest the underlying ratio

### Phase 4 — CulinaryOS Integration (Future)
- [ ] API layer: expose RecipeOS data to CulinaryOS
- [ ] Menu Management sync: recipes become menu items in POS
- [ ] Inventory sync: RecipeOS stock data feeds CulinaryOS purchasing
- [ ] Prep Schedule sync: prep lists feed into labor/shift planning in CulinaryOS
- [ ] KDS integration: recipe steps and prep tasks display on kitchen screens

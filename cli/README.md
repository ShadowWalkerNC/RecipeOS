# recipe-cli

RecipeOS command-line interface — manage recipes, scale, pantry, prep lists, and shopping lists from the terminal.

## Setup

```bash
cd cli
npm install
npm run build
npm link   # makes `recipe` available globally
```

Set environment variables:
```
RECIPEOS_API_URL=http://localhost:3000
RECIPEOS_API_KEY=your-key
```

## Commands

```bash
recipe recipe list
recipe recipe list --category Sauce
recipe recipe get <id>
recipe recipe add --name "Beurre Blanc" --category Sauce --yield 500ml

recipe scale run <id> --base 4 --target 20

recipe pantry list
recipe pantry list --low
recipe pantry update <id> --qty 12.5

recipe prep generate
recipe prep generate --date 2026-06-22
recipe prep list

recipe shop list
```

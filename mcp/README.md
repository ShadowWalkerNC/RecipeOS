# RecipeOS MCP Server

Exposes RecipeOS data as tools for AI agents (Claude Desktop, Cursor, Windsurf, ShadowBot).

## Setup

```bash
cd mcp
npm install
npm run build
```

## Connect to Claude Desktop

```json
{
  "mcpServers": {
    "recipeos": {
      "command": "node",
      "args": ["/path/to/RecipeOS/mcp/dist/recipeos-server.js"],
      "env": {
        "RECIPEOS_API_URL": "http://localhost:3000",
        "RECIPEOS_API_KEY": "your-key"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|---|---|
| `get_recipe` | Search/fetch recipes by name, ID, or ingredient |
| `add_recipe` | Add a new recipe to the vault |
| `scale_recipe` | Scale recipe to target servings via ratio engine |
| `search_by_ingredient` | Find recipes using a specific ingredient |
| `get_pantry` | Current stock levels |
| `update_pantry` | Update ingredient quantity |
| `generate_prep_list` | Professional kitchen prep list for a date |
| `get_shopping_list` | Shopping list from pantry gaps |
| `convert_units` | Weight/volume conversions (g → cups, oz → ml, etc.) |

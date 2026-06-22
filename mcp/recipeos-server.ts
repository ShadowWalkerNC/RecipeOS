import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const BASE_URL = process.env.RECIPEOS_API_URL ?? 'http://localhost:3000';
const API_KEY  = process.env.RECIPEOS_API_KEY ?? '';

async function api(method: string, path: string, body?: unknown) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`);
  return res.json();
}

const server = new Server(
  { name: 'recipeos-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_recipe',
      description: 'Fetch a recipe by ID or search by name/ingredient',
      inputSchema: { type: 'object', properties: { query: { type: 'string' }, category: { type: 'string' } }, required: ['query'] },
    },
    {
      name: 'add_recipe',
      description: 'Add a new recipe to the vault',
      inputSchema: { type: 'object', properties: { name: { type: 'string' }, category: { type: 'string' }, yield: { type: 'string' }, difficulty: { type: 'string' }, ingredients: { type: 'array' }, steps: { type: 'array' } }, required: ['name', 'category'] },
    },
    {
      name: 'scale_recipe',
      description: 'Scale a recipe from base servings to a target count using ratio engine',
      inputSchema: { type: 'object', properties: { recipe_id: { type: 'string' }, base_servings: { type: 'number' }, target_servings: { type: 'number' } }, required: ['recipe_id', 'base_servings', 'target_servings'] },
    },
    {
      name: 'search_by_ingredient',
      description: 'Find recipes that use a specific ingredient',
      inputSchema: { type: 'object', properties: { ingredient: { type: 'string' } }, required: ['ingredient'] },
    },
    {
      name: 'get_pantry',
      description: 'Get current pantry stock levels',
      inputSchema: { type: 'object', properties: { low_stock_only: { type: 'boolean' } } },
    },
    {
      name: 'update_pantry',
      description: 'Update stock quantity for a pantry item',
      inputSchema: { type: 'object', properties: { item_id: { type: 'string' }, quantity: { type: 'number' } }, required: ['item_id', 'quantity'] },
    },
    {
      name: 'generate_prep_list',
      description: 'Generate a professional kitchen prep list for a given date',
      inputSchema: { type: 'object', properties: { date: { type: 'string', description: 'YYYY-MM-DD' } } },
    },
    {
      name: 'get_shopping_list',
      description: 'Get shopping list based on low-stock pantry items',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'convert_units',
      description: 'Convert between weight and volume units (grams to cups, oz to ml, etc.)',
      inputSchema: { type: 'object', properties: { value: { type: 'number' }, from_unit: { type: 'string' }, to_unit: { type: 'string' }, ingredient: { type: 'string' } }, required: ['value', 'from_unit', 'to_unit'] },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const a = args as Record<string, any>;

  try {
    switch (name) {
      case 'get_recipe': {
        const qs = `?q=${encodeURIComponent(a.query)}${a.category ? `&category=${a.category}` : ''}`;
        const data = await api('GET', `/api/recipes${qs}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'add_recipe': {
        const data = await api('POST', '/api/recipes', a);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'scale_recipe': {
        const data = await api('GET', `/api/recipes/${a.recipe_id}/scale?base=${a.base_servings}&target=${a.target_servings}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'search_by_ingredient': {
        const data = await api('GET', `/api/recipes?ingredient=${encodeURIComponent(a.ingredient)}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'get_pantry': {
        const data = await api('GET', `/api/pantry${a.low_stock_only ? '?filter=low' : ''}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'update_pantry': {
        await api('POST', `/api/pantry/${a.item_id}`, { quantity: a.quantity });
        return { content: [{ type: 'text', text: `Pantry updated: ${a.item_id} → ${a.quantity}` }] };
      }
      case 'generate_prep_list': {
        const date = a.date ?? new Date().toISOString().slice(0, 10);
        const data = await api('POST', '/api/prep/generate', { date });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'get_shopping_list': {
        const data = await api('GET', '/api/shopping-list');
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'convert_units': {
        const data = await api('POST', '/api/convert', { value: a.value, fromUnit: a.from_unit, toUnit: a.to_unit, ingredient: a.ingredient });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (err: any) {
    return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('RecipeOS MCP server running on stdio');

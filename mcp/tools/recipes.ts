import { authHeaders } from '../auth.js';

const BASE_URL = process.env.RECIPEOS_API_URL ?? 'https://recipeos.onrender.com';
const API_KEY  = process.env.RECIPEOS_API_KEY ?? '';

async function api(method: string, path: string, body?: unknown) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: authHeaders(API_KEY),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`);
  return res.json();
}

export const recipeTools = [
  {
    name: 'get_recipe',
    description: 'Search recipes by name, ingredient, or category. Returns matching recipe objects.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Name or keyword to search for' },
        category: { type: 'string', description: 'Optional category filter' },
      },
      required: ['query'],
    },
  },
  {
    name: 'add_recipe',
    description: 'Add a new recipe to the vault.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        category_id: { type: 'string' },
        description: { type: 'string' },
        base_servings: { type: 'number' },
        difficulty: { type: 'string', enum: ['Beginner', 'Intermediate', 'Advanced'] },
        tags: { type: 'array', items: { type: 'string' } },
        yield_amount: { type: 'number' },
        yield_unit: { type: 'string' },
      },
      required: ['name'],
    },
  },
  {
    name: 'scale_recipe',
    description: 'Scale a recipe from its base serving count to a target. Returns scaled ingredient amounts.',
    inputSchema: {
      type: 'object',
      properties: {
        recipe_id: { type: 'string' },
        base_servings: { type: 'number' },
        target_servings: { type: 'number' },
      },
      required: ['recipe_id', 'base_servings', 'target_servings'],
    },
  },
  {
    name: 'search_by_ingredient',
    description: 'Find all recipes that contain a specific ingredient.',
    inputSchema: {
      type: 'object',
      properties: {
        ingredient: { type: 'string', description: 'Ingredient name to search for' },
      },
      required: ['ingredient'],
    },
  },
];

export async function handleRecipeTool(name: string, a: Record<string, any>) {
  switch (name) {
    case 'get_recipe': {
      const qs = `?q=${encodeURIComponent(a.query)}${a.category ? `&category=${a.category}` : ''}`;
      return api('GET', `/api/recipes${qs}`);
    }
    case 'add_recipe':
      return api('POST', '/api/recipes', a);
    case 'scale_recipe':
      return api('GET', `/api/recipes/${a.recipe_id}/scale?base=${a.base_servings}&target=${a.target_servings}`);
    case 'search_by_ingredient':
      return api('GET', `/api/recipes?ingredient=${encodeURIComponent(a.ingredient)}`);
    default:
      throw new Error(`Unknown recipe tool: ${name}`);
  }
}

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

export const pantryTools = [
  {
    name: 'get_pantry',
    description: 'Get current pantry stock levels. Optionally filter to low-stock items only.',
    inputSchema: {
      type: 'object',
      properties: {
        low_stock_only: { type: 'boolean', description: 'If true, return only items at or below reorder threshold' },
      },
    },
  },
  {
    name: 'update_pantry',
    description: 'Update the stock quantity for a pantry item by its ID.',
    inputSchema: {
      type: 'object',
      properties: {
        item_id: { type: 'string' },
        quantity: { type: 'number' },
      },
      required: ['item_id', 'quantity'],
    },
  },
  {
    name: 'get_shopping_list',
    description: 'Returns all pantry items that are at or below their reorder threshold.',
    inputSchema: { type: 'object', properties: {} },
  },
];

export async function handlePantryTool(name: string, a: Record<string, any>) {
  switch (name) {
    case 'get_pantry':
      return api('GET', `/api/pantry${a.low_stock_only ? '?filter=low' : ''}`);
    case 'update_pantry':
      return api('PATCH', `/api/pantry/${a.item_id}`, { quantity: a.quantity });
    case 'get_shopping_list':
      return api('GET', '/api/shopping-list');
    default:
      throw new Error(`Unknown pantry tool: ${name}`);
  }
}

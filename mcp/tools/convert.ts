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

export const convertTools = [
  {
    name: 'convert_units',
    description: 'Convert between weight and volume units for common baking ingredients (e.g. grams ↔ cups).',
    inputSchema: {
      type: 'object',
      properties: {
        value: { type: 'number', description: 'The numeric value to convert' },
        from_unit: { type: 'string', description: 'Source unit (e.g. g, grams, cups, cup)' },
        to_unit: { type: 'string', description: 'Target unit' },
        ingredient: { type: 'string', description: 'Ingredient name for density-based conversion (e.g. flour, sugar, butter)' },
      },
      required: ['value', 'from_unit', 'to_unit'],
    },
  },
];

export async function handleConvertTool(name: string, a: Record<string, any>) {
  switch (name) {
    case 'convert_units':
      return api('POST', '/api/convert', { value: a.value, fromUnit: a.from_unit, toUnit: a.to_unit, ingredient: a.ingredient });
    default:
      throw new Error(`Unknown convert tool: ${name}`);
  }
}

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

export const prepTools = [
  {
    name: 'generate_prep_list',
    description: 'Generate a kitchen prep list for a given date. Returns tasks grouped by station.',
    inputSchema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Target date in YYYY-MM-DD format. Defaults to today.' },
      },
    },
  },
];

export async function handlePrepTool(name: string, a: Record<string, any>) {
  switch (name) {
    case 'generate_prep_list': {
      const date = a.date ?? new Date().toISOString().slice(0, 10);
      return api('POST', '/api/prep/generate', { date });
    }
    default:
      throw new Error(`Unknown prep tool: ${name}`);
  }
}

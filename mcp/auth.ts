/**
 * RecipeOS MCP — Auth stub
 * Phase 3: validates RECIPEOS_API_KEY env var.
 * Phase 5: will accept CulinaryOS JWT and verify via Supabase Edge Function.
 */

export function validateApiKey(key: string | undefined): void {
  const expected = process.env.RECIPEOS_API_KEY;
  if (!expected) throw new Error('RECIPEOS_API_KEY is not configured on the server.');
  if (key !== expected) throw new Error('Invalid API key.');
}

export function authHeaders(key: string): Record<string, string> {
  return {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
}

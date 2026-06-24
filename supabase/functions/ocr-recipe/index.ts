import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const SYSTEM_PROMPT = `
You are a recipe extraction assistant. The user will provide a photo of a recipe 
(handwritten or printed). Extract the recipe and return ONLY a valid JSON object 
with this exact structure — no markdown, no commentary:

{
  "name": string,
  "description": string | null,
  "base_servings": number,
  "difficulty": "Beginner" | "Intermediate" | "Advanced" | null,
  "yield_amount": number | null,
  "yield_unit": string | null,
  "tags": string[],
  "ingredients": [
    {
      "name_override": string,
      "amount": number,
      "unit": string | null,
      "sort_order": number
    }
  ],
  "steps": [
    {
      "step_number": number,
      "instruction": string
    }
  ]
}

Rules:
- base_servings defaults to 4 if unclear
- difficulty: Beginner = simple home cooking, Intermediate = some technique, Advanced = professional technique
- Keep ingredient amounts as numbers (e.g. 1.5 not "1 1/2")
- Keep instructions clear and concise
- Return null for fields you cannot determine
`.trim();

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      },
    });
  }

  try {
    // Verify JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Unauthorized' }, 401);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return json({ error: 'Unauthorized' }, 401);

    // Parse body
    const { image } = await req.json() as { image: string };
    if (!image) return json({ error: 'Missing image field' }, 400);

    // Call GPT-4o Vision
    const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 2048,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: `data:image/jpeg;base64,${image}`, detail: 'high' },
              },
              {
                type: 'text',
                text: 'Extract the recipe from this image and return the JSON.',
              },
            ],
          },
        ],
      }),
    });

    if (!oaiRes.ok) {
      const err = await oaiRes.text();
      console.error('OpenAI error:', err);
      return json({ error: 'OCR service error', detail: err }, 502);
    }

    const oaiData = await oaiRes.json();
    const raw = oaiData.choices?.[0]?.message?.content ?? '';

    // Strip any accidental markdown fences
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    let recipe: Record<string, unknown>;
    try {
      recipe = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse GPT response:', cleaned);
      return json({ error: 'Could not parse recipe from image. Try a clearer photo.' }, 422);
    }

    return json(recipe, 200);
  } catch (err) {
    console.error('Unhandled error:', err);
    return json({ error: 'Internal server error' }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

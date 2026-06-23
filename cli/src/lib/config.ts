import fs from 'fs';
import os from 'os';
import path from 'path';

const CONFIG_PATH = path.join(os.homedir(), '.recipeos.json');

export interface RecipeOSConfig {
  apiUrl?: string;
  apiKey?: string;
}

export function loadConfig(): RecipeOSConfig {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }
  } catch {}
  return {};
}

export function saveConfig(updates: Partial<RecipeOSConfig>): void {
  const current = loadConfig();
  const next = { ...current, ...updates };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2), 'utf-8');
}

import 'dotenv/config';
import { loadConfig } from './config.js';

export function getBaseUrl(): string {
  return process.env.RECIPEOS_API_URL ?? loadConfig().apiUrl ?? 'http://localhost:3000';
}

export function getApiKey(): string {
  return process.env.RECIPEOS_API_KEY ?? loadConfig().apiKey ?? '';
}

function headers(): Record<string, string> {
  return { Authorization: `Bearer ${getApiKey()}`, 'Content-Type': 'application/json' };
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${getBaseUrl()}${path}`, {
    method,
    headers: headers(),
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = `${method} ${path} failed: ${res.status}`;
    try { const e = await res.json(); msg += ` — ${e.error ?? JSON.stringify(e)}`; } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const apiGet    = <T>(path: string)               => request<T>('GET',    path);
export const apiPost   = <T>(path: string, body: unknown) => request<T>('POST',   path, body);
export const apiPatch  = <T>(path: string, body: unknown) => request<T>('PATCH',  path, body);
export const apiDelete = <T>(path: string)               => request<T>('DELETE', path);

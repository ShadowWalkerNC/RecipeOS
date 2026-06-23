// TODO Phase 1.3 — Supabase auth callback handler
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get('next') ?? '/vault';
  // Supabase session exchange wired in Phase 1.3
  return NextResponse.redirect(new URL(next, request.url));
}

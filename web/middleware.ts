import { type NextRequest, NextResponse } from 'next/server';

// Placeholder middleware — Supabase session refresh wired in Phase 1.2
export async function middleware(request: NextRequest) {
  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

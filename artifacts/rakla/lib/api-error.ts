import { NextResponse } from 'next/server';

export function apiError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : '';
  if (message.startsWith('MONGODB_URI') || message.startsWith('JWT_SECRET') || message.startsWith('STRIPE_')) {
    console.error(`[RAKLA API configuration] ${message}`);
    return NextResponse.json({ error: message }, { status: 503 });
  }
  console.error(`[RAKLA API] ${fallback}`, error instanceof Error ? error.name : 'UnknownError');
  return NextResponse.json({ error: fallback }, { status: 500 });
}

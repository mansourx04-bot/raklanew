import jwt from 'jsonwebtoken';
import type { NextRequest, NextResponse } from 'next/server';

export const SESSION_COOKIE = 'rakla_session';
const SESSION_AGE_SECONDS = 7 * 24 * 60 * 60;
const JWT_ISSUER = 'rakla-api';
const JWT_AUDIENCE = 'rakla-store';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET is missing or too short. Add a long random value in Replit Secrets.');
  }
  return secret;
}

export function issueSessionToken(userId: string) {
  return jwt.sign({}, getSecret(), {
    subject: userId,
    expiresIn: SESSION_AGE_SECONDS,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
}

export function readSessionUserId(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, getSecret(), { issuer: JWT_ISSUER, audience: JWT_AUDIENCE });
    return typeof payload === 'object' && payload.sub ? payload.sub : null;
  } catch {
    return null;
  }
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_AGE_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { apiError } from '../../../../lib/api-error';
import { dbConnect } from '../../../../lib/db';
import { issueSessionToken, setSessionCookie } from '../../../../lib/session';
import { publicUser } from '../../../../lib/public-user';
import { User } from '../../../../models/User';

export const runtime = 'nodejs';

const inputSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
  }
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
  }

  try {
    await dbConnect();
    const email = parsed.data.email.trim().toLowerCase();
    const user = await User.findOne({ email }).select('+passwordHash');
    const valid = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;
    if (!user || !valid) {
      return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    }
    const token = issueSessionToken(String(user._id));
    const response = NextResponse.json({ user: publicUser(user) });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    return apiError(error, 'Could not log in.');
  }
}

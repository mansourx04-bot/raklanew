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
  displayName: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Please provide valid account details.' }, { status: 400 });
  }
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please provide a valid name, email and password of at least 8 characters.' }, { status: 400 });
  }

  try {
    await dbConnect();
    const name = parsed.data.displayName.trim();
    const email = parsed.data.email.trim().toLowerCase();
    if (await User.exists({ email })) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await User.create({ name, email, passwordHash });
    let token: string;
    try {
      token = issueSessionToken(String(user._id));
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      throw error;
    }
    const response = NextResponse.json({ user: publicUser(user) }, { status: 201 });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    if ((error as { code?: number })?.code === 11000) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 });
    }
    return apiError(error, 'Could not create your account.');
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { apiError } from '../../../../lib/api-error';
import { dbConnect } from '../../../../lib/db';
import { readSessionUserId } from '../../../../lib/session';
import { publicUser } from '../../../../lib/public-user';
import { User } from '../../../../models/User';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const userId = readSessionUserId(request);
  if (!userId) return NextResponse.json({ error: 'A valid session is required.' }, { status: 401 });
  try {
    await dbConnect();
    const user = await User.findById(userId).lean();
    if (!user) return NextResponse.json({ error: 'Account no longer exists.' }, { status: 401 });
    return NextResponse.json(publicUser(user));
  } catch (error) {
    return apiError(error, 'Could not load your account.');
  }
}

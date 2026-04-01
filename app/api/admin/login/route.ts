import { NextResponse } from 'next/server';
import { signAdminToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Sign admin JWT
    const token = await signAdminToken();

    // Set HttpOnly cookie for admin session
    cookies().set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 12, // 12 hours
      path: '/'
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Admin Login Error:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}

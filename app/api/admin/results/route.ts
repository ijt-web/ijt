import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const token = cookies().get('admin_token')?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}

export async function GET() {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const results = await prisma.result.findMany({
      include: {
        student: true,
        answers: {
          include: {
            question: true
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });

    return NextResponse.json(results);

  } catch (error) {
    console.error('Fetch Results Error:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}

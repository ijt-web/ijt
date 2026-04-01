import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const token = cookies().get('admin_token')?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}

export async function GET(req: Request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const studentClass = searchParams.get('class');

    const questions = await prisma.question.findMany({
      where: studentClass ? { class: studentClass } : {},
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(questions);

  } catch (error) {
    console.error('Fetch Questions Error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const question = await prisma.question.create({
      data: {
        ...body,
        stream: body.stream || 'all'
      }
    });

    return NextResponse.json(question, { status: 201 });

  } catch (error) {
    console.error('Create Question Error:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}

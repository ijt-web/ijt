import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const token = cookies().get('admin_token')?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { class: studentClass, questions } = await req.json();

    if (!studentClass || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const created = await prisma.question.createMany({
      data: questions.map((q: any) => ({
        class: studentClass,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption: q.correctOption,
        stream: q.stream || 'all'
      }))
    });

    return NextResponse.json({ inserted: created.count }, { status: 201 });

  } catch (error) {
    console.error('Bulk Import Error:', error);
    return NextResponse.json({ error: 'Failed to import questions' }, { status: 500 });
  }
}

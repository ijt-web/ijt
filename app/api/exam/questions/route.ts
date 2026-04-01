import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyStudentToken } from '@/lib/jwt';
import { seededShuffle } from '@/lib/shuffle';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = await verifyStudentToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const studentClass = decoded.class;
    const studentId = decoded.studentId;

    // Fetch questions for student's class
    const fetchedQuestions = await prisma.question.findMany({
      where: { class: studentClass }
    });

    // Shuffle questions with seed = studentId (consistent on refresh)
    const shuffled = seededShuffle(fetchedQuestions, studentId);

    // Strip the correctOption from each question for the frontend
    const sanitized = shuffled.map((q: any) => {
      const { correctOption, ...rest } = q;
      return rest;
    });

    return NextResponse.json(sanitized);

  } catch (error) {
    console.error('Fetch Questions Error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

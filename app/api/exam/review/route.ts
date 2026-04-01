import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyStudentToken } from '@/lib/jwt';

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

    // Find the student's result with all answers
    const result = await prisma.result.findUnique({
      where: { studentId: decoded.id },
      include: {
        answers: {
          include: {
            question: true
          }
        }
      }
    });

    if (!result) {
      return NextResponse.json({ error: 'No result found' }, { status: 404 });
    }

    // Format answer review data
    const reviewAnswers = result.answers.map((a) => ({
      questionId: a.questionId,
      questionText: a.question.questionText,
      optionA: a.question.optionA,
      optionB: a.question.optionB,
      optionC: a.question.optionC,
      optionD: a.question.optionD,
      correctOption: a.question.correctOption,
      selectedOption: a.selectedOption
    }));

    return NextResponse.json({ answers: reviewAnswers });

  } catch (error) {
    console.error('Review Error:', error);
    return NextResponse.json({ error: 'Failed to fetch review' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyStudentToken } from '@/lib/jwt';

export async function POST(req: Request) {
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

    const { answers } = await req.json(); // Array: [{ questionId, selectedOption }]

    // Prevent double submission
    const existingResult = await prisma.result.findUnique({
      where: { studentId: decoded.id }
    });

    if (existingResult) {
      return NextResponse.json({ error: 'Exam already submitted' }, { status: 409 });
    }

    // Fetch correct options to calculate marks
    const questions = await prisma.question.findMany({
      where: { id: { in: answers.map((a: any) => a.questionId) } }
    });

    const questionsMap = questions.reduce((acc: any, q) => {
      acc[q.id] = q.correctOption;
      return acc;
    }, {});

    // Scoring logic
    let marks = 0;
    const total = answers.length;

    answers.forEach((a: any) => {
      if (questionsMap[a.questionId] === a.selectedOption) {
        marks++;
      }
    });

    const percentage = total > 0 ? (marks / total) * 100 : 0;

    // Fetch config for passing percentage
    const config = await prisma.examConfig.findFirst() || { passingPercentage: 50 };
    const passed = percentage >= config.passingPercentage;

    // Save atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      const res = await tx.result.create({
        data: {
          studentId: decoded.id,
          marks,
          total,
          percentage,
          passed
        }
      });

      await tx.attemptAnswer.createMany({
        data: answers.map((a: any) => ({
          resultId: res.id,
          questionId: a.questionId,
          selectedOption: a.selectedOption
        }))
      });

      return res;
    });

    // Return full result info for page redirect
    const student = await prisma.student.findUnique({
      where: { id: decoded.id }
    });

    return NextResponse.json({
      marks,
      total,
      percentage,
      passed,
      rollNumber: student?.rollNumber,
      name: student?.name,
      class: student?.class
    }, { status: 201 });

  } catch (error) {
    console.error('Submit Error:', error);
    return NextResponse.json({ error: 'Failed to submit exam' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyStudentToken, verifyExamStart } from '@/lib/jwt';

const MIN_EXAM_SECONDS = 120; // 2 minutes minimum to prevent bots

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

    const { answers, startTimeToken } = await req.json();

    // Anti-cheat: Verify minimum time spent on exam
    if (startTimeToken) {
      const examStart = await verifyExamStart(startTimeToken);
      if (examStart && examStart.startTime) {
        const elapsedSeconds = (Date.now() - examStart.startTime) / 1000;
        if (elapsedSeconds < MIN_EXAM_SECONDS) {
          return NextResponse.json(
            { error: `Submission rejected: Exam completed suspiciously fast (${Math.round(elapsedSeconds)}s). Minimum ${MIN_EXAM_SECONDS}s required.` },
            { status: 403 }
          );
        }
      }
    }

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

    // Fetch student to get their stream
    const student = await prisma.student.findUnique({
      where: { id: decoded.id }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Save atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      const res = await tx.result.create({
        data: {
          studentId: decoded.id,
          marks,
          total,
          percentage,
          passed,
          stream: student.stream
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



    return NextResponse.json({
      marks,
      total,
      percentage,
      passed,
      rollNumber: student?.rollNumber,
      name: student?.name,
      class: student?.class,
      stream: student?.stream
    }, { status: 201 });

  } catch (error) {
    console.error('Submit Error:', error);
    return NextResponse.json({ error: 'Failed to submit exam' }, { status: 500 });
  }
}

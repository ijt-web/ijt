import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signStudentToken } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const { studentId, password } = await req.json();

    if (!studentId || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    // Find student and include result check
    const student = await prisma.student.findUnique({
      where: { studentId },
      include: { result: true }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, student.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Redirect if already submitted
    if (student.result) {
      return NextResponse.json({ 
        redirect: 'result',
        message: 'You have already completed the exam.'
      });
    }

    // Sign student JWT
    const token = await signStudentToken({
      id: student.id,
      studentId: student.studentId,
      class: student.class,
      name: student.name,
      stream: student.stream
    });

    return NextResponse.json({ token }, { status: 200 });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}

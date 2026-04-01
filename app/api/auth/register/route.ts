import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signStudentToken } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const { name, fatherName, studentId, password, class: studentClass } = await req.json();

    if (!name || !fatherName || !studentId || !password || !studentClass) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if studentId already exists
    const existing = await prisma.student.findUnique({
      where: { studentId }
    });

    if (existing) {
      return NextResponse.json({ error: 'Student ID already registered. Please login.' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student (rollNumber is explicitly set to the 5-digit random studentId)
    const student = await prisma.student.create({
      data: {
        name,
        fatherName,
        studentId,
        rollNumber: parseInt(studentId, 10),
        password: hashedPassword,
        class: studentClass
      }
    });

    // Sign student JWT
    const token = await signStudentToken({
      id: student.id,
      studentId: student.studentId,
      class: student.class,
      name: student.name
    });

    return NextResponse.json({ 
      token, 
      rollNumber: student.rollNumber 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Failed to register student' }, { status: 500 });
  }
}

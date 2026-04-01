import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.examConfig.findFirst();
    return NextResponse.json({ status: 'ok', db: 'connected' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ status: 'error', db: 'disconnected' }, { status: 500 });
  }
}

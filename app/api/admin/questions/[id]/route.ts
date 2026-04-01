import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const token = cookies().get('admin_token')?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const updated = await prisma.question.update({
      where: { id: params.id },
      data: body
    });

    return NextResponse.json(updated);

  } catch (error) {
    console.error('Update Question Error:', error);
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.question.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete Question Error:', error);
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const token = cookies().get('admin_token')?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}

export async function GET() {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let config = await prisma.examConfig.findFirst();

    // Seed default if not exists
    if (!config) {
      config = await prisma.examConfig.create({
        data: {
          durationMinutes: 55,
          passingPercentage: 50,
          orgName: 'Study Aid project'
        }
      });
    }

    return NextResponse.json(config);

  } catch (error) {
    console.error('Fetch Config Error:', error);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const config = await prisma.examConfig.findFirst();

    if (config) {
      const updated = await prisma.examConfig.update({
        where: { id: config.id },
        data: body
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.examConfig.create({
        data: body
      });
      return NextResponse.json(created);
    }

  } catch (error) {
    console.error('Update Config Error:', error);
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    let config = await prisma.examConfig.findFirst();

    if (!config) {
      config = await prisma.examConfig.create({
        data: {
          durationMinutes: 55,
          passingPercentage: 50,
          orgName: 'Islami Jamiat Talba'
        }
      });
    }

    // Return only public fields
    return NextResponse.json({
      durationMinutes: config.durationMinutes,
      orgName: config.orgName,
      logoUrl: config.logoUrl
    });

  } catch (error) {
    console.error('Public Config Error:', error);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

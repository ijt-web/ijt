import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

async function verifyAdmin() {
  const token = cookies().get('admin_token')?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('logo') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase bucket 'logo'
    const { data, error: uploadError } = await supabase.storage
      .from('logo')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      if (uploadError.message?.toLowerCase().includes('jwt')) {
        throw new Error('Supabase Auth Error: Make sure your .env has the SUPABASE_SERVICE_ROLE_KEY, not the public anon key.');
      }
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('logo')
      .getPublicUrl(filePath);

    const logoUrl = urlData.publicUrl;

    // Update ExamConfig
    const config = await prisma.examConfig.findFirst();
    if (config) {
      await prisma.examConfig.update({
        where: { id: config.id },
        data: { logoUrl }
      });
    } else {
      await prisma.examConfig.create({
        data: { logoUrl }
      });
    }

    return NextResponse.json({ logoUrl });

  } catch (error: any) {
    console.error('Logo Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload logo' }, { status: 500 });
  }
}

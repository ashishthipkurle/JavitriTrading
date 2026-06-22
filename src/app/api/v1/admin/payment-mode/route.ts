import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const modeSetting = await prisma.siteSettings.findUnique({
      where: { key: 'payment_mode' }
    });
    
    const qrSetting = await prisma.siteSettings.findUnique({
      where: { key: 'payment_qr_url' }
    });

    return NextResponse.json({
      mode: modeSetting?.value || 'MANUAL',
      qrUrl: qrSetting?.value || ''
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mode, qrUrl } = await req.json();

    if (mode && (mode === 'MANUAL' || mode === 'RAZORPAY')) {
      await prisma.siteSettings.upsert({
        where: { key: 'payment_mode' },
        update: { value: mode },
        create: { key: 'payment_mode', value: mode }
      });
    }

    if (qrUrl !== undefined) {
      await prisma.siteSettings.upsert({
        where: { key: 'payment_qr_url' },
        update: { value: qrUrl },
        create: { key: 'payment_qr_url', value: qrUrl }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

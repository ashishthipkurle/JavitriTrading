import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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

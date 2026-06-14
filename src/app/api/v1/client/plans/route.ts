import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plans = await prisma.fDPlan.findMany({
      where: { isActive: true },
      orderBy: { minAmount: 'asc' }
    });

    return NextResponse.json({ success: true, data: plans });
  } catch (error) {
    console.error('Plans API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

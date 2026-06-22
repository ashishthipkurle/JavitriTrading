export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { InvestmentStatus } from '@prisma/client';

export async function GET() {
  try {
    const [aumResult, totalUsersCount, activePlansCount] = await Promise.all([
      prisma.investment.aggregate({
        where: { status: InvestmentStatus.ACTIVE },
        _sum: { amount: true },
      }),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.fDPlan.count({ where: { isActive: true } }),
    ]);

    const totalAUM = Number(aumResult._sum.amount || 0);

    return NextResponse.json({
      totalAUM,
      totalUsers: totalUsersCount,
      activePlans: activePlansCount,
    });
  } catch {
    return NextResponse.json({ totalAUM: 0, totalUsers: 0, activePlans: 0 });
  }
}

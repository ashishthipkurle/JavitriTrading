import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getAuthUser();
    
    if (!user || user.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const investments = await prisma.investment.findMany({
      where: { userId: user.id },
      include: {
        plan: true,
        payouts: {
          orderBy: { paidOn: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const recentTransactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const activeInvestmentsTotal = investments
      .filter(i => i.status === 'ACTIVE')
      .reduce((sum, inv) => sum + Number(inv.amount), 0);

    const totalEarned = investments
      .reduce((sum, inv) => sum + Number(inv.totalEarned), 0);

    return NextResponse.json({
      success: true,
      data: {
        walletBalance: Number(user.walletBalance),
        activeInvestmentsTotal,
        totalEarned,
        investments,
        recentTransactions,
        kycStatus: user.kycStatus
      }
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

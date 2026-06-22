import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: transactionId } = await params;

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction || transaction.type !== 'DEPOSIT' || transaction.status !== 'PENDING') {
      return NextResponse.json({ error: 'Invalid transaction' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update transaction status
      await tx.transaction.update({
        where: { id: transactionId },
        data: {
          status: 'SUCCESS',
          meta: {
            ...(transaction.meta as object),
            approvedBy: user.id,
            approvedAt: new Date().toISOString()
          }
        }
      });

      // 2. Add amount to client's wallet
      await tx.user.update({
        where: { id: transaction.userId },
        data: {
          walletBalance: { increment: transaction.amount }
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Approve Deposit Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

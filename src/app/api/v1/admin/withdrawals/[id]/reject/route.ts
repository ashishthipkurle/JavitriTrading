import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    
    // Allow ADMIN and EMPLOYEE
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { reason } = await req.json();

    if (!reason || !reason.trim()) {
      return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
    }

    // Fetch the withdrawal request
    const withdrawal = await prisma.withdrawalRequest.findUnique({
      where: { id }
    });

    if (!withdrawal || withdrawal.status !== 'PENDING') {
      return NextResponse.json({ error: 'Invalid or already processed withdrawal request' }, { status: 400 });
    }

    // Fetch the corresponding transaction
    const transaction = await prisma.transaction.findFirst({
      where: {
        userId: withdrawal.userId,
        type: 'WITHDRAWAL',
        status: 'PENDING',
        meta: { path: ['withdrawalRequestId'], equals: withdrawal.id }
      }
    });

    // Run atomic transaction to update statuses and REFUND the user
    await prisma.$transaction([
      // 1. Update WithdrawalRequest
      prisma.withdrawalRequest.update({
        where: { id },
        data: { 
          status: 'FAILED',
          failureReason: reason
        }
      }),
      
      // 2. Update Transaction
      ...(transaction ? [
        prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'FAILED',
            meta: {
              ...(transaction.meta as object || {}),
              withdrawalRequestId: withdrawal.id,
              rejectedBy: user.id,
              rejectionReason: reason
            }
          }
        })
      ] : []),

      // 3. Refund the wallet balance
      prisma.user.update({
        where: { id: withdrawal.userId },
        data: {
          walletBalance: { increment: withdrawal.amount }
        }
      })
    ]);

    return NextResponse.json({ success: true, message: 'Withdrawal rejected and refunded successfully' });

  } catch (error: any) {
    console.error('Reject Withdrawal Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

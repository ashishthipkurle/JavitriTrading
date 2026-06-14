import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    
    if (!user || user.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.kycStatus !== 'APPROVED') {
      return NextResponse.json({ error: 'KYC must be approved to withdraw' }, { status: 403 });
    }

    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Atomic withdrawal request creation
    const withdrawal = await prisma.$transaction(async (tx) => {
      const currentUser = await tx.user.findUnique({ where: { id: user.id } });
      
      if (Number(currentUser?.walletBalance) < amount) {
        throw new Error('Insufficient wallet balance');
      }

      // Deduct balance immediately
      await tx.user.update({
        where: { id: user.id },
        data: { walletBalance: { decrement: amount } }
      });

      // Create withdrawal request
      const req = await tx.withdrawalRequest.create({
        data: {
          userId: user.id,
          amount,
          status: 'PENDING'
        }
      });

      // Create transaction log
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: 'WITHDRAWAL',
          amount,
          status: 'PENDING',
          meta: { withdrawalRequestId: req.id }
        }
      });

      return req;
    });

    return NextResponse.json({ success: true, data: withdrawal }, { status: 201 });

  } catch (error: any) {
    console.error('Withdraw API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

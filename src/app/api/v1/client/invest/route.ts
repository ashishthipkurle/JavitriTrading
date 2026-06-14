import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { addMonths } from 'date-fns';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    
    if (!user || user.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.kycStatus !== 'APPROVED') {
      return NextResponse.json({ error: 'KYC must be approved to invest' }, { status: 403 });
    }

    const { planId, amount } = await req.json();

    if (!planId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid investment details' }, { status: 400 });
    }

    // Use a transaction to ensure wallet balance deduction and investment creation are atomic
    const result = await prisma.$transaction(async (tx) => {
      const plan = await tx.fDPlan.findUnique({ where: { id: planId } });
      if (!plan || !plan.isActive) {
        throw new Error('Plan not found or inactive');
      }

      if (amount < Number(plan.minAmount) || amount > Number(plan.maxAmount)) {
        throw new Error(`Amount must be between ₹${plan.minAmount} and ₹${plan.maxAmount}`);
      }

      const currentUser = await tx.user.findUnique({ where: { id: user.id } });
      if (Number(currentUser?.walletBalance) < amount) {
        throw new Error('Insufficient wallet balance');
      }

      // Deduct balance
      await tx.user.update({
        where: { id: user.id },
        data: { walletBalance: { decrement: amount } }
      });

      // Calculate dates and returns
      const startDate = new Date();
      const maturityDate = addMonths(startDate, plan.tenureMonths);
      const monthlyReturn = (amount * Number(plan.monthlyReturnPercent)) / 100;

      // Create investment
      const investment = await tx.investment.create({
        data: {
          userId: user.id,
          planId: plan.id,
          managedBy: user.managedBy,
          amount,
          startDate,
          maturityDate,
          monthlyReturn,
          status: 'ACTIVE',
        }
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: 'INVESTMENT',
          amount,
          status: 'SUCCESS',
          meta: { investmentId: investment.id, planName: plan.name }
        }
      });

      return investment;
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });

  } catch (error: any) {
    console.error('Invest API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

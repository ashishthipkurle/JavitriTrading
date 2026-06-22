import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }

    const plan = await prisma.fDPlan.findUnique({
      where: { id: planId, isActive: true },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found or inactive' }, { status: 404 });
    }

    const planAmount = Number(plan.amount);

    // Fetch user's current wallet balance securely from DB
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    if (Number(dbUser.walletBalance) < planAmount) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 });
    }

    // Process investment
    await prisma.$transaction(async (tx) => {
      // 1. Deduct from wallet
      await tx.user.update({
        where: { id: user.id },
        data: {
          walletBalance: { decrement: planAmount }
        }
      });

      const tenureDays = 365;
      const startDate = new Date();
      const maturityDate = new Date(startDate);
      maturityDate.setDate(maturityDate.getDate() + tenureDays);

      // 3. Create Investment
      const inv = await tx.investment.create({
        data: {
          userId: user.id,
          planId: plan.id,
          managedBy: dbUser.managedBy,
          amount: planAmount,
          startDate,
          maturityDate,
          status: 'ACTIVE',
          monthlyReturn: plan.dailyReturnAmount,
        }
      });

      // 2. Create Transaction for the deduction
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: 'INVESTMENT',
          amount: planAmount,
          status: 'SUCCESS',
          meta: {
            investmentId: inv.id,
            planName: plan.name,
            source: 'WALLET_BALANCE',
            tenureDays
          }
        }
      });

      // 4. Create Notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: 'Investment Confirmed',
          message: `Your investment of ₹${planAmount.toLocaleString()} in ${plan.name} (paid via Wallet) has been confirmed. Daily returns of ₹${Number(plan.dailyReturnAmount).toLocaleString()} will be credited to your wallet.`,
          type: 'SUCCESS',
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    let errMsg = 'Failed to process wallet investment';
    if (error instanceof Error) {
      errMsg = error.message;
    }
    console.error('[create-from-wallet] ERROR:', errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

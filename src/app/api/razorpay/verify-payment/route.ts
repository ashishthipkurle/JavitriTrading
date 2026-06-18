import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
      return NextResponse.json({ error: 'Missing required payment fields' }, { status: 400 });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    // Fetch the plan
    const plan = await prisma.fDPlan.findUnique({
      where: { id: planId, isActive: true },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const amount = Number(plan.amount);
    const dailyReturn = Number(plan.dailyReturnAmount);

    // Default tenure: 365 days for self-registered users
    const tenureDays = 365;
    const startDate = new Date();
    const maturityDate = new Date(startDate);
    maturityDate.setDate(maturityDate.getDate() + tenureDays);

    // Create investment and transaction atomically
    const investment = await prisma.$transaction(async (tx) => {
      // Create the investment record
      const inv = await tx.investment.create({
        data: {
          userId: user.id,
          planId: plan.id,
          amount,
          startDate,
          maturityDate,
          monthlyReturn: dailyReturn,
          status: 'ACTIVE',
        },
      });

      // Create the transaction record
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: 'INVESTMENT',
          amount,
          status: 'SUCCESS',
          meta: {
            investmentId: inv.id,
            planName: plan.name,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            tenureDays,
          },
        },
      });

      // Create a notification for the user
      await tx.notification.create({
        data: {
          userId: user.id,
          title: 'Investment Confirmed',
          message: `Your investment of ₹${amount.toLocaleString()} in ${plan.name} has been confirmed. Daily returns of ₹${dailyReturn.toLocaleString()} will be credited to your wallet.`,
          type: 'SUCCESS',
        },
      });

      return inv;
    });

    return NextResponse.json({
      success: true,
      investmentId: investment.id,
    });
  } catch (error) {
    console.error('Razorpay Verify Payment Error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}

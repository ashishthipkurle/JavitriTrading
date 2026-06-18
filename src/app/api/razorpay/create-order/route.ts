import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    console.log('[create-order] Starting...');
    const user = await getAuthUser();
    console.log('[create-order] User:', user?.id || 'null');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json();
    console.log('[create-order] planId:', planId);

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }

    // Fetch the plan from DB to get the amount (prevent client-side tampering)
    const plan = await prisma.fDPlan.findUnique({
      where: { id: planId, isActive: true },
    });
    console.log('[create-order] Plan found:', plan?.name || 'null');

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found or inactive' }, { status: 404 });
    }

    const amountInPaise = Math.round(Number(plan.amount) * 100); // Razorpay expects paise
    console.log('[create-order] Amount in paise:', amountInPaise);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `inv_${Date.now()}`,
      notes: {
        userId: user.id,
        planId: plan.id,
        planName: plan.name,
      },
    });
    console.log('[create-order] Order created:', order.id);

    return NextResponse.json({
      orderId: order.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      planName: plan.name,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
    });
  } catch (error: unknown) {
    let errMsg = 'Failed to create order';
    if (error instanceof Error) {
      errMsg = error.message;
    } else if (typeof error === 'object' && error !== null) {
      errMsg = JSON.stringify(error);
    } else {
      errMsg = String(error);
    }
    console.error('[create-order] ERROR:', errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

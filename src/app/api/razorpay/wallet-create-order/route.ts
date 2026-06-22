import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, targetClientId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    let depositUserId = user.id;

    if (targetClientId && targetClientId !== user.id) {
      if (user.role !== 'EMPLOYEE' && user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Only employees or admins can top up another wallet' }, { status: 403 });
      }
      depositUserId = targetClientId;
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `wallet_${Date.now()}`,
      notes: {
        type: 'WALLET_DEPOSIT',
        userId: depositUserId,
        addedBy: targetClientId ? user.id : null,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
    });
  } catch (error: unknown) {
    let errMsg = 'Failed to create wallet order';
    if (error instanceof Error) {
      errMsg = error.message;
    }
    console.error('[wallet-create-order] ERROR:', errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

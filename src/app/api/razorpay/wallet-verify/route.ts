import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !amount) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const userId = user.id;

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Process the top-up in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Create Transaction record
      await tx.transaction.create({
        data: {
          userId,
          type: 'DEPOSIT',
          amount,
          razorpayId: razorpay_payment_id,
          status: 'SUCCESS',
          meta: {
            source: 'RAZORPAY_WALLET_TOPUP',
            orderId: razorpay_order_id
          }
        }
      });

      // 2. Increment Wallet Balance
      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            increment: amount
          }
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    let errMsg = 'Failed to verify wallet payment';
    if (error instanceof Error) {
      errMsg = error.message;
    }
    console.error('[wallet-verify] ERROR:', errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

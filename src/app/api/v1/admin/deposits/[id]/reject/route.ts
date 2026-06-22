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
    const { reason } = await req.json();

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction || transaction.type !== 'DEPOSIT' || transaction.status !== 'PENDING') {
      return NextResponse.json({ error: 'Invalid transaction' }, { status: 400 });
    }

    // Reject transaction (no wallet update needed)
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'FAILED',
        meta: {
          ...(transaction.meta as object),
          rejectedBy: user.id,
          rejectedAt: new Date().toISOString(),
          rejectionReason: reason || 'Rejected by Admin'
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Reject Deposit Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

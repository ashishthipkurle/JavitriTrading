import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'EMPLOYEE') {
      return NextResponse.json({ error: 'Unauthorized. Must be an employee.' }, { status: 401 });
    }

    const { clientId, amount, notes } = await req.json();

    if (!clientId || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    // Verify employee manages this client
    const client = await prisma.user.findUnique({
      where: { id: clientId }
    });

    if (!client || client.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    if (client.managedBy !== user.id) {
      return NextResponse.json({ error: 'You are not the manager for this client' }, { status: 403 });
    }

    const topupAmount = Number(amount);

    // Process top-up
    await prisma.$transaction(async (tx) => {
      // 1. Increment Balance
      await tx.user.update({
        where: { id: clientId },
        data: {
          walletBalance: { increment: topupAmount }
        }
      });

      // 2. Create Transaction
      await tx.transaction.create({
        data: {
          userId: clientId,
          type: 'DEPOSIT',
          amount: topupAmount,
          status: 'SUCCESS',
          meta: {
            source: 'EMPLOYEE_MANUAL_CASH',
            employeeId: user.id,
            description: notes || 'Cash deposit (Employee)'
          }
        }
      });
      
      // 3. Create Audit Log
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: 'WALLET_TOPUP',
          targetId: clientId,
          meta: {
            amount: topupAmount,
            notes
          }
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    let errMsg = 'Failed to process manual wallet top-up';
    if (error instanceof Error) {
      errMsg = error.message;
    }
    console.error('[employee/wallet-add] ERROR:', errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

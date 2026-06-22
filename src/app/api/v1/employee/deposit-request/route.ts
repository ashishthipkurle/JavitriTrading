import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== 'EMPLOYEE' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, clientId, notes, proofUrl } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }
    
    if (!clientId) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    // Verify client exists
    const client = await prisma.user.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Create a pending transaction for the deposit request
    const transaction = await prisma.transaction.create({
      data: {
        userId: client.id,
        type: 'DEPOSIT',
        amount: amount,
        status: 'PENDING',
        meta: {
          depositRequestedBy: user.id,
          notes: notes || '',
          proofUrl: proofUrl || '',
        }
      }
    });

    return NextResponse.json({ success: true, transactionId: transaction.id });
  } catch (error: any) {
    console.error('Deposit Request Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create deposit request' }, { status: 500 });
  }
}

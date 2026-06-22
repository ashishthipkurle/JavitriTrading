import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== 'EMPLOYEE' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: clientId } = await params;

    const client = await prisma.user.findUnique({
      where: { id: clientId },
      include: { kyc: true }
    });

    if (!client || !client.kyc) {
      return NextResponse.json({ error: 'Client or KYC not found' }, { status: 404 });
    }

    // Decrypt sensitive fields
    const decryptedPan = client.kyc.panNumber ? decrypt(client.kyc.panNumber) : null;
    const decryptedAadhaar = client.kyc.aadhaarNumber ? decrypt(client.kyc.aadhaarNumber) : null;
    const decryptedBank = client.kyc.bankAccount ? decrypt(client.kyc.bankAccount) : null;

    return NextResponse.json({
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        createdAt: client.createdAt,
      },
      kyc: {
        ...client.kyc,
        panNumber: decryptedPan,
        aadhaarNumber: decryptedAadhaar,
        bankAccount: decryptedBank,
      }
    });

  } catch (error: any) {
    console.error('Fetch Client Form Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

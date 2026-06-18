export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/encryption';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const kyc = await prisma.kYC.findUnique({ where: { userId: user.id } });
    if (!kyc) return NextResponse.json({ success: true, data: null });

    // Decrypt sensitive info for the user
    return NextResponse.json({
      success: true,
      data: {
        ...kyc,
        panNumber: kyc.panNumber ? decrypt(kyc.panNumber) : null,
        aadhaarNumber: kyc.aadhaarNumber ? decrypt(kyc.aadhaarNumber) : null,
        bankAccount: kyc.bankAccount ? decrypt(kyc.bankAccount) : null,
      }
    });
  } catch (error) {
    console.error('KYC GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    const { panNumber, aadhaarNumber, bankAccount, ifsc, panDocUrl, aadhaarDocUrl } = data;

    if (!panNumber || !aadhaarNumber || !bankAccount || !ifsc) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const kycData = {
      userId: user.id,
      panNumber: encrypt(panNumber),
      aadhaarNumber: encrypt(aadhaarNumber),
      bankAccount: encrypt(bankAccount),
      ifsc,
      panDocUrl,
      aadhaarDocUrl,
    };

    const kyc = await prisma.kYC.upsert({
      where: { userId: user.id },
      update: kycData,
      create: kycData
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { kycStatus: 'PENDING' }
    });

    return NextResponse.json({ success: true, message: 'KYC submitted successfully', data: kyc });
  } catch (error) {
    console.error('KYC POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { encrypt } from '@/lib/encryption';
import { verifyBankAccount } from '@/lib/bank-validation';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, phone, bankAccount, ifsc, panDocUrl, aadhaarDocUrl } = data;

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!name || !phone || !bankAccount || !ifsc || !panDocUrl || !aadhaarDocUrl) {
      return NextResponse.json({ error: 'Missing required fields including KYC images' }, { status: 400 });
    }

    // Check if user already exists in Prisma to avoid conflicts
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Profile already exists' }, { status: 200 });
    }

    // VERIFY BANK ACCOUNT INSTANTLY
    try {
      await verifyBankAccount(bankAccount, ifsc, name);
    } catch (bankError: any) {
      return NextResponse.json({ error: bankError.message }, { status: 400 });
    }

    // Use transaction to ensure both user and KYC are created atomically
    const profile = await prisma.$transaction(async (tx) => {
      // Create the profile in Prisma, linked to the Supabase Auth UUID
      const newUser = await tx.user.create({
        data: {
          id: user.id, // MUST match Supabase auth.users.id
          email: user.email!,
          phone: phone,
          name: name,
          kycStatus: "PENDING", // Explicitly set pending for public signups
          // Default role is CLIENT and accountOrigin SELF_REGISTERED
        }
      });

      // Encrypt sensitive Bank Account
      const encBankAccount = encrypt(bankAccount);

      // Create KYC record
      await tx.kYC.create({
        data: {
          userId: newUser.id,
          bankAccount: encBankAccount,
          ifsc: ifsc,
          panDocUrl: panDocUrl,
          aadhaarDocUrl: aadhaarDocUrl
        }
      });

      return newUser;
    });

    return NextResponse.json({ success: true, profile }, { status: 201 });

  } catch (error: any) {
    console.error('Profile creation error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A user with this phone number or email already exists in our system.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { pin, otp } = await req.json();

    if (!pin || !otp) {
      return NextResponse.json({ error: 'PIN and OTP are required' }, { status: 400 });
    }

    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      return NextResponse.json({ error: 'PIN must be exactly 6 digits' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify OTP
    const otpRecord = await prisma.oTPToken.findFirst({
      where: { 
        email: user.email, 
        token: otp 
      }
    });

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 });
    }

    // OTP is valid! Delete it so it can't be reused
    await prisma.oTPToken.delete({
      where: { id: otpRecord.id }
    });

    const pinHash = await bcrypt.hash(pin, 10);

    // Update the user's PIN
    await prisma.user.update({
      where: { id: user.id },
      data: { pinHash }
    });

    return NextResponse.json({ success: true, message: 'PIN setup successfully' });

  } catch (error: any) {
    console.error('Setup PIN Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

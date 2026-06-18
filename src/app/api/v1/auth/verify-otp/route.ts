import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { email, token, password, name, phone } = await req.json();

    if (!email || !token || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Verify OTP in database
    const otpRecord = await prisma.oTPToken.findFirst({
      where: { 
        email, 
        token 
      }
    });

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 });
    }

    // 2. OTP is valid! Delete it so it can't be reused
    await prisma.oTPToken.delete({
      where: { id: otpRecord.id }
    });

    // 3. Create the user in Supabase Auth bypassing email confirmation
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    // We must use the admin client with the service_role key to auto-confirm the email
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        phone
      }
    });

    if (authError) {
      // If user already exists, it will return an error
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Successfully verified and created!
    return NextResponse.json({ success: true, message: 'Email verified successfully' });

  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}

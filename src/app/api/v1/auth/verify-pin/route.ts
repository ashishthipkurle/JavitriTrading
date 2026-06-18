import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    if (!dbUser.pinHash) {
      // For older accounts that haven't set a PIN yet
      return NextResponse.json({ success: true, needsSetup: true });
    }

    if (!pin) {
      return NextResponse.json({ error: 'PIN is required' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(pin, dbUser.pinHash);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: 'PIN verified' });

  } catch (error: any) {
    console.error('Verify PIN Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

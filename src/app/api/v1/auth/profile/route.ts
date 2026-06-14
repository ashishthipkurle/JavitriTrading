import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, phone } = data;

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists in Prisma to avoid conflicts
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Profile already exists' }, { status: 200 });
    }

    // Create the profile in Prisma, linked to the Supabase Auth UUID
    const profile = await prisma.user.create({
      data: {
        id: user.id, // MUST match Supabase auth.users.id
        email: user.email!,
        phone: phone,
        name: name,
        // Default role is CLIENT and accountOrigin SELF_REGISTERED
      }
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

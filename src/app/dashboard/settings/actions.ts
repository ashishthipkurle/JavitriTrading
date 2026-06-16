'use server';

import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function updateProfile(formData: FormData) {
  const authUser = await getAuthUser();
  if (!authUser) return { error: 'Not authenticated' };

  const name = formData.get('name') as String;
  const phone = formData.get('phone') as String;

  if (!name || !phone) return { error: 'Name and phone are required' };

  try {
    await prisma.user.update({
      where: { id: authUser.id },
      data: { name: name.toString(), phone: phone.toString() }
    });

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: 'Failed to update profile' };
  }
}

export async function sendPasswordUpdateOtp() {
  const authUser = await getAuthUser();
  if (!authUser) return { error: 'Not authenticated' };

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(authUser.email, {
      // no redirect needed, we just want the OTP
    });

    if (error) return { error: error.message };

    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: 'Failed to send OTP' };
  }
}

export async function updatePassword(formData: FormData) {
  const authUser = await getAuthUser();
  if (!authUser) return { error: 'Not authenticated' };

  const password = formData.get('password') as String;
  const confirmPassword = formData.get('confirmPassword') as String;
  const otp = formData.get('otp') as String;

  if (!password || password.length < 6) return { error: 'Password must be at least 6 characters' };
  if (password !== confirmPassword) return { error: 'Passwords do not match' };
  if (!otp || otp.length !== 6) return { error: 'Valid 6-digit OTP is required' };

  try {
    const supabase = await createClient();
    
    // First, verify the OTP
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: authUser.email,
      token: otp.toString(),
      type: 'recovery'
    });

    if (verifyError) return { error: 'Invalid or expired OTP: ' + verifyError.message };

    // Then, update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password.toString()
    });

    if (updateError) return { error: updateError.message };

    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: 'Failed to update password' };
  }
}

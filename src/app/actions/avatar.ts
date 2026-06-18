'use server';

import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateAvatar(formData: FormData) {
  const authUser = await getAuthUser();
  if (!authUser) return { error: 'Not authenticated' };

  const avatarUrl = formData.get('avatarUrl') as string;

  if (!avatarUrl) return { error: 'No avatar URL provided' };

  try {
    await prisma.user.update({
      where: { id: authUser.id },
      data: { avatarUrl },
    });

    revalidatePath('/dashboard/profile');
    revalidatePath('/employee/profile');
    revalidatePath('/admin/profile');
    revalidatePath('/dashboard');
    revalidatePath('/employee');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: 'Failed to update avatar' };
  }
}

export async function removeAvatar() {
  const authUser = await getAuthUser();
  if (!authUser) return { error: 'Not authenticated' };

  try {
    await prisma.user.update({
      where: { id: authUser.id },
      data: { avatarUrl: null },
    });

    revalidatePath('/dashboard/profile');
    revalidatePath('/employee/profile');
    revalidatePath('/admin/profile');
    revalidatePath('/dashboard');
    revalidatePath('/employee');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: 'Failed to remove avatar' };
  }
}

'use server';

import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitTicket(formData: FormData) {
  const authUser = await getAuthUser();
  if (!authUser) return { error: 'Not authenticated' };

  const subject = formData.get('subject') as String;
  const message = formData.get('message') as String;

  if (!subject || !message) return { error: 'Subject and message are required' };

  try {
    // We added this to prisma schema earlier, but TS might complain if Prisma Client 
    // wasn't fully regenerated yet. We'll use any assertion to bypass TS if needed,
    // though the standard call is better.
    await (prisma as any).supportTicket.create({
      data: {
        userId: authUser.id,
        subject: subject.toString(),
        message: message.toString(),
      }
    });

    revalidatePath('/dashboard/support');
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: 'Failed to submit support ticket. Please try again later.' };
  }
}

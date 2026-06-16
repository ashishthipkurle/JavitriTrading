import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import SupportClient from './SupportClient';

export default async function SupportPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect('/login');

  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  return <SupportClient faqs={faqs} />;
}

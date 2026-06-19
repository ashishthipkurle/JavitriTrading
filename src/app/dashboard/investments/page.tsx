import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import InvestmentsClient from './InvestmentsClient';


export const dynamic = 'force-dynamic';

export default async function InvestmentsPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect('/login');

  const investments = await prisma.investment.findMany({
    where: { userId: authUser.id },
    include: { plan: true },
    orderBy: { createdAt: 'desc' }
  });

  return <InvestmentsClient investments={investments} />;
}

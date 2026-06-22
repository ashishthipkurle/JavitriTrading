import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import EmployeeWalletClient from './EmployeeWalletClient';

export const dynamic = 'force-dynamic';

export default async function EmployeeWalletPage() {
  const authUser = await getAuthUser();
  if (!authUser || authUser.role !== 'EMPLOYEE') redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      transactions: {
        where: {
          type: { in: ['PAYOUT', 'WITHDRAWAL'] }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) redirect('/login');

  return (
    <EmployeeWalletClient 
      walletBalance={Number(user.walletBalance)} 
      transactions={user.transactions} 
    />
  );
}

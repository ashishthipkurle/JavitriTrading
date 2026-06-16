import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import WalletClient from './WalletClient';

export default async function WalletPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) redirect('/login');

  return (
    <WalletClient 
      walletBalance={Number(user.walletBalance)} 
      transactions={user.transactions} 
    />
  );
}

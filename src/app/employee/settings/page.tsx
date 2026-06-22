import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import SettingsClient from '@/app/dashboard/settings/SettingsClient';


export const dynamic = 'force-dynamic';

export default async function EmployeeSettingsPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: authUser.id }
  });

  if (!user || user.role !== 'EMPLOYEE') redirect('/login');

  return <SettingsClient user={user} />;
}

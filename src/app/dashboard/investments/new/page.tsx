import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NewInvestmentPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: authUser.id }
  });

  if (!user) redirect('/login');

  return (
    <div className="flex-1 p-margin-mobile md:p-margin-desktop bg-surface-container-low flex justify-center items-start pt-unit-xl h-full min-h-[60vh]">
      <div className="w-full max-w-[600px] bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-lg flex flex-col items-center text-center gap-unit-md shadow-sm">
        <div className="w-16 h-16 bg-error-container/20 rounded-full flex items-center justify-center mb-2">
          <span className="material-symbols-outlined text-[32px] text-error">lock</span>
        </div>
        <h2 className="text-headline-md font-headline-md font-bold text-primary">Self-Investment Locked</h2>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Direct investments are currently unavailable. Please contact your assigned employee to invest in a new FD plan or modify your portfolio.
        </p>
        <Link href="/dashboard/investments" className="mt-4 px-6 py-3 bg-primary text-on-primary font-label-md font-bold rounded-lg hover:brightness-90 transition-colors">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );

}

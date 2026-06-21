import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import NewInvestmentWizard from './NewInvestmentWizard';
import Link from 'next/link';


export const dynamic = 'force-dynamic';

export default async function NewInvestmentPage({ searchParams }: { searchParams: Promise<{ planId?: string }> }) {
  const { planId } = await searchParams;
  const authUser = await getAuthUser();
  if (!authUser) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: authUser.id }
  });

  if (!user) redirect('/login');

  if (user.managedBy) {
    return (
      <div className="flex-1 p-margin-mobile md:p-margin-desktop bg-surface-container-low flex justify-center items-start pt-unit-xl h-full min-h-[60vh]">
        <div className="w-full max-w-[600px] bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-lg flex flex-col items-center text-center gap-unit-md shadow-sm">
          <div className="w-16 h-16 bg-error-container/20 rounded-full flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-[32px] text-error">lock</span>
          </div>
          <h2 className="text-headline-md font-headline-md font-bold text-primary">Self-Investment Locked</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Your account is managed by an employee. To invest in a new FD plan or modify your portfolio, please contact your account manager directly.
          </p>
          <Link href="/dashboard/investments" className="mt-4 px-6 py-3 bg-primary text-on-primary font-label-md font-bold rounded-lg hover:brightness-90 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (user.kycStatus !== 'APPROVED') {
    return (
      <div className="flex-1 p-margin-mobile md:p-margin-desktop bg-surface-container-low flex justify-center items-start pt-unit-xl h-full min-h-[60vh]">
        <div className="w-full max-w-[600px] bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-lg flex flex-col items-center text-center gap-unit-md shadow-sm">
          <div className="w-16 h-16 bg-error-container/20 rounded-full flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-[32px] text-error">pending_actions</span>
          </div>
          <h2 className="text-headline-md font-headline-md font-bold text-primary">KYC Verification Required</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">
            You must complete your KYC verification before you can invest in any FD plans. Please upload your documents in the settings page.
          </p>
          <Link href="/dashboard/settings" className="mt-4 px-6 py-3 bg-primary text-on-primary font-label-md font-bold rounded-lg hover:brightness-90 transition-colors">
            Complete KYC
          </Link>
        </div>
      </div>
    );
  }

  const plansData = await prisma.fDPlan.findMany({
    where: { isActive: true },
    orderBy: { amount: 'asc' },
    include: {
      _count: {
        select: { investments: true }
      }
    }
  });

  let mostPopularPlanId = '';
  let maxInvestments = -1;
  
  const plans = plansData.map(plan => {
    if (plan._count.investments > maxInvestments) {
      maxInvestments = plan._count.investments;
      mostPopularPlanId = plan.id;
    }
    // We don't need to send the _count to the client
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _count, ...rest } = plan;
    return {
      ...rest,
      amount: Number(rest.amount),
      dailyReturnAmount: Number(rest.dailyReturnAmount)
    };
  });

  return <NewInvestmentWizard plans={plans} popularPlanId={mostPopularPlanId} initialPlanId={planId} walletBalance={Number(user.walletBalance)} />;
}

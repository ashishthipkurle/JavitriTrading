import prisma from "@/lib/prisma";
import { InvestmentStatus, KYCStatus, PayoutStatus, TransactionType, TxStatus } from "@prisma/client";
import RunPayoutsButton from "./RunPayoutsButton";

function formatCurrency(amount: number) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  } else {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  }
}

export default async function AdminAnalyticsPage() {
  // Fetch Analytics Data
  
  // Total Users
  const totalUsersCount = await prisma.user.count();

  // Pending KYC
  const pendingKYCCount = await prisma.user.count({
    where: { kycStatus: KYCStatus.PENDING },
  });

  // Active Investments
  const activeInvestmentsCount = await prisma.investment.count({
    where: { status: InvestmentStatus.ACTIVE },
  });

  // Total AUM (Active Investments Amount)
  const aumResult = await prisma.investment.aggregate({
    where: { status: InvestmentStatus.ACTIVE },
    _sum: { amount: true },
  });
  const totalAUM = Number(aumResult._sum.amount || 0);

  // Monthly Payout Liabilities (Pending payouts in next 30 days)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  const payoutLiabResult = await prisma.payout.aggregate({
    where: { 
      status: PayoutStatus.PENDING,
      paidOn: { lte: thirtyDaysFromNow }
    },
    _sum: { amount: true },
  });
  const mthPayoutLiab = Number(payoutLiabResult._sum.amount || 0);

  // Deposits MTD (Month to Date)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const depositsMtdResult = await prisma.transaction.aggregate({
    where: {
      type: TransactionType.DEPOSIT,
      status: TxStatus.SUCCESS,
      createdAt: { gte: startOfMonth }
    },
    _sum: { amount: true },
  });
  const depositsMtd = Number(depositsMtdResult._sum.amount || 0);

  return (
    <>
      <div className="flex justify-between items-center mb-unit-lg">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-primary">Overview</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Platform analytics and administrative actions.</p>
        </div>
        <RunPayoutsButton />
      </div>

      {/* Stat Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total AUM</span>
            <span className="material-symbols-outlined text-outline">account_balance</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary">{formatCurrency(totalAUM)}</div>
          <div className="text-label-sm font-label-sm text-tertiary-fixed-dim flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            Live Data
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total Users</span>
            <span className="material-symbols-outlined text-outline">group</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary">{totalUsersCount.toLocaleString('en-IN')}</div>
          <div className="text-label-sm font-label-sm text-tertiary-fixed-dim flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">group</span>
            Registered Accounts
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Pending KYC</span>
            <span className="material-symbols-outlined text-outline">pending_actions</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-secondary-container">{pendingKYCCount.toLocaleString('en-IN')}</div>
          <div className="text-label-sm font-label-sm text-on-surface-variant">Requires manual review</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow border-t-2 border-t-secondary-container">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Active Investments</span>
            <span className="material-symbols-outlined text-outline">monitoring</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary">{activeInvestmentsCount.toLocaleString('en-IN')}</div>
          <div className="text-label-sm font-label-sm text-on-surface-variant">Across all FD plans</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Mth Payout Liab.</span>
            <span className="material-symbols-outlined text-outline">payments</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary">{formatCurrency(mthPayoutLiab)}</div>
          <div className="text-label-sm font-label-sm text-error flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">info</span>
            Due in next 30 days
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Deposits (Mtd)</span>
            <span className="material-symbols-outlined text-outline">savings</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary">{formatCurrency(depositsMtd)}</div>
          <div className="text-label-sm font-label-sm text-tertiary-fixed-dim flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            Current month successful
          </div>
        </div>
      </section>
    </>
  );
}

import prisma from "@/lib/prisma";
import { InvestmentStatus, KYCStatus, TransactionType, TxStatus, WithdrawalStatus } from "@prisma/client";
import RunPayoutsButton from "./RunPayoutsButton";
import Link from "next/link";

export const dynamic = 'force-dynamic';

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
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  // ── Core Metrics ──────────────────────────────────────
  const [
    totalUsersCount,
    pendingKYCCount,
    activeInvestmentsCount,
    employeeCount,
    newUsersThisMonth,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'CLIENT' } }),
    prisma.user.count({ where: { kycStatus: KYCStatus.PENDING, role: 'CLIENT' } }),
    prisma.investment.count({ where: { status: InvestmentStatus.ACTIVE } }),
    prisma.user.count({ where: { role: 'EMPLOYEE' } }),
    prisma.user.count({ where: { role: 'CLIENT', createdAt: { gte: startOfMonth } } }),
  ]);

  // ── Financial Metrics ─────────────────────────────────
  const [aumResult, totalPaidOutResult, depositsMtdResult, totalCommissionsResult, walletHoldingsResult] = await Promise.all([
    prisma.investment.aggregate({
      where: { status: InvestmentStatus.ACTIVE },
      _sum: { amount: true },
    }),
    prisma.payout.aggregate({
      where: { status: 'PROCESSED' },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        type: TransactionType.DEPOSIT,
        status: TxStatus.SUCCESS,
        createdAt: { gte: startOfMonth }
      },
      _sum: { amount: true },
    }),
    prisma.commission.aggregate({
      _sum: { amount: true },
    }),
    prisma.user.aggregate({
      where: { role: { in: ['CLIENT', 'EMPLOYEE'] } },
      _sum: { walletBalance: true },
    }),
  ]);

  const totalAUM = Number(aumResult._sum.amount || 0);
  const totalPaidOut = Number(totalPaidOutResult._sum.amount || 0);
  const depositsMtd = Number(depositsMtdResult._sum.amount || 0);
  const totalCommissions = Number(totalCommissionsResult._sum.amount || 0);
  const walletHoldings = Number(walletHoldingsResult._sum.walletBalance || 0);

  // ── Monthly Payout Liability (FIXED: Calculate from active investments' daily returns × 30) ──
  const activeInvestments = await prisma.investment.findMany({
    where: { status: InvestmentStatus.ACTIVE },
    select: { monthlyReturn: true },
  });
  const mthPayoutLiab = activeInvestments.reduce((sum, inv) => sum + (Number(inv.monthlyReturn) * 30), 0);

  // ── Pending Withdrawals ───────────────────────────────
  const pendingWithdrawals = await prisma.withdrawalRequest.aggregate({
    where: { status: WithdrawalStatus.PENDING },
    _sum: { amount: true },
    _count: true,
  });
  const pendingWithdrawalAmount = Number(pendingWithdrawals._sum.amount || 0);
  const pendingWithdrawalCount = pendingWithdrawals._count;

  // ── Maturing Soon (next 30 days) ──────────────────────
  const maturingSoonCount = await prisma.investment.count({
    where: {
      status: InvestmentStatus.ACTIVE,
      maturityDate: { lte: thirtyDaysFromNow },
    },
  });

  // ── Recent Activity (Last 10 transactions) ────────────
  const recentTransactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 8,
    include: { user: { select: { name: true, email: true, role: true } } },
  });

  // ── Top Plans by Active Investment Count ──────────────
  const topPlans = await prisma.fDPlan.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { investments: { where: { status: InvestmentStatus.ACTIVE } } }
      },
      investments: {
        where: { status: InvestmentStatus.ACTIVE },
        select: { amount: true },
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const txTypeIcon: Record<string, string> = {
    DEPOSIT: 'account_balance',
    WITHDRAWAL: 'call_made',
    PAYOUT: 'payments',
    INVESTMENT: 'trending_up',
  };
  const txTypeColor: Record<string, string> = {
    DEPOSIT: 'text-[#009668] bg-[#009668]/10',
    WITHDRAWAL: 'text-error bg-error/10',
    PAYOUT: 'text-secondary bg-secondary-container/30',
    INVESTMENT: 'text-primary bg-primary/10',
  };

  return (
    <>
      <div className="flex justify-between items-center mb-unit-lg">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-primary">Overview</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Platform analytics and administrative actions.</p>
        </div>
        <RunPayoutsButton />
      </div>

      {/* ── Row 1: Key Financial Cards ─────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">
        {/* Total AUM */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-primary"></div>
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total AUM</span>
            <span className="material-symbols-outlined text-outline">account_balance</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary font-bold">{formatCurrency(totalAUM)}</div>
          <div className="text-label-sm font-label-sm text-[#009668] flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            {activeInvestmentsCount} active FDs
          </div>
        </div>

        {/* Deposits MTD */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Deposits (MTD)</span>
            <span className="material-symbols-outlined text-outline">savings</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary font-bold">{formatCurrency(depositsMtd)}</div>
          <div className="text-label-sm font-label-sm text-[#009668] flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            Current month
          </div>
        </div>

        {/* Total Paid Out */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total Paid Out</span>
            <span className="material-symbols-outlined text-outline">payments</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary font-bold">{formatCurrency(totalPaidOut)}</div>
          <div className="text-label-sm font-label-sm text-on-surface-variant">All-time returns to users</div>
        </div>

        {/* Monthly Payout Liability */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Mth Payout Liab.</span>
            <span className="material-symbols-outlined text-outline">warning</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary font-bold">{formatCurrency(mthPayoutLiab)}</div>
          <div className="text-label-sm font-label-sm text-error flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">info</span>
            Projected next 30 days
          </div>
        </div>
      </section>

      {/* ── Row 2: People & Operations Cards ───────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">
        {/* Total Users */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total Users</span>
            <span className="material-symbols-outlined text-outline">group</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary font-bold">{totalUsersCount}</div>
          <div className="text-label-sm font-label-sm text-[#009668] flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            +{newUsersThisMonth} this month
          </div>
        </div>

        {/* Employees */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Employees</span>
            <span className="material-symbols-outlined text-outline">badge</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary font-bold">{employeeCount}</div>
          <div className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">paid</span>
            {formatCurrency(totalCommissions)} commissions paid
          </div>
        </div>

        {/* Pending KYC */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Pending KYC</span>
            <span className="material-symbols-outlined text-outline">pending_actions</span>
          </div>
          <div className={`text-headline-lg font-headline-lg font-bold ${pendingKYCCount > 0 ? 'text-secondary-container' : 'text-primary'}`}>{pendingKYCCount}</div>
          <div className="text-label-sm font-label-sm text-on-surface-variant">
            {pendingKYCCount > 0 ? 'Requires manual review' : 'All clear'}
          </div>
        </div>

        {/* Pending Withdrawals */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Pending Withdrawals</span>
            <span className="material-symbols-outlined text-outline">call_made</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary font-bold">{formatCurrency(pendingWithdrawalAmount)}</div>
          <div className={`text-label-sm font-label-sm flex items-center gap-1 ${pendingWithdrawalCount > 0 ? 'text-secondary-container' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[16px]">pending</span>
            {pendingWithdrawalCount} request{pendingWithdrawalCount !== 1 ? 's' : ''} pending
          </div>
        </div>
      </section>

      {/* ── Row 3: Quick Stats Bar ─────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex items-center gap-4 hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
          </div>
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Wallet Holdings</p>
            <p className="text-headline-sm font-headline-sm text-primary font-bold">{formatCurrency(walletHoldings)}</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex items-center gap-4 hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-secondary">event_upcoming</span>
          </div>
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Maturing Soon</p>
            <p className="text-headline-sm font-headline-sm text-primary font-bold">{maturingSoonCount} <span className="text-body-sm font-body-sm text-on-surface-variant">FDs in 30 days</span></p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex items-center gap-4 hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#009668]/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#009668]">monitoring</span>
          </div>
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Active FDs</p>
            <p className="text-headline-sm font-headline-sm text-primary font-bold">{activeInvestmentsCount}</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex items-center gap-4 hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-error">volunteer_activism</span>
          </div>
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Commissions Paid</p>
            <p className="text-headline-sm font-headline-sm text-primary font-bold">{formatCurrency(totalCommissions)}</p>
          </div>
        </div>
      </section>

      {/* ── Row 4: Recent Activity + Top Plans ─────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-gutter">
        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
          <div className="px-unit-lg py-unit-md border-b border-outline-variant flex justify-between items-center">
            <h3 className="text-headline-sm font-headline-sm font-bold text-primary">Recent Activity</h3>
            <Link href="/admin/transactions" className="text-label-sm font-label-sm text-secondary hover:underline font-bold">View All</Link>
          </div>
          <div className="flex flex-col">
            {recentTransactions.length === 0 ? (
              <div className="p-12 text-center text-on-surface-variant text-body-md">No transactions yet.</div>
            ) : (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="px-unit-lg py-3 border-b border-outline-variant/50 flex items-center justify-between hover:bg-surface-container-lowest transition-colors last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${txTypeColor[tx.type] || 'bg-surface-container text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined text-[18px]">{txTypeIcon[tx.type] || 'receipt_long'}</span>
                    </div>
                    <div>
                      <p className="text-label-md font-label-md text-on-surface capitalize">
                        {tx.type.toLowerCase().replace('_', ' ')}
                        <span className="text-on-surface-variant font-normal"> — {tx.user.name || tx.user.email}</span>
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        {new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(tx.createdAt))}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-label-lg font-label-lg font-data-mono font-bold ${
                      tx.type === 'DEPOSIT' || tx.type === 'PAYOUT' ? 'text-[#009668]' : 'text-on-surface'
                    }`}>
                      {tx.type === 'DEPOSIT' || tx.type === 'PAYOUT' ? '+' : '-'}{formatCurrency(Number(tx.amount))}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Plans */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
          <div className="px-unit-lg py-unit-md border-b border-outline-variant flex justify-between items-center">
            <h3 className="text-headline-sm font-headline-sm font-bold text-primary">FD Plans</h3>
            <Link href="/admin/plans" className="text-label-sm font-label-sm text-secondary hover:underline font-bold">Manage</Link>
          </div>
          <div className="flex flex-col">
            {topPlans.length === 0 ? (
              <div className="p-12 text-center text-on-surface-variant text-body-md">No plans created yet.</div>
            ) : (
              topPlans.map((plan, idx) => {
                const planAUM = plan.investments.reduce((s, i) => s + Number(i.amount), 0);
                return (
                  <div key={plan.id} className="px-unit-lg py-3 border-b border-outline-variant/50 flex items-center justify-between hover:bg-surface-container-lowest transition-colors last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-label-md font-label-md text-primary font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-label-md font-label-md text-on-surface font-bold">{plan.name}</p>
                        <p className="text-[11px] text-on-surface-variant">
                          {formatCurrency(Number(plan.amount))} • {formatCurrency(Number(plan.dailyReturnAmount))}/day
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-label-md font-label-md text-primary font-data-mono font-bold">{plan._count.investments} <span className="text-[11px] text-on-surface-variant font-normal">active</span></p>
                      <p className="text-[11px] text-on-surface-variant">{formatCurrency(planAUM)} AUM</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </>
  );
}


import Link from 'next/link';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function DashboardOverviewPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      investments: {
        where: { status: 'ACTIVE' },
        include: { plan: true },
        orderBy: { createdAt: 'desc' }
      },
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 3
      }
    }
  });

  if (!user) redirect('/login');

  const activeInvestments = user.investments;
  const totalInvested = activeInvestments.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const totalProfit = activeInvestments.reduce((sum, inv) => sum + Number(inv.totalEarned), 0);
  const activeFDsCount = activeInvestments.length;
  
  // Next maturity date
  const nextMaturity = activeInvestments.length > 0 
    ? activeInvestments.reduce((closest, inv) => {
        if (!closest) return inv.maturityDate;
        return inv.maturityDate < closest ? inv.maturityDate : closest;
      }, activeInvestments[0].maturityDate)
    : null;

  const daysToMaturity = nextMaturity 
    ? Math.ceil((new Date(nextMaturity).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="p-margin-mobile md:p-margin-desktop">
      <div className="max-w-container-max mx-auto flex flex-col gap-gutter">
        {/* KYC Banner */}
        {user.kycStatus === 'PENDING' && (
          <div className="bg-secondary-container/20 border border-secondary-container rounded-lg p-unit-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary mt-0.5">warning</span>
              <div>
                <h3 className="text-label-md font-label-md text-on-secondary-container font-bold">KYC Pending</h3>
                <p className="text-body-sm font-body-sm text-on-secondary-container/80 mt-1">Complete your identity verification to unlock full trading and withdrawal capabilities.</p>
              </div>
            </div>
            <Link href="/dashboard/profile" className="bg-secondary text-on-secondary px-6 py-2 rounded-lg text-label-md font-label-md font-bold whitespace-nowrap hover:opacity-90 transition-opacity">
              Complete KYC
            </Link>
          </div>
        )}
        {user.kycStatus === 'REJECTED' && (
          <div className="bg-error-container border border-error rounded-lg p-unit-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-error mt-0.5">error</span>
              <div>
                <h3 className="text-label-md font-label-md text-on-error-container font-bold">KYC Rejected</h3>
                <p className="text-body-sm font-body-sm text-on-error-container/80 mt-1">There was an issue with your KYC documents. Please re-upload them.</p>
              </div>
            </div>
            <Link href="/dashboard/profile" className="bg-error text-on-error px-6 py-2 rounded-lg text-label-md font-label-md font-bold whitespace-nowrap hover:opacity-90 transition-opacity">
              Update KYC
            </Link>
          </div>
        )}

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg shadow-sm hover:shadow-md transition-shadow">
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-2">Total Invested</p>
            <h4 className="text-headline-md font-headline-md font-bold text-primary">{formatCurrency(totalInvested)}</h4>
            {totalInvested > 0 && (
              <div className="flex items-center gap-1 mt-2 text-on-tertiary-container">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span className="text-label-sm font-label-sm">all time</span>
              </div>
            )}
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg shadow-sm hover:shadow-md transition-shadow">
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-2">Total Profit</p>
            <h4 className="text-headline-md font-headline-md font-bold text-primary">{formatCurrency(totalProfit)}</h4>
            {totalProfit > 0 && (
              <div className="flex items-center gap-1 mt-2 text-on-tertiary-container">
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                <span className="text-label-sm font-label-sm">all time</span>
              </div>
            )}
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-secondary"></div>
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-2">Active FDs</p>
            <h4 className="text-headline-md font-headline-md font-bold text-primary">{activeFDsCount}</h4>
            <p className="text-label-sm font-label-sm text-on-surface-variant mt-2">
              {daysToMaturity !== null 
                ? (daysToMaturity > 0 ? `Next maturity in ${daysToMaturity} days` : 'Maturity today') 
                : 'No active FDs'}
            </p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg shadow-sm hover:shadow-md transition-shadow">
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-2">Wallet Balance</p>
            <h4 className="text-headline-md font-headline-md font-bold text-primary">{formatCurrency(Number(user.walletBalance))}</h4>
            <Link href="/dashboard/wallet" className="mt-3 text-label-sm font-label-sm text-primary font-bold border border-primary px-3 py-1 rounded hover:bg-surface-container-low transition-colors inline-block">
              Add Funds
            </Link>
          </div>
        </div>

        {/* Row 2: Chart & Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-headline-sm font-headline-sm font-bold text-primary">Earnings Performance</h3>
              <select className="bg-surface text-label-sm font-label-sm border border-outline-variant rounded px-2 py-1 outline-none focus:border-primary">
                <option>Last 6 Months</option>
                <option>Year to Date</option>
              </select>
            </div>
            <div className="flex-1 relative min-h-[240px] w-full flex items-end">
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-outline-variant/30"></div>
              <div className="absolute bottom-[25%] left-0 w-full h-[1px] bg-outline-variant/30"></div>
              <div className="absolute bottom-[50%] left-0 w-full h-[1px] bg-outline-variant/30"></div>
              <div className="absolute bottom-[75%] left-0 w-full h-[1px] bg-outline-variant/30"></div>
              <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                {totalProfit > 0 ? (
                  <>
                    <path d="M0,80 Q10,70 20,75 T40,60 T60,40 T80,30 T100,10 L100,100 L0,100 Z" fill="rgba(245, 158, 11, 0.05)"></path>
                    <path d="M0,80 Q10,70 20,75 T40,60 T60,40 T80,30 T100,10" fill="none" stroke="#F59E0B" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></path>
                  </>
                ) : (
                  <>
                    <path d="M0,100 L100,100 Z" fill="rgba(245, 158, 11, 0.05)"></path>
                    <path d="M0,99 L100,99" fill="none" stroke="#F59E0B" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></path>
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-headline-sm font-headline-sm font-bold text-primary">Recent Activity</h3>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              {user.transactions.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-on-surface-variant font-body-sm">
                  No recent activity
                </div>
              ) : (
                user.transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between pb-3 border-b border-outline-variant/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                          {tx.type === 'DEPOSIT' ? 'account_balance' : 
                           tx.type === 'WITHDRAWAL' ? 'call_made' : 
                           tx.type === 'PAYOUT' ? 'call_received' : 'trending_up'}
                        </span>
                      </div>
                      <div>
                        <p className="text-label-md font-label-md text-primary capitalize">{tx.type.toLowerCase()}</p>
                        <p className="text-label-sm font-label-sm text-on-surface-variant">
                          {new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(new Date(tx.createdAt))}
                        </p>
                      </div>
                    </div>
                    <span className={`text-data-mono font-data-mono font-medium ${tx.type === 'WITHDRAWAL' || tx.type === 'INVESTMENT' ? 'text-error' : 'text-on-tertiary-container'}`}>
                      {tx.type === 'WITHDRAWAL' || tx.type === 'INVESTMENT' ? '-' : '+'}
                      {formatCurrency(Number(tx.amount))}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Active Investments Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden mb-8">
          <div className="px-unit-lg py-unit-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <h3 className="text-headline-sm font-headline-sm font-bold text-primary">Active Investments</h3>
            <Link className="text-label-md font-label-md text-secondary hover:underline font-bold" href="/dashboard/investments">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant text-label-sm font-label-sm uppercase tracking-wider">
                  <th className="px-unit-lg py-3 font-medium">Plan Name</th>
                  <th className="px-unit-lg py-3 font-medium">Principal</th>
                  <th className="px-unit-lg py-3 font-medium">Monthly Return</th>
                  <th className="px-unit-lg py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-body-sm font-body-sm text-primary">
                {activeInvestments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-unit-lg py-8 text-center text-on-surface-variant font-body-md">
                      You have no active investments.
                    </td>
                  </tr>
                ) : (
                  activeInvestments.map(inv => (
                    <tr key={inv.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                      <td className="px-unit-lg py-4 font-bold">{inv.plan.name}</td>
                      <td className="px-unit-lg py-4 text-data-mono font-data-mono">{formatCurrency(Number(inv.amount))}</td>
                      <td className="px-unit-lg py-4 text-on-tertiary-container">{formatCurrency(Number(inv.monthlyReturn))}</td>
                      <td className="px-unit-lg py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-on-tertiary-container/10 text-on-tertiary-container text-label-sm font-label-sm">{inv.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

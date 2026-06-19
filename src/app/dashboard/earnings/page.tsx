import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';


export const dynamic = 'force-dynamic';

export default async function EarningsPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      investments: {
        include: { payouts: { orderBy: { paidOn: 'desc' } }, plan: true }
      }
    }
  });

  if (!user) redirect('/login');

  // Calculate totals
  const totalEarned = user.investments.reduce((sum, inv) => sum + Number(inv.totalEarned), 0);
  
  // Flatten payouts across all investments
  const allPayouts = user.investments.flatMap(inv => 
    inv.payouts.map(p => ({
      ...p,
      investmentName: inv.plan.name
    }))
  ).sort((a, b) => b.paidOn.getTime() - a.paidOn.getTime());

  const pendingPayouts = allPayouts.filter(p => p.status === 'PENDING');
  const totalPending = pendingPayouts.reduce((sum, p) => sum + Number(p.amount), 0);

  // Month-to-date calculation (payouts processed this month)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const mtdEarned = allPayouts
    .filter(p => p.status === 'PROCESSED' && new Date(p.paidOn) >= startOfMonth)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  // Group payouts by month for the accordion
  const payoutsByMonth = allPayouts.reduce((acc, payout) => {
    const monthYear = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(payout.paidOn));
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(payout);
    return acc;
  }, {} as Record<string, typeof allPayouts>);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto w-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-unit-xl gap-unit-md">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary">Earnings</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">Review your portfolio yield and payout history.</p>
        </div>
        <div className="flex items-center gap-unit-sm">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-label-md font-label-md text-primary hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>
      </header>

      {/* Summary Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-unit-xl">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-lg hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between mb-unit-md">
            <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wide">Total Earned (All Time)</h3>
            <div className="w-8 h-8 rounded-full bg-[#E6F4EA] text-on-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
            </div>
          </div>
          <div className="text-headline-xl font-headline-xl text-on-tertiary-container">{formatCurrency(totalEarned)}</div>
          {totalEarned > 0 && (
            <div className="flex items-center mt-2 gap-1 text-label-sm font-label-sm text-[#008A00]">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+12.4% vs previous year</span>
            </div>
          )}
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-lg hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between mb-unit-md">
            <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wide">Month-to-Date</h3>
            <div className="w-8 h-8 rounded-full bg-surface-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            </div>
          </div>
          <div className="text-headline-xl font-headline-xl text-primary">{formatCurrency(mtdEarned)}</div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-lg hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-secondary-container"></div>
          <div className="flex items-center justify-between mb-unit-md mt-1">
            <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wide">Pending Payouts</h3>
            <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">pending_actions</span>
            </div>
          </div>
          <div className="text-headline-xl font-headline-xl text-primary">{formatCurrency(totalPending)}</div>
          {pendingPayouts.length > 0 && (
            <div className="flex items-center mt-2 gap-1 text-label-sm font-label-sm text-secondary">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>Next scheduled: {new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(new Date(pendingPayouts[0].paidOn))}</span>
            </div>
          )}
        </div>
      </section>

      {/* Chart Section */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-lg mb-unit-xl">
        <div className="flex items-center justify-between mb-unit-lg border-b border-outline-variant pb-unit-md">
          <h2 className="text-headline-md font-headline-md text-primary">Monthly Earnings</h2>
          <select className="bg-surface border border-outline-variant text-label-md font-label-md text-primary rounded-lg px-3 py-1.5 focus:border-primary focus:ring-0 cursor-pointer">
            <option>2024</option>
            <option>2023</option>
          </select>
        </div>
        <div className="h-[240px] flex items-end justify-between gap-2 pt-4 relative">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 border-t border-b border-outline-variant/30">
            <div className="w-full h-px bg-outline-variant/30"></div>
            <div className="w-full h-px bg-outline-variant/30"></div>
            <div className="w-full h-px bg-outline-variant/30"></div>
            <div className="w-full h-px bg-outline-variant/30"></div>
          </div>
          {[
            { h: totalEarned > 0 ? '40%' : '0%', label: 'Jan' },
            { h: totalEarned > 0 ? '55%' : '0%', label: 'Feb' },
            { h: totalEarned > 0 ? '45%' : '0%', label: 'Mar' },
            { h: totalEarned > 0 ? '70%' : '0%', label: 'Apr' },
            { h: totalEarned > 0 ? '60%' : '0%', label: 'May' },
            { h: totalEarned > 0 ? '85%' : '0%', label: 'Jun' },
            { h: totalEarned > 0 ? '95%' : '0%', label: 'Jul' },
          ].map((bar) => (
            <div key={bar.label} className="relative z-10 flex flex-col items-center justify-end w-full group">
              <div className="w-full max-w-[40px] bg-primary/20 group-hover:bg-primary transition-colors rounded-t-sm" style={{ height: bar.h }}></div>
              <span className="text-label-sm font-label-sm text-on-surface-variant mt-2">{bar.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion Section */}
      <section>
        <h2 className="text-headline-sm font-headline-sm text-primary mb-unit-md">Payout Breakdowns</h2>
        <div className="flex flex-col gap-unit-sm">
          {Object.keys(payoutsByMonth).length === 0 ? (
            <div className="text-body-sm font-body-sm text-on-surface-variant p-unit-md text-center bg-surface-container-lowest border border-outline-variant rounded-xl">
              No payouts available yet.
            </div>
          ) : (
            Object.entries(payoutsByMonth).map(([monthYear, payouts], index) => {
              const monthTotal = payouts.reduce((sum, p) => sum + Number(p.amount), 0);
              const isFirst = index === 0;

              return (
                <details key={monthYear} className="bg-surface-container-lowest border border-outline-variant rounded-xl group overflow-hidden" open={isFirst}>
                  <summary className="flex justify-between items-center p-unit-md cursor-pointer hover:bg-surface-container-low transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary list-none">
                    <div className="flex items-center gap-unit-md">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
                      </div>
                      <div>
                        <h4 className="text-label-md font-label-md text-primary">{monthYear} Payout</h4>
                        <p className="text-body-sm font-body-sm text-on-surface-variant">{payouts.length} record(s)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-unit-md">
                      <span className="text-label-md font-label-md text-primary">{formatCurrency(monthTotal)}</span>
                      <span className="material-symbols-outlined text-outline-variant group-open:rotate-180 transition-transform">expand_more</span>
                    </div>
                  </summary>
                  <div className="p-unit-md border-t border-outline-variant bg-surface/50">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          <th className="py-2 text-label-sm font-label-sm text-on-surface-variant uppercase border-b border-outline-variant">Source</th>
                          <th className="py-2 text-label-sm font-label-sm text-on-surface-variant uppercase border-b border-outline-variant">Amount</th>
                          <th className="py-2 text-label-sm font-label-sm text-on-surface-variant uppercase border-b border-outline-variant text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-data-mono font-data-mono text-primary">
                        {payouts.map(p => (
                          <tr key={p.id}>
                            <td className="py-3 border-b border-outline-variant">{p.investmentName} Interest</td>
                            <td className="py-3 border-b border-outline-variant">{formatCurrency(Number(p.amount))}</td>
                            <td className="py-3 border-b border-outline-variant text-right">
                              {p.status === 'PROCESSED' ? (
                                <span className="px-2 py-1 bg-[#E6F4EA] text-[#008A00] rounded-full text-label-sm font-label-sm">Cleared</span>
                              ) : p.status === 'PENDING' ? (
                                <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-label-sm font-label-sm">Pending</span>
                              ) : (
                                <span className="px-2 py-1 bg-error-container text-on-error-container rounded-full text-label-sm font-label-sm">Failed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

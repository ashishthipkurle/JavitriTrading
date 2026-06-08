import Link from 'next/link';

export default function DashboardOverviewPage() {
  return (
    <div className="p-margin-mobile md:p-margin-desktop">
      <div className="max-w-container-max mx-auto flex flex-col gap-gutter">
        {/* KYC Banner */}
        <div className="bg-secondary-container/20 border border-secondary-container rounded-lg p-unit-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary mt-0.5">warning</span>
            <div>
              <h3 className="text-label-md font-label-md text-on-secondary-container font-bold">KYC Pending</h3>
              <p className="text-body-sm font-body-sm text-on-secondary-container/80 mt-1">Complete your identity verification to unlock full trading and withdrawal capabilities.</p>
            </div>
          </div>
          <Link href="/register/kyc" className="bg-secondary text-on-secondary px-6 py-2 rounded-lg text-label-md font-label-md font-bold whitespace-nowrap hover:opacity-90 transition-opacity">
            Complete KYC
          </Link>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg shadow-sm hover:shadow-md transition-shadow">
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-2">Total Invested</p>
            <h4 className="text-headline-md font-headline-md font-bold text-primary">₹1,50,000</h4>
            <div className="flex items-center gap-1 mt-2 text-on-tertiary-container">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span className="text-label-sm font-label-sm">+12.5% all time</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg shadow-sm hover:shadow-md transition-shadow">
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-2">Total Profit</p>
            <h4 className="text-headline-md font-headline-md font-bold text-primary">₹18,750</h4>
            <div className="flex items-center gap-1 mt-2 text-on-tertiary-container">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              <span className="text-label-sm font-label-sm">+2.4% this month</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-secondary"></div>
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-2">Active FDs</p>
            <h4 className="text-headline-md font-headline-md font-bold text-primary">3</h4>
            <p className="text-label-sm font-label-sm text-on-surface-variant mt-2">Next maturity in 14 days</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg shadow-sm hover:shadow-md transition-shadow">
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-2">Wallet Balance</p>
            <h4 className="text-headline-md font-headline-md font-bold text-primary">₹24,500</h4>
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
                <path d="M0,80 Q10,70 20,75 T40,60 T60,40 T80,30 T100,10 L100,100 L0,100 Z" fill="rgba(245, 158, 11, 0.05)"></path>
                <path d="M0,80 Q10,70 20,75 T40,60 T60,40 T80,30 T100,10" fill="none" stroke="#F59E0B" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></path>
              </svg>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-headline-sm font-headline-sm font-bold text-primary">Recent Activity</h3>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">call_received</span>
                  </div>
                  <div>
                    <p className="text-label-md font-label-md text-primary">FD Return</p>
                    <p className="text-label-sm font-label-sm text-on-surface-variant">Today, 10:23 AM</p>
                  </div>
                </div>
                <span className="text-data-mono font-data-mono text-on-tertiary-container font-medium">+₹1,250</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">call_made</span>
                  </div>
                  <div>
                    <p className="text-label-md font-label-md text-primary">Growth Fund</p>
                    <p className="text-label-sm font-label-sm text-on-surface-variant">Yesterday</p>
                  </div>
                </div>
                <span className="text-data-mono font-data-mono text-primary font-medium">-₹5,000</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">account_balance</span>
                  </div>
                  <div>
                    <p className="text-label-md font-label-md text-primary">Wallet Deposit</p>
                    <p className="text-label-sm font-label-sm text-on-surface-variant">Oct 12</p>
                  </div>
                </div>
                <span className="text-data-mono font-data-mono text-on-tertiary-container font-medium">+₹10,000</span>
              </div>
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
                  <th className="px-unit-lg py-3 font-medium">Rate</th>
                  <th className="px-unit-lg py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-body-sm font-body-sm text-primary">
                <tr className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                  <td className="px-unit-lg py-4 font-bold">Growth Plan Alpha</td>
                  <td className="px-unit-lg py-4 text-data-mono font-data-mono">₹50,000</td>
                  <td className="px-unit-lg py-4 text-on-tertiary-container">4% monthly</td>
                  <td className="px-unit-lg py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-on-tertiary-container/10 text-on-tertiary-container text-label-sm font-label-sm">Active</span>
                  </td>
                </tr>
                <tr className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                  <td className="px-unit-lg py-4 font-bold">Secure Yield FD</td>
                  <td className="px-unit-lg py-4 text-data-mono font-data-mono">₹1,00,000</td>
                  <td className="px-unit-lg py-4 text-on-tertiary-container">7.5% p.a.</td>
                  <td className="px-unit-lg py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-on-tertiary-container/10 text-on-tertiary-container text-label-sm font-label-sm">Active</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function InvestmentsPage() {
  return (
    <div className="p-margin-mobile md:p-margin-desktop flex-1 max-w-container-max mx-auto w-full">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-gutter gap-unit-md">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-primary tracking-tight">My Investments</h1>
          <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">Manage and track your active portfolio.</p>
        </div>
        <div className="flex items-center gap-unit-md">
          <div className="hidden lg:flex items-center bg-surface-container-low rounded-full p-1 border border-outline-variant">
            <button className="px-4 py-1.5 rounded-full bg-white text-primary text-label-sm font-label-sm shadow-sm border border-outline-variant">All</button>
            <button className="px-4 py-1.5 rounded-full text-on-surface-variant text-label-sm font-label-sm hover:text-primary transition-colors">Active</button>
            <button className="px-4 py-1.5 rounded-full text-on-surface-variant text-label-sm font-label-sm hover:text-primary transition-colors">Matured</button>
          </div>
          <Link href="/dashboard/investments/new" className="bg-secondary-container text-on-secondary-container px-6 py-2.5 rounded-lg font-label-md text-label-md font-bold hover:brightness-95 transition-all shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add_circle</span> New Investment
          </Link>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {/* Investment Card 1 */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-md hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow border-t-2 border-t-secondary-container flex flex-col h-full group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-unit-sm">
            <span className="px-2 py-1 rounded-full bg-tertiary-fixed-dim/20 text-on-tertiary-container text-[10px] font-bold tracking-wider uppercase">Active</span>
          </div>
          <div className="flex items-start gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>savings</span>
            </div>
            <div>
              <h3 className="text-headline-sm font-headline-sm text-primary group-hover:text-secondary-container transition-colors">Growth Plan A</h3>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Fixed Deposit</p>
            </div>
          </div>
          <div className="mb-6 flex-1">
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Invested Amount</p>
            <p className="text-headline-md font-headline-md text-primary font-bold">₹50,000</p>
            <div className="flex justify-between items-end mt-4 mb-2">
              <p className="text-body-sm font-body-sm text-on-surface-variant">Expected Return</p>
              <p className="text-label-md font-label-md text-on-tertiary-container font-bold">+4.0% p.a.</p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-label-sm font-label-sm text-on-surface-variant mb-1">
                <span>Tenure Progress</span>
                <span>45%</span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-secondary-container w-[45%] rounded-full"></div>
              </div>
              <p className="text-[11px] font-label-sm text-outline mt-1 text-right">Matures Oct 2025</p>
            </div>
          </div>
          <div className="flex gap-3 mt-auto pt-4 border-t border-outline-variant/50">
            <button className="flex-1 py-2 text-primary border border-primary rounded-lg text-label-sm font-label-sm font-bold hover:bg-primary/5 transition-colors">Top Up</button>
            <button className="flex-1 py-2 text-on-surface-variant hover:text-primary bg-surface-container-low rounded-lg text-label-sm font-label-sm transition-colors">View Details</button>
          </div>
        </div>

        {/* Investment Card 2 */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-md hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow border-t-2 border-t-secondary-container flex flex-col h-full group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-unit-sm">
            <span className="px-2 py-1 rounded-full bg-tertiary-fixed-dim/20 text-on-tertiary-container text-[10px] font-bold tracking-wider uppercase">Active</span>
          </div>
          <div className="flex items-start gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>moving</span>
            </div>
            <div>
              <h3 className="text-headline-sm font-headline-sm text-primary group-hover:text-secondary-container transition-colors">Flexi-Cap Equity</h3>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Mutual Fund</p>
            </div>
          </div>
          <div className="mb-6 flex-1">
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Current Value</p>
            <p className="text-headline-md font-headline-md text-primary font-bold">₹1,24,500</p>
            <div className="flex justify-between items-end mt-4 mb-2">
              <p className="text-body-sm font-body-sm text-on-surface-variant">Total Returns</p>
              <p className="text-label-md font-label-md text-on-tertiary-container font-bold">+12.5% (₹13,833)</p>
            </div>
            {/* Mini Chart */}
            <div className="h-12 w-full mt-4 flex items-end gap-1 opacity-60">
              <div className="w-1/6 bg-tertiary-fixed-dim rounded-t-sm h-[30%]"></div>
              <div className="w-1/6 bg-tertiary-fixed-dim rounded-t-sm h-[45%]"></div>
              <div className="w-1/6 bg-tertiary-fixed-dim rounded-t-sm h-[40%]"></div>
              <div className="w-1/6 bg-tertiary-fixed-dim rounded-t-sm h-[60%]"></div>
              <div className="w-1/6 bg-tertiary-fixed-dim rounded-t-sm h-[80%]"></div>
              <div className="w-1/6 bg-tertiary-fixed-dim rounded-t-sm h-[100%]"></div>
            </div>
          </div>
          <div className="flex gap-3 mt-auto pt-4 border-t border-outline-variant/50">
            <button className="flex-1 py-2 text-primary border border-primary rounded-lg text-label-sm font-label-sm font-bold hover:bg-primary/5 transition-colors">Invest More</button>
            <button className="flex-1 py-2 text-on-surface-variant hover:text-primary bg-surface-container-low rounded-lg text-label-sm font-label-sm transition-colors">View Details</button>
          </div>
        </div>

        {/* Add New Placeholder Card */}
        <Link href="/dashboard/investments/new" className="bg-surface-container-low rounded-xl border border-dashed border-outline-variant hover:border-secondary-container hover:bg-surface-container transition-all flex flex-col items-center justify-center p-unit-md min-h-[320px] group">
          <div className="w-16 h-16 rounded-full bg-secondary-container/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[32px] text-secondary-container">add</span>
          </div>
          <h3 className="text-headline-sm font-headline-sm text-primary mb-2">Discover Opportunities</h3>
          <p className="text-body-sm font-body-sm text-on-surface-variant text-center max-w-[200px]">Explore new premium investment plans tailored for you.</p>
        </Link>
      </div>
    </div>
  );
}

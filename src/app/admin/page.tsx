export default function AdminAnalyticsPage() {
  return (
    <>
      {/* Stat Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total AUM</span>
            <span className="material-symbols-outlined text-outline">account_balance</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary">₹2.4Cr</div>
          <div className="text-label-sm font-label-sm text-tertiary-fixed-dim flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            +12.5% this month
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total Users</span>
            <span className="material-symbols-outlined text-outline">group</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary">1,247</div>
          <div className="text-label-sm font-label-sm text-tertiary-fixed-dim flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            +48 new this week
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Pending KYC</span>
            <span className="material-symbols-outlined text-outline">pending_actions</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-secondary-container">34</div>
          <div className="text-label-sm font-label-sm text-on-surface-variant">Requires manual review</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow border-t-2 border-t-secondary-container">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Active Investments</span>
            <span className="material-symbols-outlined text-outline">monitoring</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary">892</div>
          <div className="text-label-sm font-label-sm text-on-surface-variant">Across all FD plans</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Mth Payout Liab.</span>
            <span className="material-symbols-outlined text-outline">payments</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary">₹12.5L</div>
          <div className="text-label-sm font-label-sm text-error flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">info</span>
            Due in next 15 days
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex flex-col gap-unit-sm hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Deposits (Mtd)</span>
            <span className="material-symbols-outlined text-outline">savings</span>
          </div>
          <div className="text-headline-lg font-headline-lg text-primary">₹45.2L</div>
          <div className="text-label-sm font-label-sm text-tertiary-fixed-dim flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            On track
          </div>
        </div>
      </section>
    </>
  );
}

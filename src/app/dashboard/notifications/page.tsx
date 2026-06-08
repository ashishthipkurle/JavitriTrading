export default function NotificationsPage() {
  return (
    <div className="p-margin-mobile md:p-margin-desktop bg-surface min-h-full">
      <div className="max-w-container-max mx-auto">
        <header className="mb-unit-xl flex flex-col md:flex-row justify-between items-start md:items-end border-b border-outline-variant pb-unit-md gap-unit-md">
          <div>
            <h1 className="text-headline-xl font-headline-xl text-primary mb-unit-xs">Notifications</h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant">Stay updated with your portfolio activities.</p>
          </div>
          <div className="hidden md:flex gap-unit-sm">
            <button className="px-unit-md py-2 border border-outline-variant rounded-lg text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors">Mark All Read</button>
            <button className="px-unit-md py-2 border border-outline-variant rounded-lg text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
            </button>
          </div>
        </header>

        {/* Notifications List */}
        <div className="flex flex-col gap-unit-sm">
          {/* Unread #1 - Market Alert */}
          <div className="group relative bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex gap-unit-md items-start hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-all cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container rounded-l-xl"></div>
            <div className="w-10 h-10 rounded-full bg-secondary-container/10 flex items-center justify-center flex-shrink-0 text-secondary-container">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-label-md font-label-md text-primary">Market Alert: Tech Sector Rally</h3>
                <span className="text-label-sm font-label-sm text-on-surface-variant">10 mins ago</span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-2">Major tech indices have seen a 2.4% surge today. Your Alpha Tech Fund is up by 3.1%.</p>
              <div className="flex gap-2">
                <span className="inline-flex items-center rounded-full bg-surface-container px-2 py-1 text-label-sm font-label-sm text-on-surface-variant">Market News</span>
              </div>
            </div>
          </div>

          {/* Unread #2 - Action Required */}
          <div className="group relative bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex gap-unit-md items-start hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-all cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container rounded-l-xl"></div>
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0 text-error">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-label-md font-label-md text-primary">Document Signature Required</h3>
                <span className="text-label-sm font-label-sm text-on-surface-variant">2 hrs ago</span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-3">Your annual wealth advisory agreement requires your electronic signature to proceed with the Q3 adjustments.</p>
              <button className="px-unit-sm py-1.5 bg-primary text-on-primary rounded text-label-sm font-label-sm hover:opacity-90 transition-opacity">Review Document</button>
            </div>
          </div>

          {/* Read #1 - Dividend Credited */}
          <div className="group relative bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex gap-unit-md items-start opacity-80 hover:opacity-100 hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 text-on-surface-variant">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-label-md font-label-md text-primary">Dividend Credited</h3>
                <span className="text-label-sm font-label-sm text-on-surface-variant">Yesterday</span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface-variant">A dividend of ₹450.00 from Global Equity Partners has been credited to your wallet.</p>
            </div>
          </div>

          {/* Read #2 - System */}
          <div className="group relative bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md flex gap-unit-md items-start opacity-80 hover:opacity-100 hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 text-on-surface-variant">
              <span className="material-symbols-outlined">security</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-label-md font-label-md text-primary">New Login Detected</h3>
                <span className="text-label-sm font-label-sm text-on-surface-variant">Oct 24, 2024</span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface-variant">We detected a login from a new device (MacBook Pro) in San Francisco, CA. If this wasn&apos;t you, please secure your account.</p>
            </div>
          </div>
        </div>

        <div className="mt-unit-lg flex justify-center">
          <button className="px-unit-md py-2 border border-outline-variant rounded-lg text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors">Load More</button>
        </div>
      </div>
    </div>
  );
}

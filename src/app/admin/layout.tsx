import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased flex min-h-screen">
      {/* Persistent Admin Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[260px] z-40 bg-surface-container-lowest border-r border-outline-variant flex flex-col p-unit-md gap-unit-sm hidden md:flex">
        
        {/* Header */}
        <div className="flex items-center gap-unit-sm mb-unit-lg px-unit-sm">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-headline-sm">
            A
          </div>
          <div>
            <h2 className="text-headline-sm font-headline-sm font-bold text-primary">Admin Console</h2>
            <p className="text-label-sm font-label-sm text-on-surface-variant">System Control</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 flex-1">
          <Link href="/admin" className="flex items-center gap-unit-sm p-unit-sm bg-primary text-on-primary rounded-lg font-bold text-label-md font-label-md transition-all brightness-90">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
            Analytics
          </Link>
          <Link href="/admin/users" className="flex items-center gap-unit-sm p-unit-sm text-on-surface-variant hover:bg-surface-container-low text-label-md font-label-md rounded-lg transition-all">
            <span className="material-symbols-outlined">group</span>
            Users
          </Link>
          <Link href="/admin/plans" className="flex items-center gap-unit-sm p-unit-sm text-on-surface-variant hover:bg-surface-container-low text-label-md font-label-md rounded-lg transition-all">
            <span className="material-symbols-outlined">description</span>
            FD Plans
          </Link>
          <Link href="/admin/investments" className="flex items-center gap-unit-sm p-unit-sm text-on-surface-variant hover:bg-surface-container-low text-label-md font-label-md rounded-lg transition-all">
            <span className="material-symbols-outlined">trending_up</span>
            Investments
          </Link>
          <Link href="/admin/withdrawals" className="flex items-center gap-unit-sm p-unit-sm text-on-surface-variant hover:bg-surface-container-low text-label-md font-label-md rounded-lg transition-all">
            <span className="material-symbols-outlined">account_balance</span>
            Withdrawals
          </Link>
          <Link href="/admin/transactions" className="flex items-center gap-unit-sm p-unit-sm text-on-surface-variant hover:bg-surface-container-low text-label-md font-label-md rounded-lg transition-all">
            <span className="material-symbols-outlined">receipt_long</span>
            Transactions
          </Link>
          <Link href="/admin/cms" className="flex items-center gap-unit-sm p-unit-sm text-on-surface-variant hover:bg-surface-container-low text-label-md font-label-md rounded-lg transition-all">
            <span className="material-symbols-outlined">edit_note</span>
            CMS Editor
          </Link>
          
          <div className="mt-auto">
            <Link href="/admin/settings" className="flex items-center gap-unit-sm p-unit-sm text-on-surface-variant hover:bg-surface-container-low text-label-md font-label-md rounded-lg transition-all">
              <span className="material-symbols-outlined">settings_applications</span>
              Settings
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[260px] flex flex-col w-full">
        {/* Top Bar */}
        <header className="h-16 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between px-margin-desktop sticky top-0 z-30">
          <h1 className="text-headline-md font-headline-md text-primary">Admin Console</h1>
          <div className="flex items-center gap-gutter">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-surface rounded-lg border border-outline-variant text-body-sm font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none w-64" />
            </div>
            <button className="relative text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <Link href="/" className="border border-primary text-primary px-4 py-2 rounded-lg text-label-md font-label-md hover:bg-surface-container-high transition-colors">
              View Site
            </Link>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <div className="p-margin-mobile md:p-margin-desktop flex-col gap-unit-xl max-w-container-max mx-auto w-full flex">
          {children}
        </div>
      </main>
    </div>
  );
}

import Link from 'next/link';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased flex min-h-screen">
      <AdminSidebar />

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

import Link from 'next/link';
import Sidebar from './Sidebar';
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  
  // Force admin users to the admin dashboard instead of user dashboard
  if (user?.role === "ADMIN") {
    redirect("/admin");
  } else if (user?.role === "EMPLOYEE") {
    redirect("/employee");
  }

  return (
    <div className="flex h-screen w-full">
      {/* SideNavBar Shared Component */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[240px] flex flex-col h-screen overflow-hidden bg-background">
        {/* Top Header */}
        <header className="h-16 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between px-margin-desktop shrink-0">
          <h2 className="text-headline-sm font-headline-sm text-primary font-bold">Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-64 pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <Link href="/dashboard/notifications" className="text-on-surface-variant hover:text-primary transition-colors relative flex items-center">
              <span className="material-symbols-outlined">notifications</span>
              {/* Optional: Add a red dot indicator if there are unread notifications
              <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span> 
              */}
            </Link>
            <Link href="/dashboard/profile" className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-sm">person</span>
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

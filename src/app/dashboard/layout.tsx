import Sidebar from './Sidebar';
import UserMenu from '@/components/UserMenu';
import NotificationBell from '@/components/NotificationBell';
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PinGate } from "@/components/PinGate";

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
    <PinGate>
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
              <NotificationBell basePath="/dashboard" />
              <UserMenu />
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </main>
      </div>
    </PinGate>
  );
}

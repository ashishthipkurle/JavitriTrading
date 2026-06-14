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
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center cursor-pointer">
              <span className="material-symbols-outlined text-sm">person</span>
            </div>
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

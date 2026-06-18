import Link from 'next/link';
import AdminSidebar from './AdminSidebar';
import UserMenu from '@/components/UserMenu';
import NotificationBell from '@/components/NotificationBell';
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  // Only ADMIN role can access admin pages
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "ADMIN") {
    // Redirect non-admins to their appropriate dashboard
    if (user.role === "EMPLOYEE") {
      redirect("/employee");
    }
    redirect("/dashboard");
  }

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
            <NotificationBell basePath="/admin" />
            <UserMenu />
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

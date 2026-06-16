import Link from 'next/link';
import EmployeeSidebar from './EmployeeSidebar';
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  // Only EMPLOYEE role can access employee pages
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "EMPLOYEE") {
    // Redirect non-employees to their appropriate dashboard
    if (user.role === "ADMIN") {
      redirect("/admin");
    }
    redirect("/dashboard");
  }

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased flex min-h-screen">
      <EmployeeSidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[260px] flex flex-col w-full">
        {/* Top Bar */}
        <header className="h-16 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between px-margin-desktop sticky top-0 z-30">
          <h1 className="text-headline-md font-headline-md text-primary">Employee Workspace</h1>
          <div className="flex items-center gap-gutter">
            {/* Action buttons could go here */}
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

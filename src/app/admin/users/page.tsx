import Link from 'next/link';
import prisma from "@/lib/prisma";
import UserActionsDropdown from "./UserActionsDropdown";
import KycStatusBadge from "./KycStatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      kycStatus: true,
      walletBalance: true,
      createdAt: true,
      isBlocked: true,
      kyc: {
        select: {
          panDocUrl: true,
          aadhaarDocUrl: true,
        }
      }
    }
  });

  return (
    <>
      {/* Header & Controls */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-unit-lg">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-primary">User Management</h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">Manage platform investors and verifications.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-sm font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Search users by name or email..." type="text" />
          </div>
          <div className="relative flex-grow sm:w-48">
            <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-3 pr-10 py-2 text-body-sm font-body-sm appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors">
              <option value="">All KYC Statuses</option>
              <option value="APPROVED">Verified</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
          </div>
        </div>
      </header>

      {/* Users Table Card */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant flex-grow shadow-[0px_4px_12px_rgba(10,22,40,0.04)]">
        <div className="">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">User</th>
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Wallet Balance</th>
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Joined Date</th>
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {users.map((user) => {
                const initials = (user.name || user.email || 'U').substring(0, 2).toUpperCase();

                return (
                  <tr key={user.id} className="hover:bg-surface-container-low transition-colors h-[72px]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-label-md font-label-md font-bold border border-outline-variant">
                          {initials}
                        </div>
                        <div>
                          <p className="text-label-md font-label-md text-primary">{user.name || "Unknown User"}</p>
                          <p className="text-body-sm font-body-sm text-on-surface-variant">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.isBlocked ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-label-sm font-label-sm gap-1 bg-error-container text-on-error-container">
                          <span className="material-symbols-outlined text-[14px]">block</span>
                          Blocked
                        </span>
                      ) : (
                        <KycStatusBadge userId={user.id} kycStatus={user.kycStatus} userName={user.name || user.email} />
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <p className="text-data-mono font-data-mono text-primary">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(user.walletBalance || 0))}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-body-sm font-body-sm text-on-surface-variant">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/users/${user.id}/documents`} className="inline-flex items-center justify-center px-4 py-2 border border-outline-variant text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg text-label-sm font-label-sm transition-colors" title="View User Documents">
                          Documents
                        </Link>
                        <UserActionsDropdown userId={user.id} isBlocked={user.isBlocked} userName={user.name || user.email} kycStatus={user.kycStatus} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                    No users found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination placeholder */}
        {users.length > 0 && (
          <div className="border-t border-outline-variant p-4 flex items-center justify-between bg-surface-container-lowest">
            <p className="text-body-sm font-body-sm text-on-surface-variant">Showing all {users.length} entries</p>
            <div className="flex gap-2 opacity-50 pointer-events-none">
              <button className="px-3 py-1 border border-outline-variant rounded text-on-surface-variant">Prev</button>
              <button className="px-3 py-1 border border-outline-variant rounded bg-primary text-on-primary font-medium">1</button>
              <button className="px-3 py-1 border border-outline-variant rounded text-on-surface-variant">Next</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

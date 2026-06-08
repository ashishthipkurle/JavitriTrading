import Link from 'next/link';

export default function AdminUsersPage() {
  return (
    <>
      {/* Header & Controls */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
          </div>
        </div>
      </header>

      {/* Users Table Card */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex-grow shadow-[0px_4px_12px_rgba(10,22,40,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">User</th>
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Portfolio Balance</th>
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Joined Date</th>
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <tr className="hover:bg-surface-container-low transition-colors h-[72px]">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-label-md font-label-md font-bold border border-outline-variant">JC</div>
                    <div>
                      <p className="text-label-md font-label-md text-primary">James Chen</p>
                      <p className="text-body-sm font-body-sm text-on-surface-variant">james.chen@example.com</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#009668]/10 text-[#005236] text-label-sm font-label-sm gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Verified
                  </span>
                </td>
                <td className="p-4 text-right">
                  <p className="text-data-mono font-data-mono text-primary">₹12,45,000</p>
                </td>
                <td className="p-4">
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Oct 12, 2023</p>
                </td>
                <td className="p-4 text-right">
                  <Link className="inline-flex items-center justify-center px-4 py-2 border border-primary text-primary rounded-lg text-label-sm font-label-sm hover:bg-surface-container transition-colors" href="/admin/users/1">
                    View
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors h-[72px]">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-label-md font-label-md font-bold border border-outline-variant">ER</div>
                    <div>
                      <p className="text-label-md font-label-md text-primary">Elena Rodriguez</p>
                      <p className="text-body-sm font-body-sm text-on-surface-variant">elena.r@example.com</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container text-label-sm font-label-sm gap-1">
                    <span className="material-symbols-outlined text-[14px]">pending</span>
                    Pending KYC
                  </span>
                </td>
                <td className="p-4 text-right">
                  <p className="text-data-mono font-data-mono text-primary">₹4,50,200</p>
                </td>
                <td className="p-4">
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Nov 05, 2023</p>
                </td>
                <td className="p-4 text-right">
                  <Link className="inline-flex items-center justify-center px-4 py-2 border border-primary text-primary rounded-lg text-label-sm font-label-sm hover:bg-surface-container transition-colors" href="/admin/users/2">
                    View
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors h-[72px]">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-label-md font-label-md font-bold border border-outline-variant">MV</div>
                    <div>
                      <p className="text-label-md font-label-md text-primary">Marcus Vance</p>
                      <p className="text-body-sm font-body-sm text-on-surface-variant">mvance@enterprise.co</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#ba1a1a]/10 text-[#93000a] text-label-sm font-label-sm gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    Rejected
                  </span>
                </td>
                <td className="p-4 text-right">
                  <p className="text-data-mono font-data-mono text-primary">₹0.00</p>
                </td>
                <td className="p-4">
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Dec 01, 2023</p>
                </td>
                <td className="p-4 text-right">
                  <Link className="inline-flex items-center justify-center px-4 py-2 border border-primary text-primary rounded-lg text-label-sm font-label-sm hover:bg-surface-container transition-colors" href="/admin/users/3">
                    View
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="border-t border-outline-variant p-4 flex items-center justify-between bg-surface-container-lowest">
          <p className="text-body-sm font-body-sm text-on-surface-variant">Showing 1 to 3 of 42 entries</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-outline-variant rounded text-on-surface-variant disabled:opacity-50 hover:bg-surface-container transition-colors" disabled>Prev</button>
            <button className="px-3 py-1 border border-outline-variant rounded bg-primary text-on-primary font-medium">1</button>
            <button className="px-3 py-1 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container transition-colors">2</button>
            <button className="px-3 py-1 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container transition-colors">3</button>
            <button className="px-3 py-1 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container transition-colors">Next</button>
          </div>
        </div>
      </div>
    </>
  );
}

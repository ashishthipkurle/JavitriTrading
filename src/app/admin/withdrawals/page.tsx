export default function AdminWithdrawalsPage() {
  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-unit-lg">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary mb-1">Withdrawal Requests</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Manage and process user fund withdrawals.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface border border-outline-variant text-primary px-4 py-2 rounded-lg text-label-md font-label-md flex items-center gap-2 hover:bg-surface-container-low transition-colors h-11">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-unit-md border-b border-outline-variant pb-unit-sm">
        <div className="flex gap-6 w-full overflow-x-auto no-scrollbar">
          <button className="text-label-md font-label-md text-primary border-b-2 border-primary pb-2 whitespace-nowrap px-1">
            Pending (12)
          </button>
          <button className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors pb-2 whitespace-nowrap px-1 border-b-2 border-transparent">
            Processing (5)
          </button>
          <button className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors pb-2 whitespace-nowrap px-1 border-b-2 border-transparent">
            Completed
          </button>
          <button className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors pb-2 whitespace-nowrap px-1 border-b-2 border-transparent">
            Rejected
          </button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input className="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-sm font-body-sm focus:outline-none focus:border-primary transition-colors h-11" placeholder="Search user or ID..." type="text" />
          </div>
          <button className="bg-surface border border-outline-variant text-primary w-11 h-11 rounded-lg flex items-center justify-center hover:bg-surface-container-low transition-colors shrink-0">
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
          </button>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-lowest">
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Req ID</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">User Details</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Bank Route</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Date Requested</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <tr className="hover:bg-surface-container-low transition-colors group h-[64px]">
                <td className="px-unit-md text-data-mono font-data-mono text-on-surface-variant">#WD-8924</td>
                <td className="px-unit-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-label-sm font-label-sm font-bold">JD</div>
                    <div>
                      <p className="text-label-md font-label-md text-primary">Jonathan Doe</p>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">jonathan.d@example.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-unit-md text-right text-data-mono font-data-mono text-primary font-semibold">₹1,25,000</td>
                <td className="px-unit-md">
                  <p className="text-body-sm font-body-sm text-primary">HDFC Bank</p>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">**** 4592</p>
                </td>
                <td className="px-unit-md text-body-sm font-body-sm text-on-surface-variant">Oct 24, 09:15 AM</td>
                <td className="px-unit-md text-right">
                  <div className="flex justify-end gap-2">
                    <button className="w-8 h-8 rounded flex items-center justify-center text-error hover:bg-error-container transition-colors" title="Reject">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                    <button className="w-8 h-8 rounded flex items-center justify-center text-tertiary-fixed-dim hover:bg-tertiary-fixed-dim/20 transition-colors" title="Approve">
                      <span className="material-symbols-outlined text-[20px]">check</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors group h-[64px]">
                <td className="px-unit-md text-data-mono font-data-mono text-on-surface-variant">#WD-8923</td>
                <td className="px-unit-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-container flex items-center justify-center text-label-sm font-label-sm font-bold">SW</div>
                    <div>
                      <p className="text-label-md font-label-md text-primary">Sarah Williams</p>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">s.williams@corp.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-unit-md text-right text-data-mono font-data-mono text-primary font-semibold">₹32,000</td>
                <td className="px-unit-md">
                  <p className="text-body-sm font-body-sm text-primary">ICICI Bank</p>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">**** 8812</p>
                </td>
                <td className="px-unit-md text-body-sm font-body-sm text-on-surface-variant">Oct 24, 08:42 AM</td>
                <td className="px-unit-md text-right">
                  <div className="flex justify-end gap-2">
                    <button className="w-8 h-8 rounded flex items-center justify-center text-error hover:bg-error-container transition-colors" title="Reject">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                    <button className="w-8 h-8 rounded flex items-center justify-center text-tertiary-fixed-dim hover:bg-tertiary-fixed-dim/20 transition-colors" title="Approve">
                      <span className="material-symbols-outlined text-[20px]">check</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors group h-[64px]">
                <td className="px-unit-md text-data-mono font-data-mono text-on-surface-variant">#WD-8921</td>
                <td className="px-unit-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-tint text-on-primary flex items-center justify-center text-label-sm font-label-sm font-bold">MC</div>
                    <div>
                      <p className="text-label-md font-label-md text-primary">Michael Chen</p>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">mchen.invest@web.net</p>
                    </div>
                  </div>
                </td>
                <td className="px-unit-md text-right text-data-mono font-data-mono text-primary font-semibold">₹4,50,000</td>
                <td className="px-unit-md">
                  <p className="text-body-sm font-body-sm text-primary">Axis Bank</p>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">**** 1109</p>
                </td>
                <td className="px-unit-md text-body-sm font-body-sm text-on-surface-variant">Oct 23, 16:20 PM</td>
                <td className="px-unit-md text-right">
                  <div className="flex justify-end gap-2">
                    <button className="w-8 h-8 rounded flex items-center justify-center text-error hover:bg-error-container transition-colors" title="Reject">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                    <button className="w-8 h-8 rounded flex items-center justify-center text-tertiary-fixed-dim hover:bg-tertiary-fixed-dim/20 transition-colors" title="Approve">
                      <span className="material-symbols-outlined text-[20px]">check</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="border-t border-outline-variant p-4 flex items-center justify-between bg-surface-container-lowest">
          <span className="text-body-sm font-body-sm text-on-surface-variant">Showing 1-3 of 12</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 rounded flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded flex items-center justify-center border border-primary bg-primary text-on-primary text-label-sm font-label-sm">1</button>
            <button className="w-8 h-8 rounded flex items-center justify-center border border-outline-variant text-primary text-label-sm font-label-sm hover:bg-surface-container-low">2</button>
            <button className="w-8 h-8 rounded flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container-low">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

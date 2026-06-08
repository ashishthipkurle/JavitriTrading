import Link from 'next/link';

export default function UserDetailPage() {
  return (
    <div className="flex flex-col gap-gutter -mt-unit-xl">
      {/* Detail Header */}
      <div className="bg-surface-container-lowest border-b border-outline-variant px-0 py-unit-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-unit-sm">
          <Link className="flex items-center gap-unit-sm text-on-surface-variant hover:text-primary transition-colors w-fit" href="/admin/users">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span className="text-label-md font-label-md">Back to Users</span>
          </Link>
          <div className="flex items-center gap-unit-md mt-2 flex-wrap">
            <h1 className="text-headline-lg font-headline-lg text-on-surface tracking-tight">Alexander Mercer</h1>
            <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-label-sm border border-secondary/20">
              KYC Pending Review
            </span>
            <span className="text-label-md font-label-md text-on-surface-variant bg-surface px-2 py-1 rounded border border-outline-variant">ID: USR-88492</span>
          </div>
        </div>
        <div className="flex items-center gap-unit-md">
          <button className="px-4 py-2 border border-outline-variant text-on-surface rounded-lg text-label-md font-label-md hover:bg-surface-container-high transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            Suspend Account
          </button>
        </div>
      </div>

      {/* Top Row: Profile & KYC */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
        {/* Profile Details */}
        <div className="xl:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg flex flex-col gap-unit-lg">
          <div className="flex items-center gap-unit-md pb-unit-md border-b border-outline-variant/50">
            <div className="w-16 h-16 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary text-headline-md font-headline-md font-bold">AM</div>
            <div>
              <h3 className="text-headline-sm font-headline-sm text-on-surface">Client Profile</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">Joined Oct 12, 2023</p>
            </div>
          </div>
          <div className="flex flex-col gap-unit-md">
            <div>
              <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider mb-1">Email Address</p>
              <p className="text-body-md font-body-md text-on-surface">alex.mercer@example.com</p>
            </div>
            <div>
              <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider mb-1">Phone Number</p>
              <p className="text-body-md font-body-md text-on-surface">+91 98765 43210</p>
            </div>
            <div>
              <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider mb-1">Risk Tolerance</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-3 h-3 rounded-full bg-secondary-container"></span>
                <p className="text-body-md font-body-md text-on-surface">Moderate Aggressive</p>
              </div>
            </div>
            <div>
              <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider mb-1">Total Assets (AUM)</p>
              <p className="text-headline-md font-headline-md text-primary">₹1,42,500</p>
            </div>
          </div>
        </div>

        {/* KYC Review Zone */}
        <div className="xl:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-unit-lg gap-4">
            <div>
              <h3 className="text-headline-sm font-headline-sm text-on-surface">Identity Verification (KYC)</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">Review submitted documents to approve account features.</p>
            </div>
            <div className="flex gap-unit-sm">
              <button className="px-6 py-2.5 bg-error/10 text-error border border-error/20 rounded-lg text-label-md font-label-md hover:bg-error/20 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">close</span>
                Reject
              </button>
              <button className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-label-md hover:opacity-90 transition-opacity flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check</span>
                Approve KYC
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-lg mt-unit-sm flex-1">
            <div className="flex flex-col gap-unit-sm">
              <div className="flex items-center justify-between">
                <span className="text-label-md font-label-md text-on-surface">Government ID (Front)</span>
                <button className="text-primary hover:underline text-label-sm font-label-sm">View Full</button>
              </div>
              <div className="w-full h-48 bg-surface-container rounded-lg border border-outline-variant overflow-hidden relative group cursor-pointer flex items-center justify-center">
                <span className="material-symbols-outlined text-[48px] text-outline">badge</span>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors"></div>
              </div>
            </div>
            <div className="flex flex-col gap-unit-sm">
              <div className="flex items-center justify-between">
                <span className="text-label-md font-label-md text-on-surface">Proof of Address</span>
                <button className="text-primary hover:underline text-label-sm font-label-sm">View Full</button>
              </div>
              <div className="w-full h-48 bg-surface-container rounded-lg border border-outline-variant overflow-hidden relative group cursor-pointer flex items-center justify-center">
                <span className="material-symbols-outlined text-[48px] text-outline">description</span>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Investment History */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col">
        <div className="p-unit-lg border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
          <h3 className="text-headline-sm font-headline-sm text-on-surface">Investment History</h3>
          <button className="text-primary text-label-md font-label-md hover:underline flex items-center gap-1">
            Download CSV <span className="material-symbols-outlined text-[18px]">download</span>
          </button>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface/50">
                <th className="py-4 px-unit-lg text-label-sm font-label-sm text-outline uppercase tracking-wider">Date</th>
                <th className="py-4 px-unit-lg text-label-sm font-label-sm text-outline uppercase tracking-wider">Transaction ID</th>
                <th className="py-4 px-unit-lg text-label-sm font-label-sm text-outline uppercase tracking-wider">Type / Asset</th>
                <th className="py-4 px-unit-lg text-label-sm font-label-sm text-outline uppercase tracking-wider text-right">Amount</th>
                <th className="py-4 px-unit-lg text-label-sm font-label-sm text-outline uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-body-sm font-body-sm text-on-surface">
              <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors h-[56px]">
                <td className="py-3 px-unit-lg text-on-surface-variant">Oct 24, 2023</td>
                <td className="py-3 px-unit-lg font-data-mono text-data-mono">TRX-9928-A</td>
                <td className="py-3 px-unit-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary-container text-[18px]">call_made</span>
                    Deposit to Vault
                  </div>
                </td>
                <td className="py-3 px-unit-lg text-right font-data-mono text-data-mono">+₹50,000</td>
                <td className="py-3 px-unit-lg text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant">Completed</span>
                </td>
              </tr>
              <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors h-[56px]">
                <td className="py-3 px-unit-lg text-on-surface-variant">Oct 18, 2023</td>
                <td className="py-3 px-unit-lg font-data-mono text-data-mono">TRX-8812-F</td>
                <td className="py-3 px-unit-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline text-[18px]">account_balance</span>
                    FD Allocation (12 Mo)
                  </div>
                </td>
                <td className="py-3 px-unit-lg text-right font-data-mono text-data-mono">-₹25,000</td>
                <td className="py-3 px-unit-lg text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant">Completed</span>
                </td>
              </tr>
              <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors h-[56px]">
                <td className="py-3 px-unit-lg text-on-surface-variant">Oct 15, 2023</td>
                <td className="py-3 px-unit-lg font-data-mono text-data-mono">TRX-7741-B</td>
                <td className="py-3 px-unit-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary-container text-[18px]">call_made</span>
                    Initial Deposit
                  </div>
                </td>
                <td className="py-3 px-unit-lg text-right font-data-mono text-data-mono">+₹1,17,500</td>
                <td className="py-3 px-unit-lg text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant">Completed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-unit-md flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest">
          <span className="text-label-sm font-label-sm text-on-surface-variant">Showing 1-3 of 3 records</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-outline opacity-50 cursor-not-allowed">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-outline opacity-50 cursor-not-allowed">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

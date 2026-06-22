import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import WithdrawalActionModals from "./WithdrawalActionModals";

export const dynamic = "force-dynamic";

export default async function AdminWithdrawalsPage() {
  const withdrawals = await prisma.withdrawalRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        include: {
          kyc: true,
        }
      }
    }
  });

  const pendingCount = withdrawals.filter(w => w.status === "PENDING").length;
  const processingCount = withdrawals.filter(w => w.status === "PROCESSING").length;

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
            Pending ({pendingCount})
          </button>
          <button className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors pb-2 whitespace-nowrap px-1 border-b-2 border-transparent">
            Processing ({processingCount})
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
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Status & Bank</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Date Requested</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {withdrawals.map((req) => {
                const user = req.user;
                const initials = (user.name || user.email || "U").substring(0, 2).toUpperCase();

                let statusColor = "bg-secondary-container/20 text-on-secondary-container";
                if (req.status === "COMPLETED") statusColor = "bg-[#009668]/10 text-[#005236]";
                if (req.status === "FAILED") statusColor = "bg-[#ba1a1a]/10 text-[#93000a]";

                const bankAccountDecrypted = user.kyc?.bankAccount ? decrypt(user.kyc.bankAccount) : null;

                return (
                  <tr key={req.id} className="hover:bg-surface-container-low transition-colors group h-[64px]">
                    <td className="px-unit-md text-data-mono font-data-mono text-on-surface-variant">
                      #WD-{req.id.slice(-4).toUpperCase()}
                    </td>
                    <td className="px-unit-md">
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-label-sm font-label-sm font-bold">
                          {initials}
                        </div>
                        <div>
                          <p className="text-label-md font-label-md text-primary">{user.name || "Unknown User"}</p>
                          <p className="text-label-sm font-label-sm text-on-surface-variant">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-unit-md text-right text-data-mono font-data-mono text-primary font-semibold">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(req.amount))}
                    </td>
                    <td className="px-unit-md">
                      <p className="text-body-sm font-body-sm text-primary flex items-center gap-1">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${statusColor}`}>
                          {req.status}
                        </span>
                      </p>
                      <p className="text-label-sm font-label-sm text-on-surface-variant mt-0.5">
                        IFSC: {user.kyc?.ifsc || "Not provided"}
                      </p>
                    </td>
                    <td className="px-unit-md text-body-sm font-body-sm text-on-surface-variant">
                      {new Date(req.createdAt).toLocaleString('en-IN', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-unit-md text-right">
                      {req.status === "PENDING" ? (
                        <WithdrawalActionModals 
                          withdrawalId={req.id} 
                          amount={Number(req.amount)}
                          bankAccount={bankAccountDecrypted}
                          ifsc={user.kyc?.ifsc || null}
                          bankName={user.kyc?.bankName || null}
                          accountType={user.kyc?.accountType || null}
                          upiId={user.kyc?.upiId || null}
                        />
                      ) : (
                        <span className="text-label-sm font-label-sm text-on-surface-variant italic">Processed</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {withdrawals.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                    No withdrawal requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {withdrawals.length > 0 && (
          <div className="border-t border-outline-variant p-4 flex items-center justify-between bg-surface-container-lowest">
            <span className="text-body-sm font-body-sm text-on-surface-variant">Showing all {withdrawals.length}</span>
            <div className="flex gap-1 opacity-50 pointer-events-none">
              <button className="w-8 h-8 rounded flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container-low" disabled>
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center border border-primary bg-primary text-on-primary text-label-sm font-label-sm">1</button>
              <button className="w-8 h-8 rounded flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container-low">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

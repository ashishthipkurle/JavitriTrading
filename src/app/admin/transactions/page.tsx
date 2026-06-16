import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminTransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
    }
  });

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-unit-lg">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary mb-1">Transactions Log</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Monitor all financial transactions across the platform.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface border border-outline-variant text-primary px-4 py-2 rounded-lg text-label-md font-label-md flex items-center gap-2 hover:bg-surface-container-low transition-colors h-11">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-lowest">
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Txn ID</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">User</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Type</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {transactions.map((txn) => {
                let statusColor = "bg-secondary-container/20 text-on-secondary-container";
                if (txn.status === "SUCCESS") statusColor = "bg-[#009668]/10 text-[#005236]";
                if (txn.status === "FAILED") statusColor = "bg-[#ba1a1a]/10 text-[#93000a]";
                if (txn.status === "REVERSED") statusColor = "bg-surface-variant text-on-surface-variant";

                let typeIcon = "sync_alt";
                if (txn.type === "DEPOSIT") typeIcon = "add_circle";
                if (txn.type === "WITHDRAWAL") typeIcon = "account_balance";
                if (txn.type === "INVESTMENT") typeIcon = "trending_up";
                if (txn.type === "PAYOUT") typeIcon = "payments";

                return (
                  <tr key={txn.id} className="hover:bg-surface-container-low transition-colors group h-[64px]">
                    <td className="px-unit-md text-data-mono font-data-mono text-on-surface-variant">
                      #{txn.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-unit-md">
                      <p className="text-label-md font-label-md text-primary">{txn.user.name || "Unknown User"}</p>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">{txn.user.email}</p>
                    </td>
                    <td className="px-unit-md">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary">{typeIcon}</span>
                        <span className="text-label-sm font-label-sm text-on-surface uppercase tracking-wider">{txn.type}</span>
                      </div>
                    </td>
                    <td className="px-unit-md text-right text-data-mono font-data-mono text-primary font-semibold">
                      {txn.type === "WITHDRAWAL" || txn.type === "INVESTMENT" ? "-" : "+"}
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(txn.amount))}
                    </td>
                    <td className="px-unit-md text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-unit-md text-body-sm font-body-sm text-on-surface-variant">
                      {new Date(txn.createdAt).toLocaleString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                );
              })}

              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4 mt-6">
                      <span className="material-symbols-outlined text-4xl text-outline">receipt_long</span>
                    </div>
                    <h2 className="text-headline-sm font-headline-sm text-on-surface mb-2">No Transactions Found</h2>
                    <p className="text-body-md font-body-md text-on-surface-variant max-w-md">
                      There are currently no transactions in the database. When users deposit or withdraw, transactions will appear here.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminInvestmentsPage() {
  const investments = await prisma.investment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      plan: true,
    }
  });

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-unit-lg">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary mb-1">Investments Manager</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">View and manage user investments.</p>
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
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Inv ID</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">User</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Plan</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                <th className="px-unit-md py-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {investments.map((inv) => {
                let statusColor = "bg-secondary-container/20 text-on-secondary-container";
                if (inv.status === "ACTIVE") statusColor = "bg-[#009668]/10 text-[#005236]";
                if (inv.status === "MATURED") statusColor = "bg-primary-container text-on-primary-container";
                if (inv.status === "WITHDRAWN") statusColor = "bg-surface-variant text-on-surface-variant";

                return (
                  <tr key={inv.id} className="hover:bg-surface-container-low transition-colors group h-[64px]">
                    <td className="px-unit-md text-data-mono font-data-mono text-on-surface-variant">
                      #{inv.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-unit-md">
                      <p className="text-label-md font-label-md text-primary">{inv.user.name || "Unknown User"}</p>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">{inv.user.email}</p>
                    </td>
                    <td className="px-unit-md">
                      <p className="text-label-md font-label-md text-primary">{inv.plan.name}</p>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">
                        {inv.monthlyReturn.toString()}% / mo
                      </p>
                    </td>
                    <td className="px-unit-md text-right text-data-mono font-data-mono text-primary font-semibold">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(inv.amount))}
                    </td>
                    <td className="px-unit-md text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-label-sm font-label-sm uppercase tracking-wider ${statusColor}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-unit-md">
                      <p className="text-body-sm font-body-sm text-on-surface-variant">
                        Start: {new Date(inv.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-body-sm font-body-sm text-on-surface-variant">
                        Ends: {new Date(inv.maturityDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </td>
                  </tr>
                );
              })}

              {investments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center align-middle">
                    <div className="flex flex-col items-center justify-center mx-auto">
                      <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-4xl text-outline">trending_up</span>
                      </div>
                      <h2 className="text-headline-sm font-headline-sm text-on-surface mb-2">No Investments Yet</h2>
                      <p className="text-body-md font-body-md text-on-surface-variant max-w-md">
                        There are currently no active investments in the database. When users invest in an FD Plan, they will appear here.
                      </p>
                    </div>
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

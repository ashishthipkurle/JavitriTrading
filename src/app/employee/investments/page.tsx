import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

export default async function EmployeeInvestmentsPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "EMPLOYEE") return null;

  const investments = await prisma.investment.findMany({
    where: { managedBy: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      plan: true
    }
  });

  return (
    <div className="flex flex-col gap-unit-xl">
      <div>
        <h2 className="text-headline-md font-headline-md text-primary font-bold">Client Investments</h2>
        <p className="text-body-md font-body-md text-on-surface-variant mt-1">
          A log of all FDs actively managed by you.
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant text-label-sm font-label-sm uppercase tracking-wider">
                <th className="px-unit-lg py-3 font-medium">Client</th>
                <th className="px-unit-lg py-3 font-medium">Plan Details</th>
                <th className="px-unit-lg py-3 font-medium">Amount</th>
                <th className="px-unit-lg py-3 font-medium">Dates</th>
                <th className="px-unit-lg py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-body-sm font-body-sm text-primary">
              {investments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-unit-lg py-8 text-center text-on-surface-variant">
                    No investments managed yet.
                  </td>
                </tr>
              ) : (
                investments.map(inv => (
                  <tr key={inv.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                    <td className="px-unit-lg py-4">
                      <div className="font-bold">{inv.user.name || 'Unnamed Client'}</div>
                      <div className="text-label-sm text-on-surface-variant">{inv.user.email}</div>
                    </td>
                    <td className="px-unit-lg py-4">
                      <div className="font-bold">{inv.plan.name}</div>
                      <div className="text-label-sm text-on-surface-variant">Daily: {formatCurrency(Number(inv.plan.dailyReturnAmount))}</div>
                    </td>
                    <td className="px-unit-lg py-4 font-data-mono font-bold text-on-surface">
                      {formatCurrency(Number(inv.amount))}
                    </td>
                    <td className="px-unit-lg py-4">
                      <div className="text-label-sm">Start: {format(inv.startDate, "dd MMM yyyy")}</div>
                      <div className="text-label-sm text-on-surface-variant">End: {format(inv.maturityDate, "dd MMM yyyy")}</div>
                    </td>
                    <td className="px-unit-lg py-4">
                      <span className={`inline-block px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        inv.status === 'ACTIVE' 
                          ? 'bg-secondary-container/30 text-secondary-container' 
                          : 'bg-outline-variant/30 text-on-surface-variant'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

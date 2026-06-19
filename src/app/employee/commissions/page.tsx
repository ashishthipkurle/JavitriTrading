import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";


export const dynamic = 'force-dynamic';

export default async function EmployeeCommissionsPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "EMPLOYEE") return null;

  const commissions = await prisma.commission.findMany({
    where: { employeeId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      investment: {
        include: { user: true, plan: true }
      }
    }
  });

  const totalCommissions = commissions.reduce((sum, c) => sum + Number(c.amount), 0);

  return (
    <div className="flex flex-col gap-unit-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-md font-headline-md text-primary font-bold">Commissions & Earnings</h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">
            Track your 20% commission drops paid by the company.
          </p>
        </div>
        <div className="text-right">
          <p className="text-label-sm font-label-sm text-on-surface-variant">Lifetime Earnings</p>
          <h3 className="text-headline-lg font-headline-lg font-bold text-secondary">{formatCurrency(totalCommissions)}</h3>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant text-label-sm font-label-sm uppercase tracking-wider">
                <th className="px-unit-lg py-3 font-medium">Date</th>
                <th className="px-unit-lg py-3 font-medium">Source (Client)</th>
                <th className="px-unit-lg py-3 font-medium">FD Plan</th>
                <th className="px-unit-lg py-3 font-medium">Commission Amount</th>
                <th className="px-unit-lg py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-body-sm font-body-sm text-primary">
              {commissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-unit-lg py-8 text-center text-on-surface-variant">
                    No commissions earned yet. Assign FDs to your clients and run payouts!
                  </td>
                </tr>
              ) : (
                commissions.map(comm => (
                  <tr key={comm.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                    <td className="px-unit-lg py-4">
                      {format(comm.createdAt, "dd MMM yyyy, HH:mm")}
                    </td>
                    <td className="px-unit-lg py-4 font-bold">
                      {comm.investment.user.name || comm.investment.user.email}
                    </td>
                    <td className="px-unit-lg py-4">
                      {comm.investment.plan.name}
                    </td>
                    <td className="px-unit-lg py-4 font-data-mono font-bold text-secondary">
                      +{formatCurrency(Number(comm.amount))}
                    </td>
                    <td className="px-unit-lg py-4">
                      <span className="inline-block px-3 py-1 rounded bg-secondary-container/30 text-secondary-container text-[10px] font-bold uppercase tracking-wider">
                        {comm.status}
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

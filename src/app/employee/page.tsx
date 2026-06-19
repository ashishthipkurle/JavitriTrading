import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";


export const dynamic = 'force-dynamic';

export default async function EmployeeDashboard() {
  const user = await getAuthUser();
  if (!user || user.role !== "EMPLOYEE") return null;

  // Fetch basic stats
  const clientsCount = await prisma.user.count({
    where: { role: "CLIENT", managedBy: user.id }
  });

  const activeInvestmentsCount = await prisma.investment.count({
    where: { managedBy: user.id, status: "ACTIVE" }
  });

  const commissionsResult = await prisma.commission.aggregate({
    where: { employeeId: user.id },
    _sum: { amount: true }
  });

  const totalCommissions = Number(commissionsResult._sum.amount || 0);

  // Fetch recent clients
  const recentClients = await prisma.user.findMany({
    where: { role: "CLIENT", managedBy: user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      investments: {
        where: { status: "ACTIVE" }
      }
    }
  });

  return (
    <div className="flex flex-col gap-unit-xl">
      <div className="mb-unit-md">
        <h2 className="text-headline-md font-headline-md text-primary font-bold">Overview</h2>
        <p className="text-body-md font-body-md text-on-surface-variant mt-1">
          Welcome back, {user.name}. Here is a summary of your workspace.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-unit-md">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg shadow-sm">
          <p className="text-label-sm font-label-sm text-on-surface-variant mb-2">My Clients</p>
          <h4 className="text-headline-lg font-headline-lg font-bold text-primary">{clientsCount}</h4>
          <Link href="/employee/clients" className="mt-4 text-label-sm font-label-sm text-secondary font-bold inline-flex items-center gap-1 hover:underline">
            View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg shadow-sm">
          <p className="text-label-sm font-label-sm text-on-surface-variant mb-2">Active Client FDs</p>
          <h4 className="text-headline-lg font-headline-lg font-bold text-primary">{activeInvestmentsCount}</h4>
        </div>

        <div className="bg-secondary-container/20 border border-secondary-container rounded-xl p-unit-lg shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-secondary"></div>
          <p className="text-label-sm font-label-sm text-on-secondary-container font-bold mb-2">Total Earnings (20% Cut)</p>
          <h4 className="text-headline-lg font-headline-lg font-bold text-secondary">{formatCurrency(totalCommissions)}</h4>
          <p className="text-label-sm font-label-sm text-on-surface-variant mt-2">Paid daily by company</p>
        </div>
      </div>

      {/* Recent Clients */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden mt-unit-lg">
        <div className="px-unit-lg py-unit-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <h3 className="text-headline-sm font-headline-sm font-bold text-primary">Recent Clients</h3>
          <Link href="/employee/clients/new" className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-sm font-label-sm font-bold hover:brightness-90 transition-all">
            + New Client
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant text-label-sm font-label-sm uppercase tracking-wider">
                <th className="px-unit-lg py-3 font-medium">Name</th>
                <th className="px-unit-lg py-3 font-medium">Phone</th>
                <th className="px-unit-lg py-3 font-medium">Active FDs</th>
                <th className="px-unit-lg py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-body-sm font-body-sm text-primary">
              {recentClients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-unit-lg py-8 text-center text-on-surface-variant">
                    You have no clients yet. Click &quot;+ New Client&quot; to assign someone to your portfolio.
                  </td>
                </tr>
              ) : (
                recentClients.map(client => (
                  <tr key={client.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                    <td className="px-unit-lg py-4 font-bold">{client.name || 'No Name'}</td>
                    <td className="px-unit-lg py-4">{client.phone}</td>
                    <td className="px-unit-lg py-4">
                      {client.investments.length > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-secondary-container/30 text-secondary-container text-label-sm font-label-sm font-bold">
                          {client.investments.length} Active
                        </span>
                      ) : (
                        <span className="text-on-surface-variant text-label-sm">None</span>
                      )}
                    </td>
                    <td className="px-unit-lg py-4">
                      <Link href={`/employee/clients/${client.id}/invest`} className="text-label-sm font-label-sm text-primary border border-outline-variant px-3 py-1 rounded hover:bg-surface-container-low transition-colors">
                        Create FD
                      </Link>
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

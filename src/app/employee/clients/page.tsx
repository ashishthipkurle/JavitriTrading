import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function EmployeeClientsPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "EMPLOYEE") return null;

  const clients = await prisma.user.findMany({
    where: { role: "CLIENT", managedBy: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      investments: {
        where: { status: "ACTIVE" }
      }
    }
  });

  return (
    <div className="flex flex-col gap-unit-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-md font-headline-md text-primary font-bold">My Clients</h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">
            Manage your assigned clients and their FDs.
          </p>
        </div>
        <Link href="/employee/clients/new" className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-sm font-label-sm font-bold hover:brightness-90 transition-all">
          + New Client
        </Link>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant text-label-sm font-label-sm uppercase tracking-wider">
                <th className="px-unit-lg py-3 font-medium">Name</th>
                <th className="px-unit-lg py-3 font-medium">Phone / Email</th>
                <th className="px-unit-lg py-3 font-medium">Wallet Balance</th>
                <th className="px-unit-lg py-3 font-medium">Active FDs</th>
                <th className="px-unit-lg py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-body-sm font-body-sm text-primary">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-unit-lg py-8 text-center text-on-surface-variant">
                    No clients assigned yet. 
                  </td>
                </tr>
              ) : (
                clients.map(client => (
                  <tr key={client.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                    <td className="px-unit-lg py-4 font-bold">{client.name || 'No Name'}</td>
                    <td className="px-unit-lg py-4">
                      <div>{client.phone}</div>
                      <div className="text-label-sm text-on-surface-variant">{client.email}</div>
                    </td>
                    <td className="px-unit-lg py-4 font-data-mono">{formatCurrency(Number(client.walletBalance))}</td>
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
                      <Link href={`/employee/clients/${client.id}/invest`} className="text-label-sm font-label-sm bg-primary text-on-primary px-4 py-2 rounded-lg hover:brightness-90 transition-all font-bold">
                        Assign FD
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

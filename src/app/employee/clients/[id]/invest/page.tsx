import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import ClientInvestForm from "./ClientInvestForm";
import { formatCurrency } from "@/lib/utils";


export const dynamic = 'force-dynamic';

export default async function EmployeeClientInvestPage({ params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user || user.role !== "EMPLOYEE") return null;

  const client = await prisma.user.findUnique({
    where: { id: params.id }
  });

  if (!client || client.role !== "CLIENT" || client.managedBy !== user.id) {
    notFound();
  }

  const plans = await prisma.fDPlan.findMany({
    where: { isActive: true },
    orderBy: { amount: 'asc' }
  });

  return (
    <div className="flex flex-col gap-unit-xl">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/employee/clients" className="text-on-surface-variant hover:text-primary transition-colors flex items-center">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span className="text-label-md font-label-md ml-1">Back to Clients</span>
          </Link>
        </div>
        <h2 className="text-headline-md font-headline-md text-primary font-bold">Create FD for {client.name || 'Client'}</h2>
        <p className="text-body-md font-body-md text-on-surface-variant mt-1">
          Assign a new Fixed Deposit plan to this client.
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
        <div className="flex items-center justify-between mb-unit-lg pb-unit-md border-b border-outline-variant">
          <div>
            <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface">Client Details</h3>
            <p className="text-label-sm font-label-sm text-on-surface-variant">{client.email} • {client.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-label-sm font-label-sm text-on-surface-variant">Available Wallet Balance</p>
            <p className={`text-headline-sm font-headline-sm font-bold ${Number(client.walletBalance) > 0 ? 'text-secondary' : 'text-error'}`}>
              {formatCurrency(Number(client.walletBalance))}
            </p>
          </div>
        </div>

        {client.kycStatus !== 'APPROVED' ? (
          <div className="bg-error-container/20 border border-error text-on-error-container p-unit-md rounded-lg flex items-start gap-3">
            <span className="material-symbols-outlined text-error">error</span>
            <div>
              <h4 className="font-label-md font-bold">KYC Not Approved</h4>
              <p className="text-body-sm mt-1">This client&apos;s KYC status is currently <strong>{client.kycStatus}</strong>. They cannot invest until their KYC is approved by an admin.</p>
            </div>
          </div>
        ) : (
          <ClientInvestForm 
            clientId={client.id} 
            plans={plans.map(p => ({
              id: p.id,
              name: p.name,
              amount: Number(p.amount),
              dailyReturnAmount: Number(p.dailyReturnAmount),
              tagline: p.tagline
            }))}
            clientWallet={Number(client.walletBalance)}
          />
        )}
      </div>
    </div>
  );
}

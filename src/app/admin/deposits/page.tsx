import prisma from "@/lib/prisma";
import PaymentModeToggle from "./PaymentModeToggle";
import DepositActionModals from "./DepositActionModals";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDepositsPage() {
  const modeSetting = await prisma.siteSettings.findUnique({ where: { key: 'payment_mode' } });
  const qrSetting = await prisma.siteSettings.findUnique({ where: { key: 'payment_qr_url' } });

  const deposits = await prisma.transaction.findMany({
    where: { type: 'DEPOSIT', status: 'PENDING' },
    orderBy: { createdAt: 'asc' },
    include: { user: true } // Assuming 'user' relation points to the client receiving the deposit, but let's check schema. Actually, let's fetch carefully since transaction.userId is the client. meta contains depositRequestedBy (employeeId).
  });

  // Fetch employee names for the deposits
  const employeeIds = deposits.map((d: any) => d.meta?.depositRequestedBy).filter(Boolean);
  const employees = await prisma.user.findMany({
    where: { id: { in: employeeIds } },
    select: { id: true, name: true, email: true }
  });

  const employeeMap = employees.reduce((acc, emp) => {
    acc[emp.id] = emp.name || emp.email;
    return acc;
  }, {} as Record<string, string>);

  return (
    <>
      <header className="mb-unit-lg">
        <h2 className="text-headline-lg font-headline-lg text-primary">Manual Deposits Verification</h2>
        <p className="text-body-md font-body-md text-on-surface-variant mt-1">Review and approve manual QR deposits from employees.</p>
      </header>

      <PaymentModeToggle 
        initialMode={modeSetting?.value || 'MANUAL'} 
        initialQrUrl={qrSetting?.value || ''} 
      />

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase">Date</th>
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase">Employee (Requested By)</th>
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase">Client (Wallet)</th>
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase text-right">Amount</th>
                <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {deposits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">No pending deposits.</td>
                </tr>
              ) : (
                deposits.map((deposit) => {
                  const meta = deposit.meta as any;
                  const employeeName = employeeMap[meta?.depositRequestedBy] || 'Unknown Employee';
                  const clientName = deposit.user?.name || deposit.user?.email || 'Unknown Client';
                  
                  return (
                    <tr key={deposit.id} className="hover:bg-surface-container-low transition-colors h-[72px]">
                      <td className="p-4">
                        <p className="text-body-sm font-body-sm text-on-surface-variant">
                          {new Date(deposit.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-label-md font-label-md text-primary">{employeeName}</p>
                        {meta?.notes && <p className="text-body-sm text-on-surface-variant line-clamp-1" title={meta.notes}>Note: {meta.notes}</p>}
                      </td>
                      <td className="p-4">
                        <p className="text-label-md font-label-md text-primary">{clientName}</p>
                      </td>
                      <td className="p-4 text-right">
                        <p className="text-data-mono font-data-mono text-primary font-bold">
                          {formatCurrency(Number(deposit.amount))}
                        </p>
                      </td>
                      <td className="p-4">
                        <DepositActionModals 
                          transactionId={deposit.id} 
                          amount={Number(deposit.amount)}
                          clientName={clientName}
                          employeeName={employeeName}
                          notes={meta?.notes || ''}
                          proofUrl={meta?.proofUrl || ''}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

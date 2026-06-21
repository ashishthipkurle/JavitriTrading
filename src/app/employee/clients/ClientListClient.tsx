'use client';

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ClientListClient({ clients }: { clients: any[] }) {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showAddCashModal, setShowAddCashModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddCash = async () => {
    if (!selectedClient || !amount || Number(amount) <= 0) return;
    setIsProcessing(true);
    setErrorMsg('');

    try {
      // Step 1: Create Wallet order on server with targetClientId
      const orderRes = await fetch('/api/razorpay/wallet-create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: Number(amount),
          targetClientId: selectedClient.id
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        throw new Error(errData.error || 'Failed to create order');
      }

      const orderData = await orderRes.json();

      // Step 2: Open Razorpay Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Javitri Trading',
        description: `Wallet Top Up for ${selectedClient.name}`,
        order_id: orderData.orderId,
        prefill: {
          name: orderData.userName || '',
          email: orderData.userEmail || '',
          contact: orderData.userPhone || '',
        },
        theme: {
          color: '#0a1628',
        },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          // Step 3: Verify payment on server
          try {
            const verifyRes = await fetch('/api/razorpay/wallet-verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: Number(amount),
              }),
            });

            if (!verifyRes.ok) {
              const errData = await verifyRes.json();
              throw new Error(errData.error || 'Payment verification failed');
            }

            // Success! Close modal and refresh
            setShowAddCashModal(false);
            setAmount('');
            setNotes('');
            setSelectedClient(null);
            router.refresh();
          } catch (verifyErr: any) {
            setErrorMsg(verifyErr.message || 'Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
      setIsProcessing(false);
    }
  };

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
                <th className="px-unit-lg py-3 font-medium text-right">Actions</th>
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
                    <td className="px-unit-lg py-4 font-data-mono font-medium text-tertiary-fixed-dim">{formatCurrency(Number(client.walletBalance))}</td>
                    <td className="px-unit-lg py-4">
                      {client.investments.length > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-secondary-container/30 text-secondary-container text-label-sm font-label-sm font-bold">
                          {client.investments.length} Active
                        </span>
                      ) : (
                        <span className="text-on-surface-variant text-label-sm">None</span>
                      )}
                    </td>
                    <td className="px-unit-lg py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedClient(client); setShowAddCashModal(true); }}
                          className="text-label-sm font-label-sm bg-surface-container-lowest text-primary border border-primary px-3 py-2 rounded-lg hover:bg-surface-container-low transition-all font-bold flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                          Add Cash
                        </button>
                        <Link href={`/employee/clients/${client.id}/invest`} className="text-label-sm font-label-sm bg-primary text-on-primary px-3 py-2 rounded-lg hover:brightness-90 transition-all font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">trending_up</span>
                          Assign FD
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Cash Modal */}
      {showAddCashModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-xl border border-outline-variant overflow-hidden shadow-lg">
            <div className="flex justify-between items-center p-6 border-b border-outline-variant">
              <h3 className="text-headline-sm font-headline-sm font-bold text-primary">Top Up Wallet</h3>
              <button onClick={() => { setShowAddCashModal(false); setSelectedClient(null); }} className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                You are adding cash manually to <strong className="text-primary">{selectedClient.name}</strong>'s wallet.
              </p>
              
              <div className="flex flex-col gap-2">
                <label className="text-label-sm font-label-sm text-primary">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-data-mono">₹</span>
                  <input
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-data-mono text-body-lg text-primary"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter cash amount"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-label-sm font-label-sm text-primary">Notes (Optional)</label>
                <input
                  className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md text-primary"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cash handed over in person"
                />
              </div>

              {errorMsg && <p className="text-error text-label-sm mt-2">{errorMsg}</p>}

              <button
                disabled={isProcessing || !amount || Number(amount) <= 0}
                onClick={handleAddCash}
                className="w-full h-12 mt-4 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin material-symbols-outlined text-[20px]">progress_activity</span>
                    Processing...
                  </>
                ) : (
                  'Confirm Deposit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

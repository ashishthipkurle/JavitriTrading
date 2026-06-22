'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeWalletClient({ 
  walletBalance, 
  transactions 
}: { 
  walletBalance: number, 
  transactions: any[] 
}) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');
  const router = useRouter();

  const handleWithdraw = async () => {
    if (isProcessing || !withdrawAmount || Number(withdrawAmount) <= 0) return;
    setWithdrawError('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/v1/client/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(withdrawAmount) }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to request withdrawal');
      }

      setShowWithdrawModal(false);
      setWithdrawAmount('');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setWithdrawError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="flex flex-col gap-unit-xl w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-md font-headline-md text-primary font-bold">My Wallet</h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">
            Withdraw your earned commissions.
          </p>
        </div>
      </div>

      {/* Hero Balance Card */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-lg md:p-unit-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-unit-lg relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>
        
        <div>
          <p className="text-label-md font-label-md text-on-surface-variant mb-1">Available Balance</p>
          <div className="flex items-end gap-3">
            <h1 className="text-display-sm font-display-sm font-bold text-primary">
              {formatCurrency(walletBalance)}
            </h1>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowWithdrawModal(true)}
            className="flex-1 md:flex-none bg-surface border border-outline-variant text-primary px-6 py-3 rounded-xl font-label-lg font-bold flex justify-center items-center gap-2 hover:bg-surface-container transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">call_made</span>
            Withdraw
          </button>
        </div>
      </section>

      {/* Transactions Section */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="px-unit-lg py-unit-md border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
          <h3 className="text-headline-sm font-headline-sm font-bold text-primary">Transaction History</h3>
        </div>

        <div className="flex flex-col">
          {transactions.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-4xl text-outline">receipt_long</span>
              </div>
              <h2 className="text-headline-sm font-headline-sm text-on-surface mb-2">No Transactions Yet</h2>
              <p className="text-body-md font-body-md text-on-surface-variant max-w-sm">
                Your commissions and withdrawals will appear here.
              </p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="p-unit-lg border-b border-outline-variant/50 flex items-center justify-between hover:bg-surface-container-lowest transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'PAYOUT' ? 'bg-[#009668]/10 text-[#005236]' : 
                    'bg-surface-variant text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {tx.type === 'PAYOUT' ? 'payments' : 'call_made'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-label-lg font-label-lg text-on-surface font-bold capitalize">
                      {tx.type === 'PAYOUT' ? 'Commission Received' : 'Withdrawal Request'}
                    </h4>
                    <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                      {new Intl.DateTimeFormat('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      }).format(new Date(tx.createdAt))}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h4 className={`text-headline-sm font-headline-sm font-bold font-data-mono ${
                    tx.type === 'PAYOUT' ? 'text-[#009668]' : 'text-on-surface'
                  }`}>
                    {tx.type === 'PAYOUT' ? '+' : '-'}{formatCurrency(Number(tx.amount))}
                  </h4>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    tx.status === 'SUCCESS' || tx.status === 'PROCESSED' ? 'bg-[#009668]/10 text-[#005236]' :
                    tx.status === 'PENDING' ? 'bg-secondary-container/30 text-secondary-container' :
                    'bg-error/10 text-error'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => !isProcessing && setShowWithdrawModal(false)}></div>
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 className="text-headline-sm font-headline-sm text-primary mb-2">Request Withdrawal</h2>
              <p className="text-body-md font-body-md text-on-surface-variant mb-6">
                Enter the amount you wish to withdraw to your bank account.
              </p>

              {withdrawError && (
                <div className="bg-error-container text-on-error-container p-3 rounded-lg text-body-sm mb-4">
                  {withdrawError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Amount to Withdraw (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">₹</span>
                    <input 
                      type="number" 
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-xl pl-8 pr-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-data-mono font-medium"
                      placeholder="0.00"
                      min="1"
                      max={walletBalance}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-[12px] text-on-surface-variant">Available: {formatCurrency(walletBalance)}</p>
                    <button 
                      onClick={() => setWithdrawAmount(walletBalance.toString())}
                      className="text-[12px] font-bold text-primary hover:underline"
                    >
                      Max
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low px-6 py-4 flex items-center justify-end gap-3 border-t border-outline-variant">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                disabled={isProcessing}
                className="px-4 py-2 rounded-lg text-label-md font-label-md text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleWithdraw}
                disabled={isProcessing || !withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > walletBalance}
                className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-md font-label-md font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 shadow-sm"
              >
                {isProcessing && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

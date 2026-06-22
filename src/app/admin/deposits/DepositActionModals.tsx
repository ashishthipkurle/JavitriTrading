'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DepositActionModals({ 
  transactionId, 
  amount, 
  clientName,
  employeeName,
  notes,
  proofUrl
}: { 
  transactionId: string; 
  amount: number; 
  clientName: string;
  employeeName: string;
  notes: string;
  proofUrl?: string;
}) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    setIsProcessing(true);
    setError('');

    try {
      const endpoint = `/api/v1/admin/deposits/${transactionId}/${action.toLowerCase()}`;
      const payload = action === 'REJECT' ? { reason: rejectionReason } : {};

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${action.toLowerCase()} deposit`);
      }

      setActiveModal(null);
      setRejectionReason('');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <button 
          onClick={() => setActiveModal('APPROVE')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-container/20 text-on-secondary-container hover:bg-secondary-container/40 transition-colors"
          title="Approve"
        >
          <span className="material-symbols-outlined text-[20px]">check</span>
        </button>
        <button 
          onClick={() => setActiveModal('REJECT')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-error-container/20 text-error hover:bg-error-container/40 transition-colors"
          title="Reject"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {activeModal === 'APPROVE' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-xl w-full max-w-md shadow-lg border border-outline-variant overflow-hidden">
            <div className="p-unit-md border-b border-outline-variant flex items-center justify-between">
              <h3 className="text-headline-sm font-headline-sm font-bold text-primary">Approve Deposit</h3>
              <button onClick={() => setActiveModal(null)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-unit-md flex flex-col gap-4">
              <p className="text-body-sm text-on-surface-variant">
                You are about to approve a deposit of <strong>₹{amount}</strong> to <strong>{clientName}</strong>'s wallet, requested by employee <strong>{employeeName}</strong>.
              </p>
              {notes && (
                <div className="bg-surface-container-low p-3 rounded-lg text-body-sm italic text-on-surface-variant">
                  Note: {notes}
                </div>
              )}
              {proofUrl && (
                <div className="flex flex-col gap-2">
                  <p className="text-label-sm font-label-sm text-on-surface-variant">Payment Proof</p>
                  <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="block max-w-max border border-outline-variant rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={proofUrl} alt="Payment Proof" className="h-32 object-contain bg-white" />
                  </a>
                </div>
              )}
              {error && <p className="text-error text-label-sm">{error}</p>}
              <div className="flex gap-3 mt-2">
                <button 
                  onClick={() => setActiveModal(null)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 border border-outline-variant text-on-surface-variant rounded-lg font-label-md font-bold hover:bg-surface-container-low transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleAction('APPROVE')}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'REJECT' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-xl w-full max-w-md shadow-lg border border-outline-variant overflow-hidden">
            <div className="p-unit-md border-b border-outline-variant flex items-center justify-between">
              <h3 className="text-headline-sm font-headline-sm font-bold text-error">Reject Deposit</h3>
              <button onClick={() => setActiveModal(null)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-unit-md flex flex-col gap-4">
              <p className="text-body-sm text-on-surface-variant">
                Provide a reason for rejecting the deposit request for <strong>{clientName}</strong>. This action cannot be undone.
              </p>
              <textarea 
                placeholder="Reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-body-md focus:border-error focus:ring-1 focus:ring-error outline-none resize-none h-24"
              />
              {error && <p className="text-error text-label-sm">{error}</p>}
              <div className="flex gap-3 mt-2">
                <button 
                  onClick={() => setActiveModal(null)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 border border-outline-variant text-on-surface-variant rounded-lg font-label-md font-bold hover:bg-surface-container-low transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleAction('REJECT')}
                  disabled={isProcessing || !rejectionReason.trim()}
                  className="flex-1 px-4 py-2 bg-error text-on-error rounded-lg font-label-md font-bold hover:brightness-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface WithdrawalActionModalsProps {
  withdrawalId: string;
  amount: number;
  bankAccount: string | null;
  ifsc: string | null;
  bankName?: string | null;
  accountType?: string | null;
  upiId?: string | null;
}

export default function WithdrawalActionModals({ withdrawalId, amount, bankAccount, ifsc, bankName, accountType, upiId }: WithdrawalActionModalsProps) {
  const router = useRouter();
  
  // Modals state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Reject state
  const [rejectReason, setRejectReason] = useState('');
  
  // Approve state
  const [approveMode, setApproveMode] = useState<'MANUAL' | 'AUTOMATED'>('MANUAL');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setErrorMsg('Rejection reason is required');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/v1/admin/withdrawals/${withdrawalId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to reject withdrawal');
      }

      setShowRejectModal(false);
      setRejectReason('');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      let screenshotUrl = null;

      if (approveMode === 'MANUAL') {
        if (!screenshotFile) {
          throw new Error('Please upload a payment screenshot');
        }

        // 1. Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', screenshotFile);
        
        const uploadRes = await fetch('/api/v1/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Failed to upload screenshot');
        const uploadData = await uploadRes.json();
        screenshotUrl = uploadData.url;
      }

      // 2. Submit approval
      const res = await fetch(`/api/v1/admin/withdrawals/${withdrawalId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: approveMode,
          screenshotUrl
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to approve withdrawal');
      }

      setShowApproveModal(false);
      setScreenshotFile(null);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <>
      <div className="flex justify-end gap-2">
        <button 
          onClick={() => setShowRejectModal(true)}
          className="w-8 h-8 rounded flex items-center justify-center text-error hover:bg-error-container transition-colors" 
          title="Reject"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
        <button 
          onClick={() => setShowApproveModal(true)}
          className="w-8 h-8 rounded flex items-center justify-center text-tertiary-fixed-dim hover:bg-tertiary-fixed-dim/20 transition-colors" 
          title="Approve"
        >
          <span className="material-symbols-outlined text-[20px]">check</span>
        </button>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-surface rounded-xl w-full max-w-md shadow-lg border border-outline-variant overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-unit-md border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between">
              <h2 className="text-headline-sm font-headline-sm text-primary">Reject Withdrawal</h2>
              <button onClick={() => setShowRejectModal(false)} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-unit-md overflow-y-auto">
              <div className="mb-4">
                <p className="text-body-sm font-body-sm text-on-surface-variant mb-2">
                  Are you sure you want to reject this withdrawal of <strong className="text-error">{formatCurrency(amount)}</strong>? 
                  The exact amount will be instantly refunded to the client's wallet.
                </p>
                <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Reason for Rejection <span className="text-error">*</span></label>
                <textarea 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-body-sm font-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px]"
                  placeholder="e.g. Invalid bank details provided."
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-error-container/20 border border-error-container text-error rounded-lg text-body-sm font-body-sm mb-4">
                  {errorMsg}
                </div>
              )}
            </div>
            <div className="p-unit-md border-t border-outline-variant bg-surface-container-lowest flex justify-end gap-3">
              <button 
                onClick={() => setShowRejectModal(false)} 
                disabled={isProcessing}
                className="px-4 py-2 text-primary font-label-md font-bold hover:bg-surface-container-low rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleReject}
                disabled={isProcessing}
                className="px-6 py-2 bg-error text-on-error rounded-lg font-label-md font-bold hover:brightness-95 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? 'Processing...' : 'Confirm Reject & Refund'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-surface rounded-xl w-full max-w-md shadow-lg border border-outline-variant overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-unit-md border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between">
              <h2 className="text-headline-sm font-headline-sm text-primary">Approve Withdrawal</h2>
              <button onClick={() => setShowApproveModal(false)} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-unit-md overflow-y-auto">
              <div className="mb-6 bg-tertiary-fixed-dim/10 p-4 rounded-lg border border-tertiary-fixed-dim/20">
                <p className="text-label-sm font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Amount to Transfer</p>
                <p className="text-headline-md font-headline-md text-primary font-bold">{formatCurrency(amount)}</p>
              </div>

              <div className="mb-6 flex gap-2">
                <button
                  onClick={() => setApproveMode('MANUAL')}
                  className={`flex-1 py-2 rounded-lg text-label-md font-label-md transition-all border ${
                    approveMode === 'MANUAL' ? 'bg-primary text-on-primary border-primary' : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  Manual Payout
                </button>
                <button
                  onClick={() => setApproveMode('AUTOMATED')}
                  className={`flex-1 py-2 rounded-lg text-label-md font-label-md transition-all border ${
                    approveMode === 'AUTOMATED' ? 'bg-primary text-on-primary border-primary' : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  Automated (Razorpay)
                </button>
              </div>

              {approveMode === 'MANUAL' && (
                <div className="space-y-4">
                  <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant">
                    <h3 className="text-label-md font-label-md text-primary mb-3">Client Bank Details</h3>
                    <div className="grid grid-cols-1 gap-2 text-body-sm font-body-sm">
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Bank Name:</span>
                        <span className="font-medium text-primary">{bankName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Account Type:</span>
                        <span className="font-medium text-primary">{accountType || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Account Number:</span>
                        <span className="font-data-mono font-medium text-primary">{bankAccount || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">IFSC Code:</span>
                        <span className="font-data-mono font-medium text-primary">{ifsc || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">UPI ID:</span>
                        <span className="font-medium text-primary">{upiId || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Payment Screenshot <span className="text-error">*</span></label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setScreenshotFile(e.target.files?.[0] || null)}
                      className="w-full text-body-sm border border-outline-variant rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                </div>
              )}

              {approveMode === 'AUTOMATED' && (
                <div className="p-4 bg-secondary-container/20 rounded-lg border border-secondary-container/30 text-body-sm font-body-sm text-on-surface-variant">
                  This will trigger an automated payout via RazorpayX using the client's verified bank details. Please ensure your RazorpayX account has sufficient funds.
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-error-container/20 border border-error-container text-error rounded-lg text-body-sm font-body-sm mt-4">
                  {errorMsg}
                </div>
              )}
            </div>
            <div className="p-unit-md border-t border-outline-variant bg-surface-container-lowest flex justify-end gap-3">
              <button 
                onClick={() => setShowApproveModal(false)} 
                disabled={isProcessing}
                className="px-4 py-2 text-primary font-label-md font-bold hover:bg-surface-container-low rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleApprove}
                disabled={isProcessing}
                className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-95 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? 'Processing...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

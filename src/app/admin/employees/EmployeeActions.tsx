"use client";

import { useState, useTransition } from "react";
import { makeEmployee, demoteEmployee } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

export function UpgradeUserForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const result = await makeEmployee(email);
      setFeedback(result);
      if (result.success) {
        setEmail("");
        router.refresh();
      }
    });
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-[0px_4px_12px_rgba(10,22,40,0.04)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-on-secondary-container">person_add</span>
        </div>
        <div>
          <h3 className="text-headline-sm font-headline-sm text-on-surface">Upgrade User to Employee</h3>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Enter the email address of a registered user to promote them to an employee role.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
            disabled={isPending}
            className="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={isPending || !email.trim()}
          className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md font-label-md font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 whitespace-nowrap shadow-[0_4px_12px_rgba(16,28,46,0.12)]"
        >
          {isPending ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              Upgrading...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">upgrade</span>
              Upgrade to Employee
            </>
          )}
        </button>
      </form>

      {feedback && (
        <div
          className={`mt-4 p-3 rounded-lg text-label-md font-label-md flex items-center gap-2 ${
            feedback.success
              ? "bg-[#009668]/10 text-[#005236] border border-[#009668]/20"
              : "bg-error-container text-on-error-container border border-error/20"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {feedback.success ? "check_circle" : "error"}
          </span>
          {feedback.message}
        </div>
      )}
    </div>
  );
}

export function DemoteButton({ userId, userName }: { userId: string; userName: string }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDemote = () => {
    startTransition(async () => {
      await demoteEmployee(userId);
      setShowConfirm(false);
      router.refresh();
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-label-sm font-label-sm text-on-surface-variant">Remove {userName}?</span>
        <button
          onClick={handleDemote}
          disabled={isPending}
          className="px-3 py-1 bg-error text-on-error rounded text-label-sm font-label-sm hover:opacity-90 transition-all disabled:opacity-50"
        >
          {isPending ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1 border border-outline-variant text-on-surface-variant rounded text-label-sm font-label-sm hover:bg-surface-container-low transition-all"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="inline-flex items-center gap-1 px-3 py-1.5 border border-error/30 text-error rounded-lg text-label-sm font-label-sm hover:bg-error-container transition-colors"
      title="Demote to Client"
    >
      <span className="material-symbols-outlined text-[16px]">person_remove</span>
      Demote
    </button>
  );
}

export function EmployeeActionsDropdown({ 
  userId, 
  userName,
  kycStatus,
}: { 
  userId: string; 
  userName: string;
  kycStatus: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const [showDemoteConfirm, setShowDemoteConfirm] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [alertMessage, setAlertMessage] = useState<{isOpen: boolean, message: string}>({ isOpen: false, message: "" });

  const handleDemote = () => {
    startTransition(async () => {
      await demoteEmployee(userId);
      setShowDemoteConfirm(false);
      router.refresh();
    });
  };

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const { approveKyc } = await import("@/app/admin/users/actions");
      const res = await approveKyc(userId);
      if (res?.error) {
        setAlertMessage({ isOpen: true, message: `Error: ${res.error}` });
      }
      setShowApproveConfirm(false);
      router.refresh();
    } catch (err: any) {
      setAlertMessage({ isOpen: true, message: `An error occurred: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const { rejectKyc } = await import("@/app/admin/users/actions");
      const res = await rejectKyc(userId, rejectReason || undefined);
      if (res?.error) {
        setAlertMessage({ isOpen: true, message: `Error: ${res.error}` });
      }
      setShowRejectModal(false);
      setRejectReason("");
      router.refresh();
    } catch (err: any) {
      setAlertMessage({ isOpen: true, message: `An error occurred: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        disabled={isPending || isLoading}
        className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined">more_vert</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-full mt-1 w-44 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden py-1">
            
            {/* KYC Actions */}
            {kycStatus !== "APPROVED" && (
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setShowApproveConfirm(true);
                }}
                className="w-full text-left px-4 py-2 text-label-sm font-label-sm text-[#005236] hover:bg-[#009668]/10 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Approve KYC
              </button>
            )}

            {kycStatus !== "REJECTED" && (
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setShowRejectModal(true);
                }}
                className="w-full text-left px-4 py-2 text-label-sm font-label-sm text-[#93000a] hover:bg-[#ba1a1a]/10 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                {kycStatus === "APPROVED" ? "Revoke KYC" : "Reject KYC"}
              </button>
            )}

            <div className="h-px bg-outline-variant my-1"></div>

            {/* Demote */}
            <button 
              onClick={() => {
                setIsOpen(false);
                setShowDemoteConfirm(true);
              }}
              className="w-full text-left px-4 py-2 text-label-sm font-label-sm text-error hover:bg-error-container hover:text-on-error-container transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">person_remove</span>
              Demote
            </button>
          </div>
        </>
      )}

      {/* Demote Confirmation */}
      {showDemoteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDemoteConfirm(false)}></div>
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-headline-sm font-headline-sm text-primary mb-3">Demote Employee</h2>
              <p className="text-body-md font-body-md text-on-surface-variant">
                Are you sure you want to demote {userName} back to a client? They will lose access to the employee dashboard.
              </p>
            </div>
            <div className="bg-surface-container-low px-6 py-4 flex items-center justify-end gap-3 border-t border-outline-variant">
              <button onClick={() => setShowDemoteConfirm(false)} disabled={isPending} className="px-4 py-2 rounded-lg text-label-md font-label-md text-primary hover:bg-primary/10 transition-colors disabled:opacity-50">Cancel</button>
              <button onClick={handleDemote} disabled={isPending} className="px-4 py-2 rounded-lg text-label-md font-label-md font-bold bg-error text-on-error hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2">
                {isPending && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                Demote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve KYC Confirmation */}
      {showApproveConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowApproveConfirm(false)}></div>
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-headline-sm font-headline-sm text-primary mb-3">Approve KYC</h2>
              <p className="text-body-md font-body-md text-on-surface-variant">
                Are you sure you want to approve the KYC for {userName}? This will mark them as verified.
              </p>
            </div>
            <div className="bg-surface-container-low px-6 py-4 flex items-center justify-end gap-3 border-t border-outline-variant">
              <button onClick={() => setShowApproveConfirm(false)} disabled={isLoading} className="px-4 py-2 rounded-lg text-label-md font-label-md text-primary hover:bg-primary/10 transition-colors disabled:opacity-50">Cancel</button>
              <button onClick={handleApprove} disabled={isLoading} className="px-4 py-2 rounded-lg text-label-md font-label-md font-bold bg-primary text-on-primary hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2">
                {isLoading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                Approve KYC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject KYC Modal with reason */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setShowRejectModal(false)}>
          <div className="bg-surface rounded-xl w-full max-w-md shadow-lg border border-outline-variant flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-outline-variant bg-surface-container-lowest flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-error-container">cancel</span>
              </div>
              <div>
                <h2 className="text-headline-sm font-headline-sm text-primary">Reject KYC</h2>
                <p className="text-body-sm text-on-surface-variant">For {userName}</p>
              </div>
            </div>
            <div className="p-5">
              <label className="text-label-md font-label-md text-on-surface block mb-2">
                Rejection Reason (optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Documents are blurry, PAN card name doesn't match..."
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                rows={3}
              />
            </div>
            <div className="p-5 pt-0 flex gap-3 justify-end">
              <button
                onClick={() => { setShowRejectModal(false); setRejectReason(""); }}
                disabled={isLoading}
                className="px-4 py-2 border border-outline-variant rounded-lg text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isLoading}
                className="px-4 py-2 bg-error text-on-error rounded-lg text-label-md font-label-md hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    Rejecting...
                  </>
                ) : (
                  "Reject KYC"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal for Errors */}
      {alertMessage.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAlertMessage({ isOpen: false, message: "" })}></div>
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-headline-sm font-headline-sm text-primary mb-3">Action Failed</h2>
              <p className="text-body-md font-body-md text-on-surface-variant">{alertMessage.message}</p>
            </div>
            <div className="bg-surface-container-low px-6 py-4 flex items-center justify-end gap-3 border-t border-outline-variant">
              <button onClick={() => setAlertMessage({ isOpen: false, message: "" })} className="px-4 py-2 rounded-lg text-label-md font-label-md font-bold bg-primary text-on-primary hover:opacity-90 transition-colors">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

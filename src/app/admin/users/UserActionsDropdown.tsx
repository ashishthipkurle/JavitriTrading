"use client";

import { useState } from "react";
import { blockUser, unblockUser, deleteUser, approveKyc, rejectKyc } from "./actions";
import ConfirmModal from "@/components/ConfirmModal";

export default function UserActionsDropdown({ 
  userId, 
  isBlocked, 
  userName,
  kycStatus,
}: { 
  userId: string; 
  isBlocked: boolean;
  userName: string;
  kycStatus: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: 'block' | 'unblock' | 'delete' | 'approveKyc' | null;
    title: string;
    message: string;
    isDestructive: boolean;
  }>({
    isOpen: false,
    action: null,
    title: "",
    message: "",
    isDestructive: false
  });

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [alertMessage, setAlertMessage] = useState<{isOpen: boolean, message: string}>({ isOpen: false, message: "" });

  const initiateAction = (action: 'block' | 'unblock' | 'delete' | 'approveKyc') => {
    setIsOpen(false);
    if (action === 'delete') {
      setModalState({
        isOpen: true,
        action: 'delete',
        title: "Delete User",
        message: `Are you sure you want to completely delete ${userName || 'this user'}? This action cannot be undone and will delete all their data including transactions and KYC.`,
        isDestructive: true
      });
    } else if (action === 'block') {
      setModalState({
        isOpen: true,
        action: 'block',
        title: "Block User",
        message: `Are you sure you want to block ${userName || 'this user'}? They will be immediately logged out and unable to log back in.`,
        isDestructive: true
      });
    } else if (action === 'unblock') {
      executeAction('unblock');
    } else if (action === 'approveKyc') {
      setModalState({
        isOpen: true,
        action: 'approveKyc',
        title: "Approve KYC",
        message: `Are you sure you want to approve the KYC for ${userName}? This will mark them as verified and allow them to make investments.`,
        isDestructive: false
      });
    }
  };

  const initiateReject = () => {
    setIsOpen(false);
    setShowRejectModal(true);
  };

  const executeAction = async (action: 'block' | 'unblock' | 'delete' | 'approveKyc') => {
    setIsLoading(true);
    try {
      let res;
      if (action === 'block') res = await blockUser(userId);
      else if (action === 'unblock') res = await unblockUser(userId);
      else if (action === 'delete') res = await deleteUser(userId);
      else if (action === 'approveKyc') res = await approveKyc(userId);

      if (res?.error) {
        setAlertMessage({ isOpen: true, message: `Error: ${res.error}` });
      } else {
        setModalState({ ...modalState, isOpen: false });
      }
    } catch (err: any) {
      setAlertMessage({ isOpen: true, message: `An error occurred: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const res = await rejectKyc(userId, rejectReason || undefined);
      if (res?.error) {
        setAlertMessage({ isOpen: true, message: `Error: ${res.error}` });
      }
      setShowRejectModal(false);
      setRejectReason("");
    } catch (err: any) {
      setAlertMessage({ isOpen: true, message: `An error occurred: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const getConfirmText = () => {
    if (modalState.action === 'delete') return "Delete User";
    if (modalState.action === 'block') return "Block User";
    if (modalState.action === 'approveKyc') return "Approve KYC";
    return "Confirm";
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        disabled={isLoading}
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
                onClick={() => initiateAction('approveKyc')}
                className="w-full text-left px-4 py-2 text-label-sm font-label-sm text-[#005236] hover:bg-[#009668]/10 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Approve KYC
              </button>
            )}

            {kycStatus !== "REJECTED" && (
              <button 
                onClick={initiateReject}
                className="w-full text-left px-4 py-2 text-label-sm font-label-sm text-[#93000a] hover:bg-[#ba1a1a]/10 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                {kycStatus === "APPROVED" ? "Revoke KYC" : "Reject KYC"}
              </button>
            )}

            <div className="h-px bg-outline-variant my-1"></div>

            {/* Block/Unblock */}
            {isBlocked ? (
              <button 
                onClick={() => initiateAction('unblock')}
                className="w-full text-left px-4 py-2 text-label-sm font-label-sm text-primary hover:bg-surface-container-low transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">lock_open</span>
                Unblock User
              </button>
            ) : (
              <button 
                onClick={() => initiateAction('block')}
                className="w-full text-left px-4 py-2 text-label-sm font-label-sm text-error hover:bg-error-container hover:text-on-error-container transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">block</span>
                Block User
              </button>
            )}
            
            <div className="h-px bg-outline-variant my-1"></div>
            
            <button 
              onClick={() => initiateAction('delete')}
              className="w-full text-left px-4 py-2 text-label-sm font-label-sm text-error hover:bg-error-container hover:text-on-error-container transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">delete_forever</span>
              Delete User
            </button>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        confirmText={getConfirmText()}
        isDestructive={modalState.isDestructive}
        isLoading={isLoading}
        onCancel={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={() => {
          if (modalState.action) executeAction(modalState.action);
        }}
      />

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
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
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
      <ConfirmModal
        isOpen={alertMessage.isOpen}
        title="Action Failed"
        message={alertMessage.message}
        confirmText="OK"
        cancelText=""
        onCancel={() => setAlertMessage({ isOpen: false, message: "" })}
        onConfirm={() => setAlertMessage({ isOpen: false, message: "" })}
      />
    </div>
  );
}

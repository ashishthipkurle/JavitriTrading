"use client";

import { useState } from "react";
import { approveKyc, rejectKyc } from "./actions";
import ConfirmModal from "@/components/ConfirmModal";

export default function KycStatusBadge({
  userId,
  kycStatus,
  userName,
}: {
  userId: string;
  kycStatus: string;
  userName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [alertMessage, setAlertMessage] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: "",
  });

  let statusColor = "bg-secondary-container/20 text-on-secondary-container";
  let statusIcon = "pending";
  let statusText = "Pending KYC";

  if (kycStatus === "APPROVED") {
    statusColor = "bg-[#009668]/10 text-[#005236]";
    statusIcon = "check_circle";
    statusText = "Verified";
  } else if (kycStatus === "REJECTED") {
    statusColor = "bg-[#ba1a1a]/10 text-[#93000a]";
    statusIcon = "error";
    statusText = "Rejected";
  }

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const res = await approveKyc(userId);
      if (res?.error) {
        setAlertMessage({ isOpen: true, message: `Error: ${res.error}` });
      }
      setShowApproveModal(false);
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center px-2 py-1 rounded-full text-label-sm font-label-sm gap-1 cursor-pointer hover:opacity-80 transition-opacity ${statusColor}`}
        title="Click to manage KYC status"
      >
        <span className="material-symbols-outlined text-[14px]">{statusIcon}</span>
        {statusText}
        <span className="material-symbols-outlined text-[12px] ml-0.5">expand_more</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full mt-1 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden py-1">
            {kycStatus !== "APPROVED" && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowApproveModal(true);
                }}
                className="w-full text-left px-4 py-2.5 text-label-sm font-label-sm text-[#005236] hover:bg-[#009668]/10 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Approve KYC
              </button>
            )}

            {kycStatus !== "REJECTED" && (
              <>
                {kycStatus !== "APPROVED" && (
                  <div className="h-px bg-outline-variant my-0.5" />
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowRejectModal(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-label-sm font-label-sm text-error hover:bg-error-container hover:text-on-error-container transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                  Reject KYC
                </button>
              </>
            )}

            {kycStatus === "APPROVED" && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowRejectModal(true);
                }}
                className="w-full text-left px-4 py-2.5 text-label-sm font-label-sm text-error hover:bg-error-container hover:text-on-error-container transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                Revoke Approval
              </button>
            )}

            {kycStatus === "REJECTED" && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowApproveModal(true);
                }}
                className="w-full text-left px-4 py-2.5 text-label-sm font-label-sm text-[#005236] hover:bg-[#009668]/10 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Approve KYC
              </button>
            )}
          </div>
        </>
      )}

      {/* Approve Confirmation Modal */}
      <ConfirmModal
        isOpen={showApproveModal}
        title="Approve KYC"
        message={`Are you sure you want to approve the KYC for ${userName}? This will mark them as verified and allow them to make investments.`}
        confirmText="Approve KYC"
        isDestructive={false}
        isLoading={isLoading}
        onCancel={() => setShowApproveModal(false)}
        onConfirm={handleApprove}
      />

      {/* Reject Modal with reason */}
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

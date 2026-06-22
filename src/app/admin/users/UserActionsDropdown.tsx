"use client";

import { useState } from "react";
import { blockUser, unblockUser, deleteUser } from "./actions";
import ConfirmModal from "@/components/ConfirmModal";

export default function UserActionsDropdown({ 
  userId, 
  isBlocked, 
  userName 
}: { 
  userId: string; 
  isBlocked: boolean;
  userName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: 'block' | 'unblock' | 'delete' | null;
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

  const [alertMessage, setAlertMessage] = useState<{isOpen: boolean, message: string}>({ isOpen: false, message: "" });

  const initiateAction = (action: 'block' | 'unblock' | 'delete') => {
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
      executeAction('unblock'); // Unblock doesn't need confirmation usually, but we could add one.
    }
  };

  const executeAction = async (action: 'block' | 'unblock' | 'delete') => {
    setIsLoading(true);
    try {
      let res;
      if (action === 'block') res = await blockUser(userId);
      else if (action === 'unblock') res = await unblockUser(userId);
      else if (action === 'delete') res = await deleteUser(userId);

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
          <div className="absolute right-0 top-full mt-1 w-40 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden py-1">
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
        confirmText={modalState.action === 'delete' ? "Delete User" : "Block User"}
        isDestructive={modalState.isDestructive}
        isLoading={isLoading}
        onCancel={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={() => {
          if (modalState.action) executeAction(modalState.action);
        }}
      />

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

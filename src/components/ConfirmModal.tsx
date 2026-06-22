"use client";

import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
  isLoading = false
}: ConfirmModalProps) {
  
  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onCancel : undefined}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <h2 className="text-headline-sm font-headline-sm text-primary mb-3">{title}</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">
            {message}
          </p>
        </div>
        
        <div className="bg-surface-container-low px-6 py-4 flex items-center justify-end gap-3 border-t border-outline-variant">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-label-md font-label-md text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-label-md font-label-md font-bold transition-colors disabled:opacity-50 flex items-center gap-2 ${
              isDestructive 
                ? 'bg-error text-on-error hover:opacity-90' 
                : 'bg-primary text-on-primary hover:opacity-90'
            }`}
          >
            {isLoading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

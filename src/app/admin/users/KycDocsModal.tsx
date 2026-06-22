'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface KycDocsModalProps {
  panDocUrl?: string | null;
  aadhaarDocUrl?: string | null;
  userName: string;
}

export default function KycDocsModal({ panDocUrl, aadhaarDocUrl, userName }: KycDocsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If both are missing, disable the button
  const hasDocs = !!panDocUrl || !!aadhaarDocUrl;

  if (!hasDocs) {
    return (
      <button 
        disabled 
        className="inline-flex items-center justify-center px-4 py-2 border border-outline-variant text-on-surface-variant rounded-lg text-label-sm font-label-sm disabled:opacity-50"
      >
        No Docs
      </button>
    );
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center px-4 py-2 border border-primary text-primary hover:bg-primary/10 rounded-lg text-label-sm font-label-sm transition-colors"
      >
        View Docs
      </button>

      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="bg-surface rounded-xl w-full max-w-2xl shadow-lg border border-outline-variant flex flex-col max-h-[90vh] overflow-hidden relative z-50" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between shrink-0">
              <h2 className="text-headline-sm font-headline-sm text-primary">KYC Documents - {userName}</h2>
              <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex-1 min-h-0 p-4 overflow-y-auto flex flex-col gap-4 bg-surface-container-lowest">
              {panDocUrl && (
                <div className="border border-outline-variant rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-label-md font-label-md text-primary">PAN Card</h3>
                    <a 
                      href={panDocUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary-container flex items-center gap-1 text-label-sm font-label-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span> Open Full
                    </a>
                  </div>
                  <div className="relative w-full rounded bg-surface-container-low border border-outline-variant overflow-hidden flex items-center justify-center bg-black/5">
                    {/* Using standard img tag as we don't know the dimensions */}
                    <img 
                      src={panDocUrl} 
                      alt="PAN Card Document" 
                      className="max-w-full max-h-[400px] object-contain"
                    />
                  </div>
                </div>
              )}

              {aadhaarDocUrl && (
                <div className="border border-outline-variant rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-label-md font-label-md text-primary">Aadhaar Card</h3>
                    <a 
                      href={aadhaarDocUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary-container flex items-center gap-1 text-label-sm font-label-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span> Open Full
                    </a>
                  </div>
                  <div className="relative w-full rounded bg-surface-container-low border border-outline-variant overflow-hidden flex items-center justify-center bg-black/5">
                    <img 
                      src={aadhaarDocUrl} 
                      alt="Aadhaar Card Document" 
                      className="max-w-full max-h-[400px] object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

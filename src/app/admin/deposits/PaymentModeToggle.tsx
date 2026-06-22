'use client';

import { useState } from 'react';

export default function PaymentModeToggle({ initialMode, initialQrUrl }: { initialMode: string, initialQrUrl: string }) {
  const [mode, setMode] = useState<'MANUAL' | 'RAZORPAY'>(initialMode as any);
  const [qrUrl, setQrUrl] = useState(initialQrUrl);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const toggleMode = async (newMode: 'MANUAL' | 'RAZORPAY') => {
    setIsSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/v1/admin/payment-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: newMode })
      });
      if (!res.ok) throw new Error('Failed to update mode');
      setMode(newMode);
      setMessage('Mode updated to ' + newMode);
    } catch (err: any) {
      setMessage('Error updating mode');
    }
    setIsSaving(false);
  };

  const uploadFile = async (file: File) => {
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("folder", "settings");

    const res = await fetch("/api/v1/upload", {
      method: "POST",
      body: uploadData,
    });

    if (!res.ok) throw new Error("File upload failed");
    const data = await res.json();
    return data.url;
  };

  const saveQrUrl = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      let finalQrUrl = qrUrl;
      if (qrFile) {
        finalQrUrl = await uploadFile(qrFile);
        setQrUrl(finalQrUrl);
      }

      const res = await fetch('/api/v1/admin/payment-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrUrl: finalQrUrl })
      });
      if (!res.ok) throw new Error('Failed to save QR URL');
      setMessage('QR Code saved successfully');
      setQrFile(null);
    } catch (err: any) {
      setMessage('Error saving QR URL');
    }
    setIsSaving(false);
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl flex flex-col gap-4 shadow-sm mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-label-lg font-label-lg text-primary font-bold">Payment Mode Switch</h3>
          <p className="text-body-sm text-on-surface-variant">Toggle between manual QR code verification and Razorpay checkout.</p>
        </div>
        
        <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant">
          <button
            onClick={() => toggleMode('MANUAL')}
            disabled={isSaving}
            className={`px-4 py-2 rounded-md text-label-sm font-label-sm font-bold transition-all ${mode === 'MANUAL' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            Manual (QR)
          </button>
          <button
            onClick={() => toggleMode('RAZORPAY')}
            disabled={isSaving}
            className={`px-4 py-2 rounded-md text-label-sm font-label-sm font-bold transition-all ${mode === 'RAZORPAY' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            Razorpay
          </button>
        </div>
      </div>

      {mode === 'MANUAL' && (
        <div className="flex flex-col gap-4 border-t border-outline-variant pt-4">
          <div className="flex items-end gap-4">
            <div className="flex flex-col gap-2 flex-grow max-w-md">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Upload Company UPI QR Code Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setQrFile(e.target.files?.[0] || null)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <button 
              onClick={saveQrUrl} 
              disabled={isSaving || (!qrFile && !qrUrl)}
              className="bg-secondary text-on-secondary px-4 py-2 rounded-lg font-label-sm font-bold hover:brightness-90 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Upload & Save QR'}
            </button>
          </div>
          
          {qrUrl && !qrFile && (
            <div className="flex flex-col gap-2">
              <p className="text-label-sm text-on-surface-variant">Current QR Code:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="Current QR" className="w-32 h-32 object-contain border border-outline-variant rounded bg-white" />
            </div>
          )}
        </div>
      )}
      
      {message && <p className="text-label-sm text-primary">{message}</p>}
    </div>
  );
}

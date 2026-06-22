"use client";

import { useTransition, useState } from "react";
import { processDailyPayouts } from "@/app/actions/payouts";
import ConfirmModal from "@/components/ConfirmModal";

export default function RunPayoutsButton() {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ title: string; message: string; isError?: boolean } | null>(null);

  const handleRun = () => {
    setShowConfirm(false);
    startTransition(async () => {
      const result = await processDailyPayouts();
      if (result.success) {
        setAlertInfo({ title: "Success", message: `Successfully processed ${result.processedCount} payouts.` });
      } else {
        setAlertInfo({ title: "Error", message: `Error: ${result.message}`, isError: true });
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md font-bold flex items-center gap-2 hover:brightness-90 transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[18px]">
          {isPending ? "sync" : "play_circle"}
        </span>
        {isPending ? "Processing..." : "Run Daily Payouts"}
      </button>

      <ConfirmModal
        isOpen={showConfirm}
        title="Run Daily Payouts"
        message="Are you sure you want to run the daily payouts? This will credit wallets for all active investments and generate commissions for employees."
        confirmText="Yes, Run Payouts"
        cancelText="Cancel"
        onConfirm={handleRun}
        onCancel={() => setShowConfirm(false)}
        isLoading={isPending}
      />

      {alertInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setAlertInfo(null)}></div>
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={`material-symbols-outlined text-[24px] ${alertInfo.isError ? "text-error" : "text-[#009668]"}`}>
                  {alertInfo.isError ? "error" : "check_circle"}
                </span>
                <h2 className="text-headline-sm font-headline-sm text-primary">{alertInfo.title}</h2>
              </div>
              <p className="text-body-md font-body-md text-on-surface-variant">
                {alertInfo.message}
              </p>
            </div>
            <div className="bg-surface-container-low px-6 py-4 flex items-center justify-end border-t border-outline-variant">
              <button
                type="button"
                onClick={() => setAlertInfo(null)}
                className="px-4 py-2 rounded-lg text-label-md font-label-md bg-primary text-on-primary font-bold hover:opacity-90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

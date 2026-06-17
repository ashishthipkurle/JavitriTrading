"use client";

import { useTransition } from "react";
import { stopInvestment } from "@/app/actions/payouts";

export default function StopFDButton({ investmentId, isActive }: { investmentId: string, isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  if (!isActive) return null;

  const handleStop = () => {
    if (!confirm("Are you sure you want to stop this Fixed Deposit? The principal amount will be refunded to your wallet.")) return;

    startTransition(async () => {
      const result = await stopInvestment(investmentId);
      if (result.success) {
        alert("Investment successfully stopped. Funds have been returned to your wallet.");
      } else {
        alert(`Failed to stop investment: ${result.message}`);
      }
    });
  };

  return (
    <button 
      onClick={handleStop}
      disabled={isPending}
      className="flex-1 py-2 text-error border border-error/50 rounded-lg text-label-sm font-label-sm font-bold hover:bg-error/5 transition-colors disabled:opacity-50"
    >
      {isPending ? "Stopping..." : "Stop FD"}
    </button>
  );
}

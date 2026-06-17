"use client";

import { useTransition } from "react";
import { processDailyPayouts } from "@/app/actions/payouts";

export default function RunPayoutsButton() {
  const [isPending, startTransition] = useTransition();

  const handleRun = () => {
    startTransition(async () => {
      const result = await processDailyPayouts();
      if (result.success) {
        alert(`Successfully processed ${result.processedCount} payouts.`);
      } else {
        alert(`Error: ${result.message}`);
      }
    });
  };

  return (
    <button
      onClick={handleRun}
      disabled={isPending}
      className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md font-bold flex items-center gap-2 hover:brightness-90 transition-colors disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[18px]">
        {isPending ? "sync" : "play_circle"}
      </span>
      {isPending ? "Processing..." : "Run Daily Payouts"}
    </button>
  );
}

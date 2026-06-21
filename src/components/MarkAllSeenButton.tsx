"use client";

import { useState } from "react";
import { markAllAsRead } from "@/app/actions/notifications";
import { useRouter } from "next/navigation";

export default function MarkAllSeenButton() {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleMarkAllSeen = async () => {
    setIsProcessing(true);
    await markAllAsRead();
    setIsProcessing(false);
    router.refresh();
  };

  return (
    <button 
      onClick={handleMarkAllSeen}
      disabled={isProcessing}
      className="text-label-sm font-label-sm text-primary hover:underline flex items-center gap-1 transition-colors disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[18px]">done_all</span>
      {isProcessing ? "Processing..." : "Mark all as seen"}
    </button>
  );
}

"use client";

import { useState, useTransition } from "react";
import { makeEmployee, demoteEmployee } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

export function UpgradeUserForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const result = await makeEmployee(email);
      setFeedback(result);
      if (result.success) {
        setEmail("");
        router.refresh();
      }
    });
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-[0px_4px_12px_rgba(10,22,40,0.04)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-on-secondary-container">person_add</span>
        </div>
        <div>
          <h3 className="text-headline-sm font-headline-sm text-on-surface">Upgrade User to Employee</h3>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Enter the email address of a registered user to promote them to an employee role.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
            disabled={isPending}
            className="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={isPending || !email.trim()}
          className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md font-label-md font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 whitespace-nowrap shadow-[0_4px_12px_rgba(16,28,46,0.12)]"
        >
          {isPending ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              Upgrading...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">upgrade</span>
              Upgrade to Employee
            </>
          )}
        </button>
      </form>

      {feedback && (
        <div
          className={`mt-4 p-3 rounded-lg text-label-md font-label-md flex items-center gap-2 ${
            feedback.success
              ? "bg-[#009668]/10 text-[#005236] border border-[#009668]/20"
              : "bg-error-container text-on-error-container border border-error/20"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {feedback.success ? "check_circle" : "error"}
          </span>
          {feedback.message}
        </div>
      )}
    </div>
  );
}

export function DemoteButton({ userId, userName }: { userId: string; userName: string }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDemote = () => {
    startTransition(async () => {
      await demoteEmployee(userId);
      setShowConfirm(false);
      router.refresh();
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-label-sm font-label-sm text-on-surface-variant">Remove {userName}?</span>
        <button
          onClick={handleDemote}
          disabled={isPending}
          className="px-3 py-1 bg-error text-on-error rounded text-label-sm font-label-sm hover:opacity-90 transition-all disabled:opacity-50"
        >
          {isPending ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1 border border-outline-variant text-on-surface-variant rounded text-label-sm font-label-sm hover:bg-surface-container-low transition-all"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="inline-flex items-center gap-1 px-3 py-1.5 border border-error/30 text-error rounded-lg text-label-sm font-label-sm hover:bg-error-container transition-colors"
      title="Demote to Client"
    >
      <span className="material-symbols-outlined text-[16px]">person_remove</span>
      Demote
    </button>
  );
}

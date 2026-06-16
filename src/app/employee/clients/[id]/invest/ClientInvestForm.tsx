"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientFDByEmployee } from "@/app/actions/employee";
import { formatCurrency } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  amount: number;
  dailyReturnAmount: number;
  tagline: string;
}

export default function ClientInvestForm({ 
  clientId, 
  plans,
  clientWallet
}: { 
  clientId: string; 
  plans: Plan[];
  clientWallet: number;
}) {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [tenureDays, setTenureDays] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId) {
      setError("Please select a plan.");
      return;
    }
    
    if (selectedPlan && clientWallet < selectedPlan.amount) {
      setError(`Client wallet balance (${formatCurrency(clientWallet)}) is insufficient for this plan (${formatCurrency(selectedPlan.amount)}).`);
      return;
    }

    setIsSubmitting(true);
    setError("");

    const result = await createClientFDByEmployee({
      clientId,
      planId: selectedPlanId,
      tenureDays
    });

    if (result.success) {
      router.push('/employee/clients');
      router.refresh();
    } else {
      setError(result.message || "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-unit-md mt-unit-md">
      {error && (
        <div className="bg-error-container text-on-error-container p-unit-md rounded-lg font-label-md">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-unit-sm">
        <label className="text-label-md font-label-md text-on-surface font-bold">Select FD Plan</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-unit-md">
          {plans.map(plan => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`border rounded-xl p-unit-md cursor-pointer transition-all ${
                selectedPlanId === plan.id 
                  ? 'border-primary bg-primary-container/10 ring-2 ring-primary/20' 
                  : 'border-outline-variant hover:border-primary/50 bg-surface-container-lowest'
              }`}
            >
              <h4 className="text-headline-sm font-headline-sm text-primary font-bold">{plan.name}</h4>
              <p className="text-label-sm font-label-sm text-on-surface-variant mb-4">{plan.tagline}</p>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">Investment</p>
                  <p className="text-headline-md font-headline-md font-bold text-on-surface">{formatCurrency(plan.amount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-label-sm font-label-sm text-on-surface-variant">Daily Return</p>
                  <p className="text-label-lg font-label-lg font-bold text-secondary">{formatCurrency(plan.dailyReturnAmount)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-unit-sm mt-unit-sm max-w-sm">
        <label htmlFor="tenureDays" className="text-label-md font-label-md text-on-surface font-bold">
          Tenure (Days)
        </label>
        <input
          type="number"
          id="tenureDays"
          min="1"
          max="3650"
          value={tenureDays}
          onChange={(e) => setTenureDays(parseInt(e.target.value) || 0)}
          className="bg-surface border border-outline-variant rounded-lg px-unit-md py-2 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />
        <p className="text-body-sm font-body-sm text-on-surface-variant">How many days will this FD run?</p>
      </div>

      <div className="mt-unit-lg flex items-center gap-unit-md pt-unit-md border-t border-outline-variant">
        <button
          type="submit"
          disabled={isSubmitting || !selectedPlanId}
          className="bg-primary text-on-primary px-8 py-3 rounded-lg text-label-md font-label-md font-bold hover:brightness-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Confirm & Create FD"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-on-surface-variant px-4 py-3 rounded-lg text-label-md font-label-md hover:bg-surface-container-low transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

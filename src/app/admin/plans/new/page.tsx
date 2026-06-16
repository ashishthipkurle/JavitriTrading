"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createFDPlan } from "@/app/actions/plans";
import Link from "next/link";

export default function CreatePlanForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tagline: "",
    amount: 5000,
    dailyReturnAmount: 200,
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createFDPlan(formData);
      if (result.success) {
        router.push("/admin/plans");
      } else {
        setError(result.message || "Something went wrong.");
      }
    });
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-unit-lg">
        <Link href="/admin/plans" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-headline-lg font-headline-lg text-primary">Create New FD Plan</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Configure a new investment plan for your clients.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg shadow-sm flex flex-col gap-unit-md">
        {error && (
          <div className="p-4 bg-error-container text-on-error-container rounded-lg text-body-sm font-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            {error}
          </div>
        )}

        {/* Plan Name */}
        <div className="flex flex-col gap-2">
          <label className="text-label-md font-label-md text-primary">Plan Name</label>
          <input 
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
            placeholder="e.g. ₹5k Plan" 
            type="text" 
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-label-md font-label-md text-primary">Description</label>
          <textarea 
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors min-h-[100px]" 
            placeholder="Briefly describe the benefits of this plan..." 
          />
        </div>

        {/* Tagline */}
        <div className="flex flex-col gap-2">
          <label className="text-label-md font-label-md text-primary">Tagline</label>
          <input 
            required
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
            placeholder="e.g. Referral Bonus Available, Beginner Friendly Plan" 
            type="text" 
          />
          <p className="text-label-sm font-label-sm text-on-surface-variant">Short tagline that appears below the plan price card.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
          {/* Investment Amount */}
          <div className="flex flex-col gap-2">
            <label className="text-label-md font-label-md text-primary">Investment Amount (₹)</label>
            <input 
              required
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min={1000}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
              type="number" 
            />
            <p className="text-label-sm font-label-sm text-on-surface-variant">The fixed price for this plan (e.g. 5000, 10000, 50000).</p>
          </div>

          {/* Expected Daily Return */}
          <div className="flex flex-col gap-2">
            <label className="text-label-md font-label-md text-primary">Expected Daily Return (₹)</label>
            <input 
              required
              name="dailyReturnAmount"
              value={formData.dailyReturnAmount}
              onChange={handleChange}
              min={1}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
              type="number" 
            />
            <p className="text-label-sm font-label-sm text-on-surface-variant">The daily payout in rupees (e.g. ₹200+ for ₹5k Plan).</p>
          </div>
        </div>

        {/* Info about tenure */}
        <div className="flex items-start gap-3 p-4 bg-surface-container border border-outline-variant rounded-lg">
          <span className="material-symbols-outlined text-[20px] text-primary mt-0.5">info</span>
          <div>
            <p className="text-label-md font-label-md text-primary">Tenure is selected by Clients & Employees</p>
            <p className="text-body-sm font-body-sm text-on-surface-variant">You don&apos;t need to set the tenure here. Clients and employees will choose their preferred tenure when investing in this plan.</p>
          </div>
        </div>

        {/* Is Active Status */}
        <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
          <div>
            <p className="text-label-md font-label-md text-primary font-bold">Publish Immediately</p>
            <p className="text-body-sm font-body-sm text-on-surface-variant">If active, users can immediately see and invest in this plan.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Preview Card */}
        <div className="border-t border-outline-variant pt-unit-md">
          <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider mb-3">Preview</p>
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-unit-md max-w-xs">
            <h3 className="text-headline-md font-headline-md text-primary font-bold">
              {formData.name || "₹5k Plan"}
            </h3>
            <p className="text-body-md font-body-md text-on-surface-variant mt-1">
              Expected Daily Return: <span className="font-bold text-primary">₹{formData.dailyReturnAmount.toLocaleString('en-IN')}+</span>
            </p>
            <p className="text-label-sm font-label-sm text-on-surface-variant mt-2">
              {formData.tagline || "Tagline will appear here"}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-outline-variant">
          <Link href="/admin/plans" className="px-6 py-3 border border-outline-variant text-on-surface-variant rounded-lg text-label-md font-label-md hover:bg-surface-container-low transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isPending}
            className="px-6 py-3 bg-primary text-on-primary rounded-lg text-label-md font-label-md font-bold hover:brightness-90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isPending && <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>}
            {isPending ? "Creating..." : "Create Plan"}
          </button>
        </div>
      </form>
    </div>
  );
}

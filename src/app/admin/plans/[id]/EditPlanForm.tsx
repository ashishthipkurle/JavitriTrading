"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateFDPlan, deleteFDPlan } from "@/app/actions/plans";
import Link from "next/link";

interface EditPlanFormProps {
  plan: {
    id: string;
    name: string;
    description: string;
    tagline: string;
    amount: number;
    dailyReturnAmount: number;
    isActive: boolean;
  };
}

export default function EditPlanForm({ plan }: EditPlanFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: plan.name,
    description: plan.description,
    tagline: plan.tagline,
    amount: plan.amount,
    dailyReturnAmount: plan.dailyReturnAmount,
    isActive: plan.isActive,
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
      const result = await updateFDPlan(plan.id, formData);
      if (result.success) {
        router.push("/admin/plans");
      } else {
        setError(result.message || "Something went wrong.");
      }
    });
  };

  const handleDelete = () => {
    setError(null);
    setIsDeleting(true);
    startTransition(async () => {
      const result = await deleteFDPlan(plan.id);
      if (result.success) {
        router.push("/admin/plans");
      } else {
        setError(result.message || "Something went wrong.");
        setIsDeleting(false);
        setShowDeleteConfirm(false);
      }
    });
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-unit-lg">
        <Link href="/admin/plans" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div className="flex-1">
          <h1 className="text-headline-lg font-headline-lg text-primary">Edit Plan: {plan.name}</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Update the details for this investment plan.</p>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-4 py-2 border border-error text-error rounded-lg text-label-md font-label-md hover:bg-error-container transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
          Delete
        </button>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="mb-unit-md p-4 bg-error-container border border-error rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-on-error-container">warning</span>
            <p className="text-body-sm font-body-sm text-on-error-container">Are you sure you want to permanently delete this plan?</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-1 text-label-sm font-label-sm border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container-low transition-colors">
              Cancel
            </button>
            <button onClick={handleDelete} disabled={isDeleting} className="px-3 py-1 text-label-sm font-label-sm bg-error text-on-error rounded hover:brightness-90 transition-colors disabled:opacity-50">
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      )}

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
            required name="name" value={formData.name} onChange={handleChange}
            className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
            type="text" 
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-label-md font-label-md text-primary">Description</label>
          <textarea 
            required name="description" value={formData.description} onChange={handleChange}
            className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors min-h-[100px]" 
          />
        </div>

        {/* Tagline */}
        <div className="flex flex-col gap-2">
          <label className="text-label-md font-label-md text-primary">Tagline</label>
          <input 
            required name="tagline" value={formData.tagline} onChange={handleChange}
            className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
            type="text" 
          />
          <p className="text-label-sm font-label-sm text-on-surface-variant">Short tagline below the plan price card.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
          {/* Investment Amount */}
          <div className="flex flex-col gap-2">
            <label className="text-label-md font-label-md text-primary">Investment Amount (₹)</label>
            <input 
              required name="amount" value={formData.amount} onChange={handleChange} min={1000}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
              type="number" 
            />
          </div>

          {/* Expected Daily Return */}
          <div className="flex flex-col gap-2">
            <label className="text-label-md font-label-md text-primary">Expected Daily Return (₹)</label>
            <input 
              required name="dailyReturnAmount" value={formData.dailyReturnAmount} onChange={handleChange} min={1}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
              type="number" 
            />
          </div>
        </div>

        {/* Is Active Status */}
        <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
          <div>
            <p className="text-label-md font-label-md text-primary font-bold">Active / Published</p>
            <p className="text-body-sm font-body-sm text-on-surface-variant">If active, users can see and invest in this plan.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
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
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

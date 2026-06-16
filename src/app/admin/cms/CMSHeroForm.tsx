"use client";

import { useState, useTransition } from "react";
import { updateCMSContent } from "@/app/actions/cms";
import { CMSType } from "@prisma/client";

interface CMSHeroFormProps {
  initialData: Record<string, string>;
}

export default function CMSHeroForm({ initialData }: CMSHeroFormProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const [formData, setFormData] = useState({
    headline: initialData.headline || "Secure Your Wealth, Intelligently.",
    subheadline: initialData.subheadline || "Experience premium financial advisory with our high-yield Fixed Deposit plans and bespoke portfolio management tailored for high-net-worth individuals.",
    primaryCtaLabel: initialData.primaryCtaLabel || "Explore FD Plans",
    primaryCtaLink: initialData.primaryCtaLink || "/investments/fixed-deposits",
    secondaryCtaLabel: initialData.secondaryCtaLabel || "Talk to an Advisor",
    secondaryCtaLink: initialData.secondaryCtaLink || "/contact-advisory",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDiscard = () => {
    setFormData({
      headline: initialData.headline || "Secure Your Wealth, Intelligently.",
      subheadline: initialData.subheadline || "Experience premium financial advisory with our high-yield Fixed Deposit plans and bespoke portfolio management tailored for high-net-worth individuals.",
      primaryCtaLabel: initialData.primaryCtaLabel || "Explore FD Plans",
      primaryCtaLink: initialData.primaryCtaLink || "/investments/fixed-deposits",
      secondaryCtaLabel: initialData.secondaryCtaLabel || "Talk to an Advisor",
      secondaryCtaLink: initialData.secondaryCtaLink || "/contact-advisory",
    });
    setFeedback(null);
  };

  const handlePublish = () => {
    setFeedback(null);
    startTransition(async () => {
      const updates = [
        { key: "headline", value: formData.headline, type: CMSType.TEXT },
        { key: "subheadline", value: formData.subheadline, type: CMSType.TEXT },
        { key: "primaryCtaLabel", value: formData.primaryCtaLabel, type: CMSType.TEXT },
        { key: "primaryCtaLink", value: formData.primaryCtaLink, type: CMSType.LINK },
        { key: "secondaryCtaLabel", value: formData.secondaryCtaLabel, type: CMSType.TEXT },
        { key: "secondaryCtaLink", value: formData.secondaryCtaLink, type: CMSType.LINK },
      ];

      const result = await updateCMSContent("hero", updates);
      setFeedback(result);
    });
  };

  const isChanged = 
    formData.headline !== initialData.headline ||
    formData.subheadline !== initialData.subheadline ||
    formData.primaryCtaLabel !== initialData.primaryCtaLabel ||
    formData.primaryCtaLink !== initialData.primaryCtaLink ||
    formData.secondaryCtaLabel !== initialData.secondaryCtaLabel ||
    formData.secondaryCtaLink !== initialData.secondaryCtaLink;

  return (
    <>
      {/* Top Bar Actions (Portal or Absolute could be used, but keeping it inline for simplicity) */}
      <div className="flex justify-end gap-3 mb-4">
        {feedback && (
          <div className={`flex items-center px-3 py-1 rounded text-label-sm font-label-sm ${feedback.success ? 'text-[#005236] bg-[#009668]/10' : 'text-error bg-error-container'}`}>
            {feedback.message}
          </div>
        )}
        <button 
          onClick={handleDiscard}
          disabled={!isChanged || isPending}
          className="px-4 py-2 border border-outline-variant text-primary rounded-lg text-label-md font-label-md hover:bg-surface-container-low transition-colors disabled:opacity-50"
        >
          Discard Changes
        </button>
        <button 
          onClick={handlePublish}
          disabled={!isChanged || isPending}
          className="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md font-label-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          {isPending && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
          {isPending ? "Publishing..." : "Publish to Live"}
        </button>
      </div>

      <div className="flex flex-col gap-unit-md w-full">
        <div>
          <h2 className="text-headline-xl font-headline-xl text-primary font-bold">Edit Hero Section</h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-2">Update the main messaging and imagery for the public homepage.</p>
        </div>

        {/* Core Messaging Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg flex flex-col gap-unit-md shadow-sm">
          <h3 className="text-headline-sm font-headline-sm text-primary flex items-center gap-2">
            <span className="font-data-mono font-normal text-outline">Aa</span>
            Core Messaging
          </h3>
          
          <div className="flex flex-col gap-2">
            <label className="text-label-md font-label-md text-primary">Primary Headline</label>
            <input 
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
              type="text" 
            />
            <div className="text-right text-label-sm font-label-sm text-outline">{formData.headline.length} characters</div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label-md font-label-md text-primary">Sub-headline / Descriptor</label>
            <textarea 
              name="subheadline"
              value={formData.subheadline}
              onChange={handleChange}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[100px]" 
            />
          </div>
        </div>

        {/* Action Buttons Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg flex flex-col gap-unit-md shadow-sm">
          <h3 className="text-headline-sm font-headline-sm text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-outline">ads_click</span>
            Action Buttons
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
            <div className="flex flex-col gap-2">
              <label className="text-label-md font-label-md text-primary">Primary CTA Label</label>
              <input 
                name="primaryCtaLabel"
                value={formData.primaryCtaLabel}
                onChange={handleChange}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                type="text" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-label-md font-label-md text-primary">Secondary CTA Label</label>
              <input 
                name="secondaryCtaLabel"
                value={formData.secondaryCtaLabel}
                onChange={handleChange}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                type="text" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-label-md font-label-md text-primary">Primary CTA Link (URL)</label>
              <input 
                name="primaryCtaLink"
                value={formData.primaryCtaLink}
                onChange={handleChange}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-data-mono font-data-mono text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                type="text" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-label-md font-label-md text-primary">Secondary CTA Link (URL)</label>
              <input 
                name="secondaryCtaLink"
                value={formData.secondaryCtaLink}
                onChange={handleChange}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-data-mono font-data-mono text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                type="text" 
              />
            </div>
          </div>
        </div>

        {/* Background Media Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg flex flex-col gap-unit-md shadow-sm">
          <h3 className="text-headline-sm font-headline-sm text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-outline">image</span>
            Background Media
          </h3>
          
          <div className="w-full border-2 border-dashed border-outline-variant rounded-xl h-[200px] flex flex-col items-center justify-center bg-surface hover:bg-surface-container-low transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-unit-sm group-hover:bg-primary group-hover:text-on-primary transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">cloud_upload</span>
            </div>
            <p className="text-label-md font-label-md text-primary">Click to upload or drag and drop</p>
            <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">SVG, PNG, JPG or WEBP (max. 5MB)</p>
            <p className="text-body-sm font-body-sm text-error mt-2">(Coming in Phase 2)</p>
          </div>
        </div>

      </div>
    </>
  );
}

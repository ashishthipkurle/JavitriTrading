"use client";

import { useState } from "react";
import Link from "next/link";

export default function EmployeeDocumentsClient({ 
  user, 
  panDocUrl, 
  aadhaarDocUrl,
}: { 
  user: any;
  panDocUrl?: string | null;
  aadhaarDocUrl?: string | null;
}) {
  const hasPan = !!panDocUrl;
  const hasAadhaar = !!aadhaarDocUrl;
  const defaultTab = hasPan ? "pan" : hasAadhaar ? "aadhaar" : "pan";
  const [activeTab, setActiveTab] = useState<"pan" | "aadhaar">(defaultTab);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-primary">Employee Documents</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Viewing documents for {user.name || user.email}</p>
        </div>
        <Link 
          href="/admin/employees" 
          className="bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors px-4 py-2 rounded-lg text-label-md font-label-md flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Employees
        </Link>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-outline-variant overflow-x-auto">
          <button 
            onClick={() => setActiveTab("pan")}
            className={`px-6 py-4 text-label-md font-label-md whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === "pan" ? "border-b-2 border-primary text-primary" : "text-on-surface-variant hover:bg-surface-container-low"}`}
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            PAN Card
          </button>

          <button 
            onClick={() => setActiveTab("aadhaar")}
            className={`px-6 py-4 text-label-md font-label-md whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === "aadhaar" ? "border-b-2 border-primary text-primary" : "text-on-surface-variant hover:bg-surface-container-low"}`}
          >
            <span className="material-symbols-outlined text-[18px]">fingerprint</span>
            Aadhaar Card
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === "pan" && (
            <div>
              {panDocUrl ? (
                <div className="flex flex-col items-center">
                  <div className="flex justify-end w-full mb-4">
                    <a 
                      href={panDocUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary-container flex items-center gap-1 text-label-sm font-label-sm bg-primary/10 px-4 py-2 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span> Open Full
                    </a>
                  </div>
                  <div className="rounded bg-surface-container-low border border-outline-variant p-4 flex items-center justify-center max-w-4xl w-full">
                    <img 
                      src={panDocUrl} 
                      alt="PAN Card" 
                      className="max-w-full max-h-[70vh] object-contain rounded"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50 block">hide_image</span>
                  <p>No PAN Card uploaded</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "aadhaar" && (
            <div>
              {aadhaarDocUrl ? (
                <div className="flex flex-col items-center">
                  <div className="flex justify-end w-full mb-4">
                    <a 
                      href={aadhaarDocUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary-container flex items-center gap-1 text-label-sm font-label-sm bg-primary/10 px-4 py-2 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span> Open Full
                    </a>
                  </div>
                  <div className="rounded bg-surface-container-low border border-outline-variant p-4 flex items-center justify-center max-w-4xl w-full">
                    <img 
                      src={aadhaarDocUrl} 
                      alt="Aadhaar Card" 
                      className="max-w-full max-h-[70vh] object-contain rounded"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50 block">hide_image</span>
                  <p>No Aadhaar Card uploaded</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

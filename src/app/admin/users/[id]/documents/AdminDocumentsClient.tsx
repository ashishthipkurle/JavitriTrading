"use client";

import { useState } from "react";
import PrintableInvestmentForm from "@/components/PrintableInvestmentForm";
import ClientSidePrint from "@/app/employee/clients/[id]/investment-form/ClientSidePrint";
import Link from "next/link";

export default function AdminDocumentsClient({ 
  user, 
  fdPlans, 
  panDocUrl, 
  aadhaarDocUrl 
}: { 
  user: any;
  fdPlans: any[];
  panDocUrl?: string | null;
  aadhaarDocUrl?: string | null;
}) {
  const [activeTab, setActiveTab] = useState<"form" | "pan" | "aadhaar">("form");

  const formData = {
    fullName: user.name || "",
    dob: user.kyc?.dateOfBirth ? new Date(user.kyc.dateOfBirth).toLocaleDateString() : "",
    address: user.kyc?.address || "",
    city: user.kyc?.city || "",
    state: user.kyc?.state || "",
    pinCode: user.kyc?.pincode || "",
    email: user.email || "",
    phone: user.kyc?.phone || "",
    occupation: user.kyc?.occupation || "",
    altPhone: user.kyc?.altPhone || "",
    gender: user.kyc?.gender || "",
    panNumber: user.kyc?.panNumber || "", // Decrypted already in server component
    aadhaarNumber: user.kyc?.aadhaarNumber || "", // Decrypted already in server component
    bankHolderName: user.kyc?.bankHolderName || "",
    bankName: user.kyc?.bankName || "",
    accountType: user.kyc?.accountType || "",
    bankAccount: user.kyc?.bankAccount || "", // Decrypted already in server component
    ifsc: user.kyc?.ifsc || "",
    upiId: user.kyc?.upiId || "",
    nomineeName: user.kyc?.nomineeName || "",
    nomineeRelation: user.kyc?.nomineeRelation || "",
    nomineeDob: user.kyc?.nomineeDob ? new Date(user.kyc.nomineeDob).toLocaleDateString() : "",
    nomineePhone: user.kyc?.nomineePhone || "",
    referredBy: "", 
    referralCode: "",
    selectedPlanId: "",
    investmentAmount: ""
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-primary">User Documents</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Viewing documents for {user.name}</p>
        </div>
        <Link 
          href="/admin/users" 
          className="bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors px-4 py-2 rounded-lg text-label-md font-label-md flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Users
        </Link>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-outline-variant overflow-x-auto">
          <button 
            onClick={() => setActiveTab("form")}
            className={`px-6 py-4 text-label-md font-label-md whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === "form" ? "border-b-2 border-primary text-primary" : "text-on-surface-variant hover:bg-surface-container-low"}`}
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            Investment Form
          </button>
          
          {(panDocUrl || activeTab === 'pan') && (
            <button 
              onClick={() => setActiveTab("pan")}
              className={`px-6 py-4 text-label-md font-label-md whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === "pan" ? "border-b-2 border-primary text-primary" : "text-on-surface-variant hover:bg-surface-container-low"}`}
            >
              <span className="material-symbols-outlined text-[18px]">badge</span>
              PAN Card
            </button>
          )}

          {(aadhaarDocUrl || activeTab === 'aadhaar') && (
            <button 
              onClick={() => setActiveTab("aadhaar")}
              className={`px-6 py-4 text-label-md font-label-md whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === "aadhaar" ? "border-b-2 border-primary text-primary" : "text-on-surface-variant hover:bg-surface-container-low"}`}
            >
              <span className="material-symbols-outlined text-[18px]">fingerprint</span>
              Aadhaar Card
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === "form" && (
            <div>
              <div className="flex justify-end mb-6">
                <ClientSidePrint />
              </div>
              <div className="bg-white p-8 rounded-xl border border-outline-variant overflow-x-auto shadow-sm no-print">
                <p className="text-center text-on-surface-variant mb-8 text-label-md">Preview</p>
                <div style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
                  <div className="[&>#printable-form]:!block [&>#printable-form]:!relative [&>#printable-form]:!w-full [&>#printable-form]:!translate-x-0 [&>#printable-form]:!left-0">
                    <PrintableInvestmentForm formData={formData} plans={fdPlans} />
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">hide_image</span>
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
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">hide_image</span>
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

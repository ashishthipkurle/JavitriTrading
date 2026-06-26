"use client";

import { useState, useEffect } from "react";
import { createClientAccountByEmployee } from "@/app/actions/employee";
import PrintableInvestmentForm from "@/components/PrintableInvestmentForm";

export default function CreateClientForm({ plans = [] }: { plans?: any[] }) {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "",
    dateOfBirth: "", residentialAddress: "", city: "", state: "", pinCode: "",
    occupation: "", altPhone: "", gender: "Male",
    panNumber: "", aadhaarNumber: "",
    bankHolderName: "", bankName: "", accountType: "Savings",
    bankAccount: "", confirmBankAccount: "", ifsc: "", upiId: "",
    nomineeName: "", nomineeRelation: "", nomineeDob: "", nomineePhone: "",
    referredBy: "", referralCode: "",
    formNumber: "", branch: "",
    investmentPlanId: "", investmentAmount: "", modeOfPayment: "NEFT/RTGS",
    utrReference: "", paymentDate: ""
  });

  const [panFile, setPanFile] = useState<File | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpCode, setOtpCode] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdClientId, setCreatedClientId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showValidation, setShowValidation] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('employeeClientFormData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Do not load password
        parsed.password = "";
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    const toSave = { ...formData };
    toSave.password = ""; // Never save password
    localStorage.setItem('employeeClientFormData', JSON.stringify(toSave));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClearForm = () => {
    if (confirm("Are you sure you want to clear all form fields?")) {
      localStorage.removeItem('employeeClientFormData');
      setFormData({
        name: "", email: "", phone: "", password: "",
        dateOfBirth: "", residentialAddress: "", city: "", state: "", pinCode: "",
        occupation: "", altPhone: "", gender: "Male",
        panNumber: "", aadhaarNumber: "",
        bankHolderName: "", bankName: "", accountType: "Savings",
        bankAccount: "", confirmBankAccount: "", ifsc: "", upiId: "",
        nomineeName: "", nomineeRelation: "", nomineeDob: "", nomineePhone: "",
        referredBy: "", referralCode: "",
        formNumber: "", branch: "",
        investmentPlanId: "", investmentAmount: "", modeOfPayment: "NEFT/RTGS",
        utrReference: "", paymentDate: ""
      });
      setPanFile(null);
      setAadhaarFile(null);
      setTermsAgreed(false);
      setError("");
      setShowValidation(false);
    }
  };

  const uploadFile = async (file: File) => {
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("folder", "kyc_documents");

    const res = await fetch("/api/v1/upload", {
      method: "POST",
      body: uploadData,
    });

    if (!res.ok) throw new Error("File upload failed");
    const data = await res.json();
    return data.url;
  };

  const handleInvalid = (e: React.FormEvent<HTMLFormElement>) => {
    setShowValidation(true);
    setError("Please fill in all required fields correctly. Missing fields are highlighted in red.");
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);
    if (!termsAgreed) {
      setError("You must agree to the Terms & Conditions before submitting.");
      return;
    }
    if (formData.bankAccount !== formData.confirmBankAccount) {
      setError("Bank Account numbers do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setFieldErrors({});

    if (!panFile || !aadhaarFile) {
      setError("Please upload both PAN and Aadhaar documents");
      setIsSubmitting(false);
      return;
    }

    try {
      // Step 1: Send OTP to the client's email
      const res = await fetch("/api/v1/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setStep('otp');
      setSuccess("OTP sent to client's email. Please verify to continue.");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
    
    setIsSubmitting(false);
  };

  const handleVerifyOTPAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      setError("Please enter the OTP");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Verify OTP
      const verifyRes = await fetch("/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, token: otpCode }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(verifyData.error || "Invalid OTP");
      }

      // OTP verified, now upload files and create account
      let avatarUrl = null;
      if (avatarFile) {
        avatarUrl = await uploadFile(avatarFile);
      }
      const panDocUrl = await uploadFile(panFile!);
      const aadhaarDocUrl = await uploadFile(aadhaarFile!);

      const payload = { ...formData, panDocUrl, aadhaarDocUrl, avatarUrl };
      const result = await createClientAccountByEmployee(payload);

      if (result.success && result.clientId) {
        setSuccess("Client account created. You can now download the form.");
        setCreatedClientId(result.clientId);
        setShowValidation(false);
        localStorage.removeItem('employeeClientFormData'); // Clear saved data on success
      } else {
        const msg = result.message || "Something went wrong";
        setError(msg);
        setStep('form'); // Go back to form if creation fails
        if (msg.toLowerCase().includes("email or phone")) {
          setFieldErrors({ email: "already exists", phone: "already exists" });
        }
      }
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred.";
      setError(msg);
    }
    
    setIsSubmitting(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print:m-0 print:p-0">
      <style dangerouslySetInnerHTML={{__html: `
        .show-errors input:invalid, .show-errors select:invalid {
          border-color: #ba1a1a;
          background-color: #ba1a1a05;
        }
      `}} />

      {step === 'form' && !createdClientId && (
        <form onSubmit={handleSubmitForm} onInvalid={handleInvalid} className={`flex flex-col gap-6 mt-4 no-print ${showValidation ? 'show-errors' : ''}`} autoComplete="off">
          {error && <div className="bg-error-container text-on-error-container p-unit-md rounded-lg font-label-md">{error}</div>}
          
          <div className="flex justify-between items-center mb-2">
            <p className="text-body-sm text-on-surface-variant">Form data is automatically saved locally.</p>
            <button type="button" onClick={handleClearForm} className="text-error hover:bg-error/10 px-3 py-1 rounded text-label-sm transition-colors">
              Clear Form
            </button>
          </div>

          {/* Section 1: Application Info */}
          <div className="flex gap-4">
            <div className="flex-1"><label className="text-label-sm">Form No.</label><input type="text" name="formNumber" value={formData.formNumber} onChange={handleChange} className="w-full border p-2 rounded" /></div>
            <div className="flex-1"><label className="text-label-sm">Branch</label><input type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-full border p-2 rounded" /></div>
          </div>

          {/* Section 1: Personal Details */}
          <h4 className="text-label-lg font-bold border-b pb-1 mt-2 text-primary">1. Personal Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Full Name *" required value={formData.name} onChange={handleChange} className="border p-2 rounded" autoComplete="off" />
            <input type={formData.dateOfBirth ? "date" : "text"} onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} name="dateOfBirth" placeholder="Date of Birth *" required value={formData.dateOfBirth} onChange={handleChange} className="border p-2 rounded" />
            <input type="email" name="email" placeholder="Email *" required value={formData.email} onChange={handleChange} className={`border p-2 rounded ${fieldErrors.email ? 'border-[#ba1a1a] bg-[#ba1a1a05]' : ''}`} autoComplete="off" />
            <input type="tel" name="phone" placeholder="Phone Number (+91) *" required value={formData.phone} onChange={handleChange} className={`border p-2 rounded ${fieldErrors.phone ? 'border-[#ba1a1a] bg-[#ba1a1a05]' : ''}`} autoComplete="off" />
            <input type="tel" name="altPhone" placeholder="Alternate Phone Number" value={formData.altPhone} onChange={handleChange} className="border p-2 rounded" />
            <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 rounded">
              <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
            </select>
            <input type="text" name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} className="border p-2 rounded" />
            <input type="text" name="panNumber" placeholder="PAN Number *" required value={formData.panNumber} onChange={handleChange} className="border p-2 rounded" />
            <input type="text" name="aadhaarNumber" placeholder="Aadhaar Number *" required value={formData.aadhaarNumber} onChange={handleChange} className="border p-2 rounded" />
            
            <div className="flex flex-col col-span-1 sm:col-span-2">
              <label className="text-label-sm text-on-surface-variant">Profile Picture</label>
              <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} className="border p-2 rounded mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="text" name="residentialAddress" placeholder="Residential Address *" required value={formData.residentialAddress} onChange={handleChange} className="border p-2 rounded col-span-3" autoComplete="new-password" />
            <input type="text" name="city" placeholder="City *" required value={formData.city} onChange={handleChange} className="border p-2 rounded" />
            <input type="text" name="state" placeholder="State *" required value={formData.state} onChange={handleChange} className="border p-2 rounded" />
            <input type="text" name="pinCode" placeholder="PIN Code *" required value={formData.pinCode} onChange={handleChange} className="border p-2 rounded" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-label-sm block mb-1">PAN Card Image *</label>
              <input type="file" accept="image/*" required onChange={(e) => setPanFile(e.target.files?.[0] || null)} className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="text-label-sm block mb-1">Aadhaar Card Image *</label>
              <input type="file" accept="image/*" required onChange={(e) => setAadhaarFile(e.target.files?.[0] || null)} className="border p-2 rounded w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <input type="password" name="password" placeholder="Temporary Login Password *" required value={formData.password} onChange={handleChange} className="border p-2 rounded" autoComplete="new-password" />
          </div>

          {/* Section 2: Investment Plan */}
          <h4 className="text-label-lg font-bold border-b pb-1 mt-2 text-primary">2. Investment Plan (Optional for now)</h4>
          <p className="text-body-sm text-on-surface-variant">The client can activate an FD later, but you can select one now if they are ready to invest.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select name="investmentPlanId" value={formData.investmentPlanId} onChange={handleChange} className="border p-2 rounded">
              <option value="">-- Select FD Plan --</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (₹{p.amount})</option>
              ))}
            </select>
            <input type="number" name="investmentAmount" placeholder="Amount (₹)" value={formData.investmentAmount} onChange={handleChange} className="border p-2 rounded" />
            <select name="modeOfPayment" value={formData.modeOfPayment} onChange={handleChange} className="border p-2 rounded">
              <option value="NEFT/RTGS">NEFT/RTGS</option><option value="UPI">UPI</option><option value="Cheque">Cheque</option><option value="Cash">Cash</option>
            </select>
            <input type="text" name="utrReference" placeholder="UTR/Reference No" value={formData.utrReference} onChange={handleChange} className="border p-2 rounded" />
            <input type={formData.paymentDate ? "date" : "text"} onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} name="paymentDate" placeholder="Payment Date" value={formData.paymentDate} onChange={handleChange} className="border p-2 rounded" />
          </div>

          {/* Section 3: Bank Details */}
          <h4 className="text-label-lg font-bold border-b pb-1 mt-2 text-primary">3. Bank Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="bankHolderName" placeholder="Account Holder Name *" required value={formData.bankHolderName} onChange={handleChange} className="border p-2 rounded" />
            <input type="text" name="bankName" placeholder="Bank Name *" required value={formData.bankName} onChange={handleChange} className="border p-2 rounded" />
            <select name="accountType" value={formData.accountType} onChange={handleChange} className="border p-2 rounded">
              <option value="Savings">Savings</option><option value="Current">Current</option>
            </select>
            <input type="text" name="bankAccount" placeholder="Account Number *" required value={formData.bankAccount} onChange={handleChange} className="border p-2 rounded" />
            <input type="text" name="confirmBankAccount" placeholder="Re-enter Account Number *" required value={formData.confirmBankAccount} onChange={handleChange} className="border p-2 rounded" />
            <input type="text" name="ifsc" placeholder="IFSC Code *" required value={formData.ifsc} onChange={handleChange} className="border p-2 rounded" />
            <input type="text" name="upiId" placeholder="UPI ID" value={formData.upiId} onChange={handleChange} className="border p-2 rounded" />
          </div>

          {/* Section 4: Nominee */}
          <h4 className="text-label-lg font-bold border-b pb-1 mt-2 text-primary">4. Nominee Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="nomineeName" placeholder="Nominee Full Name *" required value={formData.nomineeName} onChange={handleChange} className="border p-2 rounded" />
            <input type="text" name="nomineeRelation" placeholder="Relationship *" required value={formData.nomineeRelation} onChange={handleChange} className="border p-2 rounded" />
            <input type={formData.nomineeDob ? "date" : "text"} onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} name="nomineeDob" placeholder="Nominee Date of Birth *" required value={formData.nomineeDob} onChange={handleChange} className="border p-2 rounded" />
            <input type="tel" name="nomineePhone" placeholder="Nominee Mobile Number *" required value={formData.nomineePhone} onChange={handleChange} className="border p-2 rounded" />
          </div>

          {/* Section 5: Referral */}
          <h4 className="text-label-lg font-bold border-b pb-1 mt-2 text-primary">5. Referral Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="referredBy" placeholder="Referred By (Name)" value={formData.referredBy} onChange={handleChange} className="border p-2 rounded" />
            <input type="text" name="referralCode" placeholder="Referral Code / ID" value={formData.referralCode} onChange={handleChange} className="border p-2 rounded" />
          </div>

          <div className="mt-4 p-4 bg-surface-container rounded-lg">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} className="mt-1" />
              <span className="text-label-md text-on-surface-variant">
                I agree to the Terms & Conditions and declare that all information provided is true and correct. I authorize Javitri Trading Service to verify my details.
              </span>
            </label>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white p-3 rounded font-bold hover:bg-black/80 transition disabled:opacity-50 mt-4 flex justify-center items-center gap-2">
            {isSubmitting && <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>}
            {isSubmitting ? "Sending OTP..." : "Continue"}
          </button>
        </form>
      )}

      {step === 'otp' && !createdClientId && (
        <form onSubmit={handleVerifyOTPAndSubmit} className="flex flex-col gap-6 mt-4 max-w-md mx-auto p-6 bg-surface border border-outline-variant rounded-xl no-print">
          <h3 className="text-headline-sm font-bold text-primary">Verify Client Email</h3>
          {success && <div className="bg-secondary-container/20 border border-secondary text-secondary p-unit-md rounded-lg text-label-sm">{success}</div>}
          {error && <div className="bg-error-container text-on-error-container p-unit-md rounded-lg font-label-md">{error}</div>}
          
          <p className="text-body-sm text-on-surface-variant">
            An OTP was sent to <strong>{formData.email}</strong>. Ask the client for the code to verify their email address.
          </p>

          <div className="flex flex-col gap-2">
            <label className="text-label-sm font-label-sm text-primary">6-Digit Verification Code</label>
            <input
              type="text"
              required
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="border p-3 rounded-lg text-center text-headline-md tracking-widest outline-none focus:border-primary font-data-mono"
            />
          </div>

          <div className="flex gap-4 mt-2">
            <button 
              type="button" 
              onClick={() => { setStep('form'); setError(''); setSuccess(''); }}
              className="flex-1 border border-outline text-on-surface py-3 rounded-lg font-bold hover:bg-surface-container-low transition"
            >
              Back to Form
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || otpCode.length !== 6} 
              className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-bold hover:brightness-90 transition disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isSubmitting && <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>}
              Verify & Create
            </button>
          </div>
        </form>
      )}

      {createdClientId && (
        <div className="mt-8 no-print p-6 bg-surface border border-outline-variant rounded-xl max-w-lg mx-auto text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-secondary-container/30 text-secondary-container rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px]">check_circle</span>
          </div>
          <h3 className="text-headline-sm font-bold text-primary">Account Created Successfully!</h3>
          <p className="text-body-md text-on-surface-variant">{success}</p>
          <div className="flex w-full gap-4 mt-4">
            <button type="button" onClick={handlePrint} className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-bold hover:brightness-90 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">print</span> Download Form
            </button>
            <a href="/employee/clients" className="flex-1 py-3 border border-outline-variant text-on-surface rounded-lg font-bold hover:bg-surface-container-low transition flex items-center justify-center">
              Back to Clients
            </a>
          </div>
        </div>
      )}

      {/* Hidden Printable Form matching the beautiful design */}
      {createdClientId && (
        <PrintableInvestmentForm formData={formData} plans={plans} />
      )}
    </div>
  );
}

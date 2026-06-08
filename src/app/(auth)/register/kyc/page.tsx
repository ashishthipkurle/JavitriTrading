import Link from 'next/link';

export default function KYCPage() {
  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary-fixed selection:text-primary">
      {/* Minimal Header for Transactional Flow */}
      <header className="w-full py-unit-lg px-margin-mobile md:px-margin-desktop flex justify-center md:justify-start items-center border-b border-surface-container-high">
        <Link href="/" className="text-headline-md font-headline-md text-primary tracking-tight decoration-transparent">
          ProWealth<span className="text-secondary-container">.</span>
        </Link>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col items-center pt-unit-xl pb-unit-xl px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
        <div className="w-full max-w-3xl flex flex-col gap-unit-xl">
          {/* Header Section */}
          <div className="flex flex-col gap-unit-sm">
            <div className="flex justify-between items-end mb-unit-xs">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">Step 3 of 3</span>
              <span className="text-label-sm font-label-sm text-primary">100%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary w-full rounded-full"></div>
            </div>
            
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary mt-unit-md">
              Regulatory KYC &amp; Banking
            </h1>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Upload your identity documents and provide bank details to activate your advisory account.
            </p>
          </div>

          <form action="/dashboard" className="flex flex-col gap-unit-xl">
            {/* Section 1: Document Uploads */}
            <section className="flex flex-col gap-unit-md">
              <h2 className="text-headline-sm font-headline-sm text-primary flex items-center gap-unit-sm">
                <span className="material-symbols-outlined text-[20px]">assignment_ind</span>
                Identity Verification
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {/* PAN Card Upload */}
                <div className="group relative flex flex-col items-center justify-center p-unit-lg border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-lowest hover:bg-surface-container-low hover:border-primary transition-all cursor-pointer h-[200px]">
                  <input accept=".pdf,.jpg,.jpeg,.png" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" type="file" required />
                  <span className="material-symbols-outlined text-[32px] text-outline group-hover:text-primary transition-colors mb-unit-sm">id_card</span>
                  <span className="text-label-md font-label-md text-primary">Upload PAN Card</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant mt-unit-xs text-center">Drag &amp; drop or click<br/>PDF, JPG, PNG up to 5MB</span>
                </div>
                
                {/* Aadhaar Upload */}
                <div className="group relative flex flex-col items-center justify-center p-unit-lg border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-lowest hover:bg-surface-container-low hover:border-primary transition-all cursor-pointer h-[200px]">
                  <input accept=".pdf,.jpg,.jpeg,.png" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" type="file" required />
                  <span className="material-symbols-outlined text-[32px] text-outline group-hover:text-primary transition-colors mb-unit-sm">badge</span>
                  <span className="text-label-md font-label-md text-primary">Upload Aadhaar</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant mt-unit-xs text-center">Drag &amp; drop or click<br/>PDF, JPG, PNG up to 5MB</span>
                </div>
              </div>
            </section>
            
            <hr className="border-t border-surface-container-high"/>
            
            {/* Section 2: Bank Details Form */}
            <section className="flex flex-col gap-unit-md">
              <h2 className="text-headline-sm font-headline-sm text-primary flex items-center gap-unit-sm">
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
                Primary Bank Account
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {/* Account Name */}
                <div className="flex flex-col gap-unit-xs md:col-span-2">
                  <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="account_name">Account Holder Name (As per PAN)</label>
                  <input className="h-11 px-unit-md rounded-xl border border-outline-variant bg-surface-container-lowest text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" id="account_name" name="accountName" placeholder="e.g. John Doe" type="text" required />
                </div>
                
                {/* Bank Name */}
                <div className="flex flex-col gap-unit-xs md:col-span-2">
                  <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="bank_name">Bank Name</label>
                  <select className="h-11 px-unit-md rounded-xl border border-outline-variant bg-surface-container-lowest text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none" id="bank_name" name="bankName" required defaultValue="">
                    <option disabled value="">Select your bank</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {/* Account Number */}
                <div className="flex flex-col gap-unit-xs">
                  <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="account_number">Account Number</label>
                  <input className="h-11 px-unit-md rounded-xl border border-outline-variant bg-surface-container-lowest text-data-mono font-data-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" id="account_number" name="accountNumber" placeholder="Enter account number" type="password" required />
                </div>
                
                {/* IFSC Code */}
                <div className="flex flex-col gap-unit-xs">
                  <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="ifsc_code">IFSC Code</label>
                  <input className="h-11 px-unit-md rounded-xl border border-outline-variant bg-surface-container-lowest text-data-mono font-data-mono uppercase focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" id="ifsc_code" name="ifscCode" placeholder="e.g. HDFC0001234" type="text" required />
                </div>
              </div>
            </section>
            
            {/* Actions */}
            <div className="pt-unit-md mt-unit-md flex flex-col sm:flex-row items-center gap-unit-md">
              <button className="w-full sm:w-auto h-14 px-unit-xl bg-primary text-on-primary rounded-xl text-label-md font-label-md flex items-center justify-center gap-unit-sm hover:opacity-90 transition-opacity" type="submit">
                Complete KYC &amp; Go to Dashboard
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
              <div className="flex items-center gap-unit-sm text-label-sm font-label-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                256-bit secure encryption
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full">
      {/* Page Header */}
      <div className="mb-gutter">
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary tracking-tight">Account Profile</h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant mt-1">Manage your personal information, security, and linked financial accounts.</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          {/* Personal Information Card */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md md:p-unit-lg relative overflow-hidden hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-surface-tint opacity-20"></div>
            <div className="flex flex-col sm:flex-row gap-gutter items-start sm:items-center mb-unit-lg">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-surface-container overflow-hidden border border-outline-variant relative flex items-center justify-center">
                  <span className="material-symbols-outlined text-[48px] text-on-surface-variant">person</span>
                </div>
                <div className="absolute bottom-0 right-0 bg-primary text-on-primary rounded-full p-1.5 border-2 border-surface-container-lowest shadow-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                </div>
              </div>
              <div>
                <h2 className="text-headline-md font-headline-md text-primary">Personal Details</h2>
                <p className="text-body-sm font-body-sm text-on-surface-variant">Ensure your name matches your government ID for compliance.</p>
              </div>
            </div>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-unit-md">
              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Legal First Name</label>
                <input className="bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-full" type="text" defaultValue="Alexander" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Legal Last Name</label>
                <input className="bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-full" type="text" defaultValue="Sterling" />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Primary Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
                  <input className="bg-surface border border-outline-variant rounded-lg pl-12 pr-4 py-3 text-body-md font-body-md text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-full" type="email" defaultValue="alex.sterling@example.com" />
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Phone Number</label>
                <div className="relative flex">
                  <div className="bg-surface-container border border-outline-variant border-r-0 rounded-l-lg px-3 py-3 flex items-center justify-center text-body-md font-body-md text-on-surface-variant">+91</div>
                  <input className="bg-surface border border-outline-variant rounded-r-lg px-4 py-3 text-body-md font-body-md text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-full flex-1" type="tel" defaultValue="98765 43210" />
                </div>
              </div>
              <div className="sm:col-span-2 flex justify-end mt-2 pt-unit-md border-t border-surface-container-high">
                <button className="bg-primary text-on-primary rounded-lg px-unit-lg py-3 text-label-md font-label-md hover:bg-opacity-90 transition-opacity font-bold" type="button">
                  Save Changes
                </button>
              </div>
            </form>
          </section>

          {/* Security Section */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md md:p-unit-lg hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
            <div className="flex items-center gap-3 mb-unit-lg">
              <div className="bg-surface-container-high p-2 rounded-lg text-primary">
                <span className="material-symbols-outlined">security</span>
              </div>
              <div>
                <h2 className="text-headline-md font-headline-md text-primary">Security Settings</h2>
                <p className="text-body-sm font-body-sm text-on-surface-variant">Update your password and enable two-factor authentication.</p>
              </div>
            </div>
            <form className="flex flex-col gap-unit-md max-w-md">
              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Current Password</label>
                <input className="bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-full" placeholder="••••••••" type="password" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">New Password</label>
                <input className="bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-full" type="password" />
                <span className="text-label-sm font-label-sm text-outline mt-1">Minimum 12 characters, including numbers and symbols.</span>
              </div>
              <div className="mt-2">
                <button className="border border-primary text-primary rounded-lg px-unit-md py-2.5 text-label-md font-label-md hover:bg-surface-container transition-colors font-bold inline-flex items-center gap-2" type="button">
                  Update Password
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          {/* Bank Account Details Card */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden relative hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
            <div className="h-1 w-full bg-secondary-container"></div>
            <div className="p-unit-md md:p-unit-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-headline-sm font-headline-sm text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container">account_balance</span>
                  Linked Bank
                </h3>
                <span className="bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant text-label-sm font-label-sm px-2 py-1 rounded-full uppercase tracking-wider font-bold">Verified</span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-6">This account is used for all deposits and withdrawals to your ProWealth portfolio.</p>
              <div className="bg-surface rounded-lg border border-outline-variant p-4 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-container text-on-primary-container rounded flex items-center justify-center font-bold text-label-md">HD</div>
                  <div>
                    <div className="text-label-md font-label-md text-primary">HDFC Bank Savings</div>
                    <div className="text-label-sm font-label-sm text-outline">Savings Account</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-label-sm font-label-sm text-on-surface-variant mb-1">IFSC Code</div>
                    <div className="text-data-mono font-data-mono text-primary tracking-widest">HDFC0001234</div>
                  </div>
                  <div>
                    <div className="text-label-sm font-label-sm text-on-surface-variant mb-1">Account Number</div>
                    <div className="text-data-mono font-data-mono text-primary tracking-widest">••••4892</div>
                  </div>
                </div>
              </div>
              <button className="w-full border border-outline-variant text-primary rounded-lg py-2.5 text-label-md font-label-md hover:border-primary transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                Change Linked Account
              </button>
            </div>
          </section>

          {/* Meta / Activity Info */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-md">
            <h4 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-4 border-b border-surface-container-high pb-2">Account Meta</h4>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-body-sm font-body-sm text-on-surface-variant">Member Since</span>
                <span className="text-label-md font-label-md text-primary">Oct 2021</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-sm font-body-sm text-on-surface-variant">Last Login</span>
                <span className="text-label-md font-label-md text-primary">Today, 09:42 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-sm font-body-sm text-on-surface-variant">Identity Tier</span>
                <span className="text-label-md font-label-md text-primary flex items-center gap-1">
                  Tier 3
                  <span className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

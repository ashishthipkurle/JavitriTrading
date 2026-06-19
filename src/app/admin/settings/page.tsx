export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  return (
    <div className="-mt-unit-xl">
      {/* Page Header */}
      <header className="mb-unit-lg flex flex-col md:flex-row md:items-end justify-between gap-unit-md border-b border-outline-variant pb-unit-md pt-unit-xl">
        <div>
          <h1 className="font-headline-lg text-headline-lg md:font-headline-xl md:text-headline-xl text-primary tracking-tight">Site Settings</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">Manage global configurations and platform behavior.</p>
        </div>
        <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 hover:bg-surface-tint transition-colors h-11">
          <span className="material-symbols-outlined text-[18px]">save</span>
          Save Changes
        </button>
      </header>

      {/* Navigation Tabs (Main Content) */}
      <div className="border-b border-outline-variant mb-unit-xl overflow-x-auto no-scrollbar">
        <nav className="flex gap-unit-lg min-w-max">
          <button className="font-label-md text-label-md text-primary border-b-2 border-primary pb-3 px-1 transition-colors">General</button>
          <button className="font-label-md text-label-md text-on-surface-variant border-b-2 border-transparent hover:text-primary hover:border-outline pb-3 px-1 transition-colors">Branding</button>
          <button className="font-label-md text-label-md text-on-surface-variant border-b-2 border-transparent hover:text-primary hover:border-outline pb-3 px-1 transition-colors">Contact</button>
          <button className="font-label-md text-label-md text-on-surface-variant border-b-2 border-transparent hover:text-primary hover:border-outline pb-3 px-1 transition-colors">Legal</button>
        </nav>
      </div>

      {/* Bento Grid Layout for Settings */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Primary Settings Column */}
        <div className="md:col-span-8 flex flex-col gap-gutter">
          {/* Identity Card */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-unit-md border-b border-outline-variant pb-2">Platform Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md mt-unit-md">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="site-name">Platform Name</label>
                <input className="w-full h-11 bg-surface border border-outline-variant rounded-lg px-4 font-body-md text-body-md text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline outline-none" id="site-name" type="text" defaultValue="ProWealth Advisory" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="support-email">Primary Support Email</label>
                <input className="w-full h-11 bg-surface border border-outline-variant rounded-lg px-4 font-body-md text-body-md text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline outline-none" id="support-email" type="email" defaultValue="support@prowealth.com" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="site-tagline">SEO Tagline</label>
                <input className="w-full h-11 bg-surface border border-outline-variant rounded-lg px-4 font-body-md text-body-md text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline outline-none" id="site-tagline" type="text" defaultValue="Premium Financial Advisory for HNW Individuals" />
              </div>
            </div>
          </section>

          {/* Localization Card */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-unit-md border-b border-outline-variant pb-2">Localization &amp; Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md mt-unit-md">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="timezone">System Timezone</label>
                <select className="w-full h-11 bg-surface border border-outline-variant rounded-lg px-4 font-body-md text-body-md text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none appearance-none" id="timezone" defaultValue="IST">
                  <option value="UTC">UTC (Universal Coordinated Time)</option>
                  <option value="IST">IST (Indian Standard Time)</option>
                  <option value="EST">EST (Eastern Standard Time)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="currency">Base Currency</label>
                <select className="w-full h-11 bg-surface border border-outline-variant rounded-lg px-4 font-body-md text-body-md text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none appearance-none" id="currency" defaultValue="INR">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Secondary/Status Column */}
        <div className="md:col-span-4 flex flex-col gap-gutter">
          {/* System Status */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-unit-md">Maintenance Mode</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-unit-md">Restrict access to the platform to administrators only during updates.</p>
            <div className="flex items-center justify-between p-3 border border-outline-variant rounded-lg bg-surface">
              <span className="font-label-md text-label-md text-primary">Enable Maintenance</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input className="sr-only peer" type="checkbox" value="" />
                <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-surface-container-lowest border border-error/20 rounded-xl p-unit-lg hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
            <h3 className="font-headline-sm text-headline-sm text-error mb-2">Danger Zone</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-unit-md">Actions here can result in irreversible data loss.</p>
            <button className="w-full border border-error text-error font-label-md text-label-md px-4 py-3 rounded-lg hover:bg-error/5 transition-colors flex justify-center items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">delete_forever</span>
              Clear System Cache
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

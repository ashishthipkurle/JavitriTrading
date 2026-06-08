export default function CMSPage() {
  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-unit-lg border-b border-outline-variant pb-unit-md">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-primary tracking-tight">Content Management</h1>
        </div>
        <div className="flex items-center gap-unit-md">
          <div className="flex items-center gap-2 mr-4">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
            <span className="text-label-sm font-label-sm text-on-surface-variant">Draft saved 2 mins ago</span>
          </div>
          <button className="px-4 py-2 border border-outline-variant text-primary rounded-lg text-label-md font-label-md hover:bg-surface-container-low transition-colors">
            Discard Changes
          </button>
          <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md font-label-md hover:opacity-90 transition-opacity">
            Publish to Live
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-gutter items-start">
        {/* Left Sidebar (Sections) */}
        <div className="w-full md:w-64 flex flex-col gap-unit-sm shrink-0">
          <div className="text-label-sm font-label-sm text-outline uppercase tracking-wider mb-2">Landing Page</div>
          <button className="w-full text-left px-unit-md py-3 bg-surface border border-outline-variant rounded-lg text-label-md font-label-md text-primary flex justify-between items-center shadow-sm">
            Hero Section
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
          <button className="w-full text-left px-unit-md py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-label-md font-label-md transition-colors">
            Value Proposition
          </button>
          <button className="w-full text-left px-unit-md py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-label-md font-label-md transition-colors">
            Featured Products (FDs)
          </button>
          <button className="w-full text-left px-unit-md py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-label-md font-label-md transition-colors">
            About Us Segment
          </button>
          <button className="w-full text-left px-unit-md py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-label-md font-label-md transition-colors">
            Testimonials Grid
          </button>
          <button className="w-full text-left px-unit-md py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-label-md font-label-md transition-colors">
            FAQ Accordion
          </button>

          <div className="text-label-sm font-label-sm text-outline uppercase tracking-wider mt-unit-md mb-2">Legal Pages</div>
          <button className="w-full text-left px-unit-md py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-label-md font-label-md transition-colors">
            Privacy Policy
          </button>
          <button className="w-full text-left px-unit-md py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-label-md font-label-md transition-colors">
            Terms of Service
          </button>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col gap-unit-md w-full">
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
              <input className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" type="text" defaultValue="Secure Your Wealth, Intelligently." />
              <div className="text-right text-label-sm font-label-sm text-outline">36 / 60 characters</div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-label-md font-label-md text-primary">Sub-headline / Descriptor</label>
              <textarea className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[100px]" defaultValue="Experience premium financial advisory with our high-yield Fixed Deposit plans and bespoke portfolio management tailored for high-net-worth individuals." />
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
                <input className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" type="text" defaultValue="Explore FD Plans" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-label-md text-primary">Secondary CTA Label</label>
                <input className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" type="text" defaultValue="Talk to an Advisor" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-label-md text-primary">Primary CTA Link (URL)</label>
                <input className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-data-mono font-data-mono text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none" type="text" defaultValue="/investments/fixed-deposits" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-label-md text-primary">Secondary CTA Link (URL)</label>
                <input className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-data-mono font-data-mono text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none" type="text" defaultValue="/contact-advisory" />
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
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

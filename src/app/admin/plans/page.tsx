export default function AdminPlansPage() {
  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-unit-md">
        <div>
          <h2 className="text-headline-xl font-headline-xl text-primary mb-unit-xs">FD Plans Manager</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">Manage, configure, and publish Fixed Deposit offerings.</p>
        </div>
        <button className="bg-primary text-on-primary h-[44px] px-unit-md rounded-lg flex items-center gap-unit-sm hover:brightness-90 transition-all shadow-sm">
          <span className="material-symbols-outlined">add</span>
          <span className="text-label-md font-label-md">Create New Plan</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-unit-md">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm font-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="Search plans by name or ID..." type="text" />
        </div>
        <select className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-body-sm font-body-sm focus:outline-none focus:border-primary">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-gutter">
        {/* Card 1: Active */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-md hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow flex flex-col">
          <div className="flex justify-between items-start mb-unit-md">
            <div>
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-[#E6F4EA] text-[#137333] text-label-sm font-label-sm mb-unit-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#137333] mr-1.5"></span>
                Active
              </div>
              <h3 className="text-headline-sm font-headline-sm text-primary">Pro-Yield Senior Care</h3>
              <p className="text-label-sm font-label-sm text-on-surface-variant">ID: FDP-001</p>
            </div>
            <div className="w-10 h-5 rounded-full bg-primary relative cursor-pointer">
              <div className="w-4 h-4 rounded-full bg-white absolute right-0.5 top-0.5 shadow-sm"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-unit-sm mb-unit-md flex-1">
            <div className="bg-surface p-unit-sm rounded-lg border border-surface-variant">
              <p className="text-label-sm font-label-sm text-outline mb-1">Interest Rate</p>
              <p className="text-headline-md font-headline-md text-primary">8.25%</p>
            </div>
            <div className="bg-surface p-unit-sm rounded-lg border border-surface-variant">
              <p className="text-label-sm font-label-sm text-outline mb-1">Tenure</p>
              <p className="text-data-mono font-data-mono text-primary mt-1">12 - 36 Mo</p>
            </div>
            <div className="col-span-2 flex justify-between items-center text-body-sm font-body-sm pt-2 border-t border-outline-variant mt-2">
              <span className="text-on-surface-variant">Min. Deposit</span>
              <span className="font-data-mono font-medium text-primary">₹1,00,000</span>
            </div>
          </div>
          <div className="flex gap-unit-sm mt-auto pt-unit-sm border-t border-outline-variant">
            <button className="flex-1 flex items-center justify-center gap-1 py-2 text-label-sm font-label-sm border border-primary text-primary rounded-lg hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit
            </button>
            <button className="flex items-center justify-center w-10 py-2 text-outline border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>
          </div>
        </div>

        {/* Card 2: Active (Premium) */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant border-t-2 border-t-secondary-container p-unit-md hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow flex flex-col">
          <div className="flex justify-between items-start mb-unit-md">
            <div>
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-[#E6F4EA] text-[#137333] text-label-sm font-label-sm mb-unit-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#137333] mr-1.5"></span>
                Active
              </div>
              <h3 className="text-headline-sm font-headline-sm text-primary">Wealth Multiplier Max</h3>
              <p className="text-label-sm font-label-sm text-on-surface-variant">ID: FDP-042</p>
            </div>
            <div className="w-10 h-5 rounded-full bg-primary relative cursor-pointer">
              <div className="w-4 h-4 rounded-full bg-white absolute right-0.5 top-0.5 shadow-sm"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-unit-sm mb-unit-md flex-1">
            <div className="bg-surface p-unit-sm rounded-lg border border-surface-variant">
              <p className="text-label-sm font-label-sm text-outline mb-1">Interest Rate</p>
              <p className="text-headline-md font-headline-md text-primary">7.90%</p>
            </div>
            <div className="bg-surface p-unit-sm rounded-lg border border-surface-variant">
              <p className="text-label-sm font-label-sm text-outline mb-1">Tenure</p>
              <p className="text-data-mono font-data-mono text-primary mt-1">60 Mo Fixed</p>
            </div>
            <div className="col-span-2 flex justify-between items-center text-body-sm font-body-sm pt-2 border-t border-outline-variant mt-2">
              <span className="text-on-surface-variant">Min. Deposit</span>
              <span className="font-data-mono font-medium text-primary">₹5,00,000</span>
            </div>
          </div>
          <div className="flex gap-unit-sm mt-auto pt-unit-sm border-t border-outline-variant">
            <button className="flex-1 flex items-center justify-center gap-1 py-2 text-label-sm font-label-sm border border-primary text-primary rounded-lg hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit
            </button>
            <button className="flex items-center justify-center w-10 py-2 text-outline border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>
          </div>
        </div>

        {/* Card 3: Draft */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-md hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow flex flex-col opacity-80">
          <div className="flex justify-between items-start mb-unit-md">
            <div>
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-surface-variant text-on-surface-variant text-label-sm font-label-sm mb-unit-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-outline mr-1.5"></span>
                Draft
              </div>
              <h3 className="text-headline-sm font-headline-sm text-primary">Tax Saver Ultra</h3>
              <p className="text-label-sm font-label-sm text-on-surface-variant">ID: FDP-088</p>
            </div>
            <div className="w-10 h-5 rounded-full bg-surface-variant relative cursor-pointer">
              <div className="w-4 h-4 rounded-full bg-white absolute left-0.5 top-0.5 shadow-sm border border-outline-variant"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-unit-sm mb-unit-md flex-1">
            <div className="bg-surface p-unit-sm rounded-lg border border-surface-variant">
              <p className="text-label-sm font-label-sm text-outline mb-1">Interest Rate</p>
              <p className="text-headline-md font-headline-md text-primary">7.10%</p>
            </div>
            <div className="bg-surface p-unit-sm rounded-lg border border-surface-variant">
              <p className="text-label-sm font-label-sm text-outline mb-1">Tenure</p>
              <p className="text-data-mono font-data-mono text-primary mt-1">TBD</p>
            </div>
            <div className="col-span-2 flex justify-between items-center text-body-sm font-body-sm pt-2 border-t border-outline-variant mt-2">
              <span className="text-on-surface-variant">Min. Deposit</span>
              <span className="font-data-mono font-medium text-primary">₹50,000</span>
            </div>
          </div>
          <div className="flex gap-unit-sm mt-auto pt-unit-sm border-t border-outline-variant">
            <button className="flex-1 flex items-center justify-center gap-1 py-2 text-label-sm font-label-sm border border-primary text-primary rounded-lg hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit
            </button>
            <button className="flex items-center justify-center w-10 py-2 text-outline border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

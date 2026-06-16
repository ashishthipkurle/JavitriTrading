import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  const plans = await prisma.fDPlan.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-unit-md">
        <div>
          <h2 className="text-headline-xl font-headline-xl text-primary mb-unit-xs">FD Plans Manager</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">Manage, configure, and publish investment plan offerings.</p>
        </div>
        <Link href="/admin/plans/new" className="bg-primary text-on-primary h-[44px] px-unit-md rounded-lg flex items-center gap-unit-sm hover:brightness-90 transition-all shadow-sm">
          <span className="material-symbols-outlined">add</span>
          <span className="text-label-md font-label-md">Create New Plan</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-unit-md mb-unit-lg mt-unit-md">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm font-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="Search plans by name or ID..." type="text" />
        </div>
        <select className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-body-sm font-body-sm focus:outline-none focus:border-primary">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Draft</option>
        </select>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-gutter">
        {plans.map((plan) => {
          const isActive = plan.isActive;
          const amount = Number(plan.amount);
          const dailyReturn = Number(plan.dailyReturnAmount);

          // Format amount as ₹5k, ₹10k, ₹1L, etc.
          let amountLabel = "";
          if (amount >= 100000) {
            amountLabel = `₹${(amount / 100000)}L`;
          } else if (amount >= 1000) {
            amountLabel = `₹${(amount / 1000)}k`;
          } else {
            amountLabel = `₹${amount.toLocaleString("en-IN")}`;
          }

          return (
            <div key={plan.id} className={`bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-md hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow flex flex-col ${!isActive ? 'opacity-80' : 'border-t-2 border-t-primary'}`}>
              <div className="flex justify-between items-start mb-unit-md">
                <div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-label-sm font-label-sm mb-unit-xs ${isActive ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-surface-variant text-on-surface-variant'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-[#137333]' : 'bg-outline'}`}></span>
                    {isActive ? 'Active' : 'Draft'}
                  </div>
                  <h3 className="text-headline-sm font-headline-sm text-primary">{plan.name}</h3>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">ID: {plan.id.slice(-6).toUpperCase()}</p>
                </div>
                <div className="text-headline-lg font-headline-lg text-primary font-bold">
                  {amountLabel}
                </div>
              </div>
              
              <div className="flex flex-col gap-unit-sm mb-unit-md flex-1">
                <div className="bg-surface p-unit-sm rounded-lg border border-surface-variant">
                  <p className="text-label-sm font-label-sm text-outline mb-1">Expected Daily Return</p>
                  <p className="text-headline-md font-headline-md text-primary">₹{dailyReturn.toLocaleString('en-IN')}+</p>
                </div>
                {plan.tagline && (
                  <div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant pt-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">star</span>
                    {plan.tagline}
                  </div>
                )}
                <div className="flex justify-between items-center text-body-sm font-body-sm pt-2 border-t border-outline-variant mt-2">
                  <span className="text-on-surface-variant">Investment Amount</span>
                  <span className="font-data-mono font-medium text-primary">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Tenure</span>
                  <span className="font-data-mono font-medium text-on-surface-variant">
                    Selected by client
                  </span>
                </div>
              </div>
              
              <div className="flex gap-unit-sm mt-auto pt-unit-sm border-t border-outline-variant">
                <Link href={`/admin/plans/${plan.id}`} className="flex-1 flex items-center justify-center gap-1 py-2 text-label-sm font-label-sm border border-primary text-primary rounded-lg hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Edit
                </Link>
              </div>
            </div>
          );
        })}

        {plans.length === 0 && (
          <div className="col-span-full p-12 text-center border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">description</span>
            <p className="text-headline-sm font-headline-sm text-on-surface">No FD Plans Found</p>
            <p className="text-body-md font-body-md text-on-surface-variant mt-2">Create your first investment plan to get started.</p>
          </div>
        )}
      </div>
    </>
  );
}

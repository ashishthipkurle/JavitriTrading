import prisma from "@/lib/prisma";
import CMSHeroForm from "./CMSHeroForm";

export const dynamic = "force-dynamic";

export default async function CMSPage() {
  // Fetch hero section content from the database
  const content = await prisma.landingContent.findMany({
    where: { section: "hero" },
  });

  // Convert array of {key, value} to a dictionary
  const initialData = content.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-unit-lg border-b border-outline-variant pb-unit-md">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-primary tracking-tight">Content Management</h1>
        </div>
        <div className="flex items-center gap-unit-md">
          {content.length > 0 && (
            <div className="flex items-center gap-2 mr-4">
              <span className="w-2 h-2 rounded-full bg-[#137333]"></span>
              <span className="text-label-sm font-label-sm text-on-surface-variant">
                Last updated: {new Date(content[0]?.updatedAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}
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
          <button className="w-full text-left px-unit-md py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-label-md font-label-md transition-colors opacity-50 cursor-not-allowed" title="Coming soon">
            Value Proposition
          </button>
          <button className="w-full text-left px-unit-md py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-label-md font-label-md transition-colors opacity-50 cursor-not-allowed" title="Coming soon">
            Featured Products (FDs)
          </button>
          <button className="w-full text-left px-unit-md py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-label-md font-label-md transition-colors opacity-50 cursor-not-allowed" title="Coming soon">
            About Us Segment
          </button>
          <button className="w-full text-left px-unit-md py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-label-md font-label-md transition-colors opacity-50 cursor-not-allowed" title="Coming soon">
            Testimonials Grid
          </button>
          <button className="w-full text-left px-unit-md py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-label-md font-label-md transition-colors opacity-50 cursor-not-allowed" title="Coming soon">
            FAQ Accordion
          </button>

          <div className="text-label-sm font-label-sm text-outline uppercase tracking-wider mt-unit-md mb-2">Legal Pages</div>
          <button className="w-full text-left px-unit-md py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-label-md font-label-md transition-colors opacity-50 cursor-not-allowed" title="Coming soon">
            Privacy Policy
          </button>
          <button className="w-full text-left px-unit-md py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-label-md font-label-md transition-colors opacity-50 cursor-not-allowed" title="Coming soon">
            Terms of Service
          </button>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 w-full">
          <CMSHeroForm initialData={initialData} />
        </div>
      </div>
    </>
  );
}

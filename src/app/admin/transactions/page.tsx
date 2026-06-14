export default function AdminTransactionsPage() {
  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-unit-lg">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary mb-1">Transactions Log</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Monitor all financial transactions across the platform.</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-surface rounded-xl border border-outline-variant p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-4xl text-outline">construction</span>
        </div>
        <h2 className="text-headline-sm font-headline-sm text-on-surface mb-2">Under Construction</h2>
        <p className="text-body-md font-body-md text-on-surface-variant max-w-md">
          The transaction logs viewer is currently being built. Check back later for full functionality.
        </p>
      </div>
    </>
  );
}

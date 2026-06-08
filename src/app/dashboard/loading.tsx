export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-gutter w-full h-full p-margin-desktop min-h-[500px]">
      <div className="animate-pulse flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-10 w-48 bg-surface-variant rounded-lg"></div>
          <div className="h-6 w-64 bg-surface-variant rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-surface-variant rounded-lg"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mt-unit-md">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md h-32 animate-pulse flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-surface-variant rounded"></div>
              <div className="h-6 w-6 bg-surface-variant rounded-full"></div>
            </div>
            <div className="h-8 w-32 bg-surface-variant rounded"></div>
            <div className="h-4 w-20 bg-surface-variant rounded"></div>
          </div>
        ))}
      </div>
      
      <div className="h-64 w-full bg-surface-container-lowest border border-outline-variant rounded-xl animate-pulse mt-unit-lg"></div>
    </div>
  );
}

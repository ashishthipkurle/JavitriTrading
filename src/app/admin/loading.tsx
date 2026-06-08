export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-gutter w-full h-full min-h-[500px]">
      <div className="animate-pulse flex flex-col md:flex-row justify-between gap-4 mb-unit-lg">
        <div className="flex flex-col gap-2">
          <div className="h-10 w-64 bg-surface-variant rounded-lg"></div>
          <div className="h-6 w-96 bg-surface-variant rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-surface-variant rounded-lg"></div>
      </div>
      
      <div className="h-16 w-full bg-surface-container-lowest border border-outline-variant rounded-xl animate-pulse mb-unit-md"></div>
      
      <div className="h-96 w-full bg-surface-container-lowest border border-outline-variant rounded-xl animate-pulse"></div>
    </div>
  );
}

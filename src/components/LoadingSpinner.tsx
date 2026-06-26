export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 w-full h-full">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-outline-variant/30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        
        {/* Inner static icon */}
        <span className="material-symbols-outlined text-primary text-2xl absolute">sync</span>
      </div>
      <h2 className="mt-4 text-headline-sm font-headline-sm text-primary animate-pulse">Loading...</h2>
      <p className="text-body-sm font-body-sm text-on-surface-variant mt-1 text-center max-w-[250px]">
        Please wait while we fetch the latest data.
      </p>
    </div>
  );
}

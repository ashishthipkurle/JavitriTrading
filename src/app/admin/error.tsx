'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Admin Console Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-unit-xl bg-surface-container-lowest border border-error/20 rounded-xl max-w-2xl mx-auto mt-unit-xl">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error mb-unit-md">
        <span className="material-symbols-outlined text-[32px]">warning</span>
      </div>
      <h2 className="text-headline-md font-headline-md text-primary mb-2">System Error</h2>
      <p className="text-body-md font-body-md text-on-surface-variant text-center mb-unit-lg">
        The admin console encountered an unexpected error. 
      </p>
      <div className="bg-surface-variant p-unit-sm rounded text-data-mono font-data-mono text-xs w-full overflow-hidden text-on-surface-variant mb-unit-lg">
        {error.message || "Unknown error occurred"}
      </div>
      <div className="flex gap-unit-md">
        <button
          onClick={() => reset()}
          className="px-unit-lg py-3 bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary/90 transition-colors"
        >
          Reload View
        </button>
        <button
          onClick={() => window.location.href = '/admin'}
          className="px-unit-lg py-3 border border-outline-variant rounded-lg font-label-md hover:bg-surface-container-low transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

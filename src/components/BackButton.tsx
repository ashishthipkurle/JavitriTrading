'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({ fallback = '/' }: { fallback?: string }) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    // If it was opened in a new tab, close it to return to the original tab
    if (window.opener) {
      window.close();
      return;
    }
    
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <a 
      href="#" 
      onClick={handleBack}
      className="text-label-md font-label-md text-primary hover:underline flex items-center gap-1"
    >
      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
      Go Back
    </a>
  );
}

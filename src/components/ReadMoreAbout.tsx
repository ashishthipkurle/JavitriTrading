"use client";

import { useState } from 'react';

interface ReadMoreAboutProps {
  desc1: string;
  desc2: string;
  desc3: string;
  desc4: string;
  desc5: string;
  desc6: string;
}

export default function ReadMoreAbout({ desc1, desc2, desc3, desc4, desc5, desc6 }: ReadMoreAboutProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-6">
      <p className="text-title-md font-title-md text-on-surface">
        {desc1}
      </p>
      
      {/* Mobile hidden content, desktop always visible */}
      <div className={`${isExpanded ? 'block' : 'hidden md:block'} space-y-6 transition-all duration-300`}>
        <div className="w-16 h-1 bg-primary-container rounded-full"></div>
        <p className="text-body-lg font-body-lg text-on-surface-variant">
          {desc2}
        </p>
        <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant/50 flex items-start gap-sm">
          <span className="material-symbols-outlined text-secondary-container mt-1">groups</span>
          <p className="text-body-md font-body-md text-on-surface-variant">
            {desc3}
          </p>
        </div>
        <div className="bg-primary-container/10 p-lg rounded-xl border border-primary-container/20 space-y-3">
          <p className="text-body-md font-body-md text-on-surface-variant">
            {desc4}
          </p>
          <p className="text-body-md font-body-md text-on-surface-variant">
            {desc5}
          </p>
        </div>
        <div className="flex items-center gap-sm bg-secondary-container/10 p-md rounded-xl border border-secondary-container/20">
          <span className="material-symbols-outlined text-secondary-container">trending_up</span>
          <p className="text-title-md font-title-md text-secondary-container">
            {desc6}
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden text-primary font-bold hover:underline flex items-center gap-1 w-full justify-center mt-4 py-2 border border-outline-variant rounded-lg"
      >
        {isExpanded ? 'View Less' : 'View More'}
        <span className="material-symbols-outlined text-sm">
          {isExpanded ? 'expand_less' : 'expand_more'}
        </span>
      </button>
    </div>
  );
}

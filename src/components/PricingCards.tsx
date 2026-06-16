'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface Plan {
  id: string;
  name: string;
  dailyReturnAmount: number;
  amount: number;
  tagline: string;
  description: string;
}

export default function PricingCards({ plans }: { plans: Plan[] }) {
  const [activeIdx, setActiveIdx] = useState<number>(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group w-full -ml-2 md:ml-0">
      {/* Scroll Left Button */}
      <button
        onClick={scrollLeft}
        className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 bg-surface shadow-md border border-outline-variant rounded-full w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-opacity opacity-0 group-hover:opacity-100 hidden sm:flex"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {/* Scroll Right Button */}
      <button
        onClick={scrollRight}
        className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 bg-surface shadow-md border border-outline-variant rounded-full w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-opacity opacity-0 group-hover:opacity-100 hidden sm:flex"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-6 pt-4 px-2 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {plans.map((plan, idx) => {
          const isActive = activeIdx === idx;

          return (
            <div
              key={plan.id}
              className={`
                bg-surface-container-lowest rounded-xl p-md flex flex-col relative
                transition-all duration-300 cursor-pointer snap-center sm:snap-start
                min-w-[260px] max-w-[280px] flex-shrink-0
                ${isActive
                  ? 'border-2 border-secondary-container shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:scale-105 z-10'
                  : 'border border-outline-variant hover:border-outline'
                }
              `}
              onMouseEnter={() => setActiveIdx(idx)}
            >
              {/* "Most Popular" badge removed per user request */}

              <div className={`mb-sm ${isActive ? 'mt-2' : ''}`}>
                <h3 className="text-headline-sm font-headline-sm text-on-surface">{plan.name}</h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                  {plan.tagline || plan.description}
                </p>
              </div>

              <div className="text-headline-md font-headline-md text-primary-container mb-md">
                ₹{plan.dailyReturnAmount.toLocaleString()}+{' '}
                <span className="text-body-sm font-body-sm text-on-surface-variant font-normal">/ day</span>
              </div>

              <ul className="space-y-xs mb-lg flex-grow">
                <li className="flex items-center gap-xs text-body-sm font-body-sm text-on-surface">
                  <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-secondary-container' : 'text-outline'}`}>done</span>
                  Investment: ₹{plan.amount.toLocaleString()}
                </li>
                <li className="flex items-center gap-xs text-body-sm font-body-sm text-on-surface">
                  <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-secondary-container' : 'text-outline'}`}>done</span>
                  Flexible Tenure
                </li>
                <li className="flex items-center gap-xs text-body-sm font-body-sm text-on-surface">
                  <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-secondary-container' : 'text-outline'}`}>done</span>
                  Live Market Support
                </li>
                <li className="flex items-center gap-xs text-body-sm font-body-sm text-on-surface">
                  <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-secondary-container' : 'text-outline'}`}>done</span>
                  Daily Updates
                </li>
              </ul>

              <Link
                href="/register"
                className={`
                  w-full text-center py-2 rounded-lg font-label-md text-label-md transition-colors
                  ${isActive
                    ? 'bg-secondary-container text-on-secondary-container hover:brightness-110 shadow-sm'
                    : 'border border-primary-container text-primary-container hover:bg-surface-container-low'
                  }
                `}
              >
                Invest Now
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

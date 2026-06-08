'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Plan {
  id: string;
  name: string;
  monthlyReturnPercent: number;
  minAmount: number;
  tenureMonths: number;
  description: string;
}

const SUBTITLES: Record<number, string> = {
  0: 'Perfect for testing waters',
  1: 'Balanced risk & reward',
  2: 'For serious investors',
  3: 'Institutional grade',
};

export default function PricingCards({ plans }: { plans: Plan[] }) {
  const [activeIdx, setActiveIdx] = useState<number>(1);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md"

    >
      {plans.map((plan, idx) => {
        const isActive = activeIdx === idx;

        return (
          <div
            key={plan.id}
            className={`
              bg-surface-container-lowest rounded-xl p-md flex flex-col relative
              transition-all duration-300 cursor-pointer
              ${isActive
                ? 'border-2 border-secondary-container shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:scale-105 z-10'
                : 'border border-outline-variant hover:border-outline'
              }
            `}
            onMouseEnter={() => setActiveIdx(idx)}
          >
            {/* "Most Popular" badge — only visible on the active card */}
            {isActive && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                Most Popular
              </div>
            )}

            <div className={`mb-sm ${isActive ? 'mt-2' : ''}`}>
              <h3 className="text-headline-sm font-headline-sm text-on-surface">{plan.name}</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                {SUBTITLES[idx] ?? ''}
              </p>
            </div>

            <div className="text-headline-md font-headline-md text-primary-container mb-md">
              {plan.monthlyReturnPercent}%{' '}
              <span className="text-body-sm font-body-sm text-on-surface-variant font-normal">/ month</span>
            </div>

            <ul className="space-y-xs mb-lg flex-grow">
              <li className="flex items-center gap-xs text-body-sm font-body-sm text-on-surface">
                <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-secondary-container' : 'text-outline'}`}>done</span>
                Min Inv: ₹{plan.minAmount.toLocaleString()}
              </li>
              <li className="flex items-center gap-xs text-body-sm font-body-sm text-on-surface">
                <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-secondary-container' : 'text-outline'}`}>done</span>
                {plan.tenureMonths}-Day Lock-in
              </li>
              <li className="flex items-center gap-xs text-body-sm font-body-sm text-on-surface">
                <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-secondary-container' : 'text-outline'}`}>done</span>
                {plan.description}
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
  );
}

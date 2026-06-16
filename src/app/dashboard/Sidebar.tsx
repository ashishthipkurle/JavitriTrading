"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: 'dashboard', label: 'Overview' },
    { href: '/dashboard/wallet', icon: 'account_balance_wallet', label: 'Wallet' },
    { href: '/dashboard/investments', icon: 'trending_up', label: 'Investments' },
    { href: '/dashboard/earnings', icon: 'payments', label: 'Earnings' },
  ];

  return (
    <nav className="hidden md:flex bg-surface-container-lowest border-r border-outline-variant fixed left-0 top-0 h-full w-[240px] z-40 flex-col p-unit-md gap-unit-sm">
      <div className="mb-8 mt-4 px-2">
        <h1 className="text-headline-sm font-headline-sm font-bold text-primary">Wealth Portfolio</h1>
        <p className="text-label-sm font-label-sm text-on-surface-variant mt-1">Premium Member</p>
      </div>
      
      <div className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-secondary-container text-on-secondary-container font-bold scale-[0.98]' 
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:bg-surface-container-high'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'fill' : ''}`} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              <span className="text-label-md font-label-md">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t border-outline-variant flex flex-col gap-2">
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low hover:bg-surface-container-high transition-all rounded-lg">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-label-md font-label-md">Settings</span>
        </Link>
        <Link href="/dashboard/support" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low hover:bg-surface-container-high transition-all rounded-lg">
          <span className="material-symbols-outlined">help</span>
          <span className="text-label-md font-label-md">Support</span>
        </Link>
      </div>
    </nav>
  );
}

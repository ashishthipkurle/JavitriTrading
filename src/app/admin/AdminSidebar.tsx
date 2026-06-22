"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', icon: 'analytics', label: 'Analytics' },
    { href: '/admin/users', icon: 'group', label: 'Users' },
    { href: '/admin/employees', icon: 'badge', label: 'Employees' },
    { href: '/admin/plans', icon: 'description', label: 'FD Plans' },
    { href: '/admin/investments', icon: 'trending_up', label: 'Investments' },
    { href: '/admin/withdrawals', icon: 'account_balance', label: 'Withdrawals' },
    { href: '/admin/deposits', icon: 'payments', label: 'Deposits' },
    { href: '/admin/transactions', icon: 'receipt_long', label: 'Transactions' },
    { href: '/admin/cms', icon: 'edit_note', label: 'CMS Editor' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] z-40 bg-surface-container-lowest border-r border-outline-variant flex flex-col p-unit-md gap-unit-sm hidden md:flex">
      
      {/* Header */}
      <div className="flex items-center gap-unit-sm mb-unit-lg px-unit-sm">
        <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-headline-sm">
          A
        </div>
        <div>
          <h2 className="text-headline-sm font-headline-sm font-bold text-primary">Admin Console</h2>
          <p className="text-label-sm font-label-sm text-on-surface-variant">System Control</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center gap-unit-sm p-unit-sm rounded-lg text-label-md font-label-md transition-all ${
                isActive 
                  ? 'bg-primary text-on-primary font-bold brightness-90' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
        
        <div className="mt-auto">
          <Link 
            href="/admin/settings" 
            className={`flex items-center gap-unit-sm p-unit-sm rounded-lg text-label-md font-label-md transition-all ${
              pathname.startsWith('/admin/settings') 
                ? 'bg-primary text-on-primary font-bold brightness-90' 
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined" style={pathname.startsWith('/admin/settings') ? { fontVariationSettings: "'FILL' 1" } : {}}>
              settings_applications
            </span>
            Settings
          </Link>
        </div>
      </nav>
    </aside>
  );
}

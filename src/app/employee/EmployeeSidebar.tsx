"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function EmployeeSidebar({ user }: { user?: any }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/employee', icon: 'analytics', label: 'Dashboard' },
    { href: '/employee/clients', icon: 'group', label: 'My Clients' },
    { href: '/employee/investments', icon: 'trending_up', label: 'Investments' },
    { href: '/employee/commissions', icon: 'payments', label: 'Commissions' },
    { href: '/employee/wallet', icon: 'account_balance_wallet', label: 'Wallet' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] z-40 bg-surface-container-lowest border-r border-outline-variant flex flex-col p-unit-md gap-unit-sm hidden md:flex">
      
      {/* Header */}
      <div className="flex items-center gap-unit-sm mb-unit-lg px-unit-sm mt-4">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-headline-sm shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'E'}
          </div>
        )}
        <div>
          <h2 className="text-headline-sm font-headline-sm font-bold text-primary truncate w-[160px]">{user?.name || 'Workspace'}</h2>
          <p className="text-label-sm font-label-sm text-on-surface-variant">Employee</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/employee' && pathname.startsWith(item.href));
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
            href="/employee/settings"
            className={`flex items-center gap-unit-sm p-unit-sm rounded-lg text-label-md font-label-md transition-all ${
              pathname.startsWith('/employee/settings')
                ? 'bg-primary text-on-primary font-bold brightness-90' 
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined" style={pathname.startsWith('/employee/settings') ? { fontVariationSettings: "'FILL' 1" } : {}}>
              settings
            </span>
            Settings
          </Link>
        </div>
      </nav>
    </aside>
  );
}

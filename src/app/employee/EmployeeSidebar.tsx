"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function EmployeeSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/employee', icon: 'analytics', label: 'Dashboard' },
    { href: '/employee/clients', icon: 'group', label: 'My Clients' },
    { href: '/employee/investments', icon: 'trending_up', label: 'Investments' },
    { href: '/employee/commissions', icon: 'payments', label: 'Commissions' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] z-40 bg-surface-container-lowest border-r border-outline-variant flex flex-col p-unit-md gap-unit-sm hidden md:flex">
      
      {/* Header */}
      <div className="flex items-center mb-unit-lg px-unit-sm">
        <div>
          <h2 className="text-headline-sm font-headline-sm font-bold text-primary">Workspace</h2>
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
                  ? 'bg-secondary text-on-secondary font-bold brightness-90' 
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
      </nav>
    </aside>
  );
}

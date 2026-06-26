"use client";

import { useSidebar } from '@/components/SidebarContext';

export default function MobileMenuButton() {
  const { setIsOpen } = useSidebar();
  
  return (
    <button 
      onClick={() => setIsOpen(true)} 
      className="md:hidden p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors flex items-center justify-center"
      aria-label="Open Navigation Menu"
    >
      <span className="material-symbols-outlined text-2xl">menu</span>
    </button>
  );
}

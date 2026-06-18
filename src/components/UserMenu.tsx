"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    // Clear PIN gate session so it activates on next login
    sessionStorage.removeItem('pinUnlocked');
    sessionStorage.removeItem('needsPinSetup');
    sessionStorage.removeItem('lastActiveTime');
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const getBasePath = () => {
    if (pathname.startsWith('/admin')) return '/admin';
    if (pathname.startsWith('/employee')) return '/employee';
    return '/dashboard';
  };

  const basePath = getBasePath();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-surface hover:bg-surface-container transition-colors rounded-full p-1 pr-3 border border-outline-variant shadow-sm"
      >
        <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden">
          <span className="material-symbols-outlined text-[20px] text-on-surface">person</span>
        </div>
        <span className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-surface border border-outline-variant rounded-xl shadow-lg py-2 z-50">
          <Link
            href={basePath}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-label-md font-label-md text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            Dashboard
          </Link>
          <Link
            href={`${basePath}/profile`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-label-md font-label-md text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            Profile
          </Link>
          <div className="h-px bg-outline-variant my-1"></div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-label-md font-label-md text-error hover:bg-error-container hover:text-on-error-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

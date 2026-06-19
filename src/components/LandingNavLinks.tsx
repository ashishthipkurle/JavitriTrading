"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LandingNavLinks() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const fdPlansSection = document.getElementById('fd-plans');
      if (fdPlansSection) {
        const rect = fdPlansSection.getBoundingClientRect();
        // If the top of the FD plans section is near the top of the viewport
        if (rect.top <= 150) {
          setActiveSection('fd-plans');
        } else {
          setActiveSection('home');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position after a short delay to allow rendering
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="hidden md:flex space-x-md h-16">
      <Link 
        className={`${activeSection === 'home' ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant'} hover:text-secondary transition-colors duration-150 py-4 h-full flex items-center text-label-md font-label-md`} 
        href="/"
      >
        Home
      </Link>
      <Link 
        className={`${activeSection === 'fd-plans' ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant'} hover:text-secondary transition-colors duration-150 py-4 h-full flex items-center text-label-md font-label-md`} 
        href="#fd-plans"
      >
        FD Plans
      </Link>
    </nav>
  );
}

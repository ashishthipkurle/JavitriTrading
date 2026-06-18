import Link from 'next/link';
import BackButton from '@/components/BackButton';

export const metadata = {
  title: 'Meet the Developer | Javitri Trading',
  description: 'About the developer of Javitri Trading.',
};

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-outline-variant bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between">
          <Link href="/" className="text-headline-sm font-headline-sm font-bold text-primary">
            Javitri Trading
          </Link>
          <BackButton />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex flex-col items-center">
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[64px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>code</span>
        </div>
        
        <h1 className="text-display-sm font-display-sm text-primary mb-4 text-center">Meet the Developer</h1>
        <p className="text-headline-sm font-headline-sm text-secondary-container mb-10 text-center font-bold">
          Ashish Thipkurle
        </p>

        <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm prose prose-slate max-w-none text-on-surface">
          <p className="text-body-lg font-body-lg leading-relaxed text-on-surface-variant text-center mb-8">
            Hello! I'm Ashish, the sole developer and architect behind the Javitri Trading platform. I built this robust, scalable, and secure institutional-grade investment management system from the ground up.
          </p>

          <h3 className="text-title-md font-title-md text-primary mb-4 border-b border-outline-variant pb-2">Technical Architecture</h3>
          <ul className="list-none space-y-3 mb-8">
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-container">done_all</span>
              <span className="text-body-md text-on-surface-variant"><strong>Frontend:</strong> Next.js 14 (App Router), React, Tailwind CSS</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-container">done_all</span>
              <span className="text-body-md text-on-surface-variant"><strong>Backend:</strong> Next.js API Routes, Node.js</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-container">done_all</span>
              <span className="text-body-md text-on-surface-variant"><strong>Database & Auth:</strong> Supabase (PostgreSQL), Prisma ORM</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-container">done_all</span>
              <span className="text-body-md text-on-surface-variant"><strong>Payments:</strong> Razorpay Integration</span>
            </li>
          </ul>

          <h3 className="text-title-md font-title-md text-primary mb-4 border-b border-outline-variant pb-2">Key Features Implemented</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-primary mb-2">shield_lock</span>
              <h4 className="font-bold text-on-surface mb-1">Security First</h4>
              <p className="text-body-sm text-on-surface-variant">Custom 6-digit PIN gate system, OTP verification, and role-based access control (Admin/Employee/Client).</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-primary mb-2">dashboard_customize</span>
              <h4 className="font-bold text-on-surface mb-1">Complex Dashboards</h4>
              <p className="text-body-sm text-on-surface-variant">Three distinct management portals with real-time financial data calculation and tracking.</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-primary mb-2">payments</span>
              <h4 className="font-bold text-on-surface mb-1">Financial Engine</h4>
              <p className="text-body-sm text-on-surface-variant">Automated daily return generation and wallet balance management.</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
              <span className="material-symbols-outlined text-primary mb-2">recent_actors</span>
              <h4 className="font-bold text-on-surface mb-1">KYC Pipeline</h4>
              <p className="text-body-sm text-on-surface-variant">Document upload and verification workflow for user compliance.</p>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/" className="px-8 py-3 bg-primary text-on-primary font-bold rounded-lg hover:brightness-90 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined">home</span>
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

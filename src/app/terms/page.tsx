import Link from 'next/link';
import BackButton from '@/components/BackButton';

export const metadata = {
  title: 'Terms of Service | ProWealth Advisory',
  description: 'Terms of Service and User Agreement for ProWealth Advisory.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-outline-variant bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between">
          <Link href="/" className="text-headline-sm font-headline-sm font-bold text-primary">
            ProWealth Advisory
          </Link>
          <BackButton fallback="/dashboard" />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20">
        <div className="mb-10">
          <h1 className="text-headline-lg font-headline-lg text-primary mb-4">Terms of Service</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="prose prose-slate max-w-none text-on-surface">
          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">1. Agreement to Terms</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              By accessing or using the services provided by ProWealth Advisory (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">2. Description of Service</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              ProWealth Advisory provides a platform for fixed deposit investments, portfolio management, and related financial tracking tools. We are not a registered broker-dealer or investment advisor. The information provided on our platform does not constitute financial advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">3. User Accounts & KYC</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              To use certain features of the Service, you must register for an account and complete our Know Your Customer (KYC) verification process. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">4. Investment Risks</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              All investments carry risks, including the possible loss of principal. Past performance of any trading system or methodology is not necessarily indicative of future results. You acknowledge and agree that you are solely responsible for any investment decisions you make based on the information provided on our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">5. Limitation of Liability</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              In no event shall ProWealth Advisory, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">6. Changes to Terms</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

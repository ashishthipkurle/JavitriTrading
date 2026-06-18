import Link from 'next/link';
import BackButton from '@/components/BackButton';

export const metadata = {
  title: 'Risk Disclosure | ProWealth Advisory',
  description: 'Risk Disclosure and Important Information for ProWealth Advisory.',
};

export default function RiskDisclosurePage() {
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
          <h1 className="text-headline-lg font-headline-lg text-primary mb-4">Risk Disclosure</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="prose prose-slate max-w-none text-on-surface">
          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">1. General Risk Warning</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              Investing involves significant risks, including the potential loss of principal. The investment plans and portfolios discussed on this platform are subject to market risks, and there is no guarantee that any investment objective will be achieved.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">2. Fixed Deposit and Fixed Return Risks</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              While certain plans are marketed as fixed returns or fixed deposits, you should be aware that all financial institutions and investment vehicles carry counterparty and credit risk. In the event of extreme market volatility or institutional failure, your principal may be at risk.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">3. No Financial Advice</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              The information provided by ProWealth Advisory is for educational and informational purposes only. It does not constitute financial, legal, or tax advice. You should consult with a licensed professional before making any financial decisions.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

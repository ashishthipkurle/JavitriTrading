import Link from 'next/link';
import BackButton from '@/components/BackButton';

export const metadata = {
  title: 'Refund Policy | Javitri Trading',
  description: 'Refund Policy for Javitri Trading.',
};

export default function RefundPolicyPage() {
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
      <main className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20">
        <div className="mb-10">
          <h1 className="text-headline-lg font-headline-lg text-primary mb-4">Refund Policy</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="prose prose-slate max-w-none text-on-surface">
          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">1. Investment Lock-in Period</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              All Fixed Deposit (FD) investments made through Javitri Trading are subject to the terms and tenure specified at the time of purchase. Premature withdrawal policies may apply, and breaking an investment before maturity could result in a penalty on the accrued daily returns.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">2. Processing Fees</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              Any processing fees, GST, or convenience fees charged by third-party payment gateways during the investment deposit are strictly non-refundable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">3. Failed Transactions</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              If your bank account or payment method is debited but the investment is not reflected in your dashboard due to a technical error, the amount will be automatically refunded to the original payment source within 5-7 business days by the payment gateway.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">4. Requesting a Cancellation</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              If you have accidentally purchased a plan and wish to cancel it, you must contact our support team at <strong>support@javitritrading.com</strong> within 24 hours of the transaction. Approval is subject to management discretion.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

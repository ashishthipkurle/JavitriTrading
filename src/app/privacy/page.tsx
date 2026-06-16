import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | ProWealth Advisory',
  description: 'Privacy Policy and Data Handling for ProWealth Advisory.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-outline-variant bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between">
          <Link href="/" className="text-headline-sm font-headline-sm font-bold text-primary">
            ProWealth Advisory
          </Link>
          <Link href="/register" className="text-label-md font-label-md text-primary hover:underline">
            Back to Sign Up
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20">
        <div className="mb-10">
          <h1 className="text-headline-lg font-headline-lg text-primary mb-4">Privacy Policy</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="prose prose-slate max-w-none text-on-surface">
          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">1. Information We Collect</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              When you use ProWealth Advisory, we may collect the following types of information:
            </p>
            <ul className="list-disc pl-5 text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant space-y-2">
              <li><strong>Personal Identification Information:</strong> Name, email address, phone number, government-issued IDs, and facial scans for KYC verification.</li>
              <li><strong>Financial Information:</strong> Bank account details, transaction history, and investment preferences.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, operating system, and usage patterns on our platform.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">2. How We Use Your Information</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              We use the information we collect for various purposes, including to:
            </p>
            <ul className="list-disc pl-5 text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant space-y-2">
              <li>Provide, maintain, and improve our services.</li>
              <li>Process your transactions securely.</li>
              <li>Verify your identity and comply with Anti-Money Laundering (AML) regulations.</li>
              <li>Communicate with you regarding account updates, security alerts, and promotional offers.</li>
              <li>Detect, prevent, and address technical issues or fraudulent activity.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">3. Data Security and Storage</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              We prioritize the security of your personal and financial data. We implement industry-standard encryption protocols (AES-256) for data at rest and TLS for data in transit. Sensitive documents, such as PAN or Aadhaar cards, are stored securely and accessed only for verification purposes.
            </p>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">4. Information Sharing</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              We do not sell or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-5 text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant space-y-2">
              <li>With regulatory authorities or law enforcement if required by law.</li>
              <li>With third-party service providers (e.g., identity verification partners, payment processors) who assist us in operating our platform, under strict confidentiality agreements.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">5. Your Rights</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              You have the right to access, update, or delete your personal information. You can manage your account settings directly through the platform or contact our support team for assistance.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

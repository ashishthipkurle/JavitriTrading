import Link from 'next/link';
import BackButton from '@/components/BackButton';

export const metadata = {
  title: 'About Us | Javitri Trading',
  description: 'About Javitri Trading.',
};

export default function AboutUsPage() {
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
        <div className="mb-10 text-center">
          <h1 className="text-headline-lg font-headline-lg text-primary mb-4">About Javitri Trading</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Empowering individuals to secure their financial future through expert guidance, high-yield fixed return plans, and unparalleled market expertise.
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-on-surface">
          <section className="mb-10 bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
            <h2 className="text-title-lg font-title-lg text-primary mb-4">Our Mission</h2>
            <p className="text-body-md font-body-md leading-relaxed text-on-surface-variant">
              At Javitri Trading, we believe that wealth building should be accessible, transparent, and secure. Our mission is to demystify financial markets and provide our clients with robust, daily-income investment plans that outpace traditional banking instruments.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <section className="bg-surface-container-low border border-outline-variant rounded-2xl p-8 shadow-sm">
              <span className="material-symbols-outlined text-4xl text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
              <h2 className="text-title-lg font-title-lg text-primary mb-3">Expert Analysis</h2>
              <p className="text-body-md font-body-md leading-relaxed text-on-surface-variant">
                Our team of seasoned market analysts continuously monitors trends, ensuring that your capital is deployed in the most efficient and risk-managed avenues available.
              </p>
            </section>
            
            <section className="bg-surface-container-low border border-outline-variant rounded-2xl p-8 shadow-sm">
              <span className="material-symbols-outlined text-4xl text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <h2 className="text-title-lg font-title-lg text-primary mb-3">Uncompromised Security</h2>
              <p className="text-body-md font-body-md leading-relaxed text-on-surface-variant">
                We prioritize the safety of your funds and data above all else. With bank-grade encryption and stringent compliance measures, your investments are always protected.
              </p>
            </section>
          </div>

          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3 text-center">Why Choose Us?</h2>
            <ul className="list-none space-y-4 mt-6">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary-container mt-1">check_circle</span>
                <div>
                  <strong className="block text-primary text-label-lg mb-1">Consistent Daily Returns</strong>
                  <span className="text-on-surface-variant text-body-md">Our Fixed Deposit (FD) plans are structured to provide reliable, calculable daily payouts directly to your dashboard.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary-container mt-1">check_circle</span>
                <div>
                  <strong className="block text-primary text-label-lg mb-1">Flexible Tenures</strong>
                  <span className="text-on-surface-variant text-body-md">We offer a variety of plans catering to different investment sizes and duration preferences.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary-container mt-1">check_circle</span>
                <div>
                  <strong className="block text-primary text-label-lg mb-1">Dedicated Support</strong>
                  <span className="text-on-surface-variant text-body-md">Our customer success team and dedicated relationship managers are always available to guide you.</span>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

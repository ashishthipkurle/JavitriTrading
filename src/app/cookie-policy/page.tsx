import Link from 'next/link';
import BackButton from '@/components/BackButton';

export const metadata = {
  title: 'Cookie Policy | Javitri Trading Service',
  description: 'Cookie Policy for Javitri Trading Service.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-outline-variant bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between">
          <Link href="/" className="text-headline-sm font-headline-sm font-bold text-primary">
            Javitri Trading Service
          </Link>
          <BackButton />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20">
        <div className="mb-10">
          <h1 className="text-headline-lg font-headline-lg text-primary mb-4">Cookie Policy</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="prose prose-slate max-w-none text-on-surface">
          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">1. What Are Cookies?</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">2. How We Use Cookies</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              Javitri Trading Service uses cookies for the following purposes:
            </p>
            <ul className="list-disc pl-5 text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant space-y-2">
              <li><strong>Essential Cookies:</strong> Required to enable core site functionality, such as securing your session and allowing you to access your dashboard.</li>
              <li><strong>Performance & Analytics:</strong> To understand how visitors interact with our platform so we can improve user experience.</li>
              <li><strong>Preferences:</strong> To remember your settings and preferences (e.g., your PIN gate timeout).</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-title-lg font-title-lg text-primary mb-3">3. Managing Your Cookies</h2>
            <p className="text-body-md font-body-md mb-4 leading-relaxed text-on-surface-variant">
              You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit our site and some services and functionalities may not work.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

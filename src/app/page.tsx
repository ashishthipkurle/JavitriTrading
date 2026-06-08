import Link from 'next/link';
import prisma from '@/lib/prisma';
import PricingCards from '@/components/PricingCards';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  // Fetch CMS Content
  let contents: any[] = [];
  try {
    contents = await prisma.landingContent.findMany();
  } catch (e) {
    console.log("Database connection not established. Using default CMS content.");
  }
  
  const getContent = (key: string, defaultValue: string) => {
    const content = contents.find((c: { key: string; value: string }) => c.key === key);
    return content ? content.value : defaultValue;
  };

  // Fetch FD Plans
  let fdPlans: any[] = [];
  try {
    fdPlans = await prisma.fDPlan.findMany({
      where: { isActive: true },
      orderBy: { minAmount: 'asc' }
    });
  } catch (e) {
    console.log("Database connection not established. Using default FD plans.");
  }

  // Fallback plans if none found
  if (fdPlans.length === 0) {
    fdPlans = [
      { id: '1', name: 'Starter', monthlyReturnPercent: 8, minAmount: 10000, tenureMonths: 30, description: 'Standard Support' },
      { id: '2', name: 'Growth', monthlyReturnPercent: 12, minAmount: 50000, tenureMonths: 60, description: 'Priority Signals' },
      { id: '3', name: 'Premium', monthlyReturnPercent: 15, minAmount: 2000000, tenureMonths: 90, description: 'Daily Consultations' },
      { id: '4', name: 'Elite', monthlyReturnPercent: 20, minAmount: 10000000, tenureMonths: 180, description: 'Wealth Manager' },
    ];
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col pt-16">
      {/* TopNavBar Component */}
      <header className="bg-surface text-primary border-b border-outline-variant fixed top-0 left-0 w-full z-50 flex justify-between items-center px-sm md:px-md h-16">
        <div className="max-w-container-max mx-auto w-full flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-headline-md font-headline-md font-bold text-primary">Trader FD Scheme</span>
          </div>
          <nav className="hidden md:flex space-x-md h-16">
            {/* Active Navigation Item (Home) */}
            <Link className="text-secondary font-bold border-b-2 border-secondary hover:text-secondary transition-colors duration-150 py-4 h-full flex items-center text-label-md font-label-md" href="/">Home</Link>
            {/* Inactive Navigation Items */}
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-150 py-4 h-full flex items-center text-label-md font-label-md" href="#about">About</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-150 py-4 h-full flex items-center text-label-md font-label-md" href="#fd-plans">FD Plans</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-150 py-4 h-full flex items-center text-label-md font-label-md" href="#telegram">Telegram</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-150 py-4 h-full flex items-center text-label-md font-label-md" href="#faq">FAQ</Link>
            <Link className="text-on-surface-variant hover:text-secondary transition-colors duration-150 py-4 h-full flex items-center text-label-md font-label-md" href="#contact">Contact</Link>
          </nav>
          <div className="flex items-center space-x-sm">
            <Link className="text-primary-container font-label-md text-label-md hover:opacity-80 transition-opacity" href="/login">Login</Link>
            <Link className="bg-primary-container text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" href="/register">Get Started</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-container-max mx-auto px-sm md:px-md py-xl flex flex-col md:flex-row items-center gap-lg">
          <div className="flex-1 flex flex-col items-start space-y-md">
            <span className="text-label-md font-label-md text-secondary-container uppercase tracking-wider">
              {getContent('hero_badge', 'Premium Investment Platform')}
            </span>
            <h1 className="text-headline-xl-mobile font-headline-xl-mobile md:text-headline-xl md:font-headline-xl text-on-surface max-w-2xl leading-tight">
              {getContent('hero_title', 'Grow Your Wealth With Expert Trading Signals & Fixed Returns')}
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl">
              {getContent('hero_subtitle', 'Experience institutional-grade financial growth. Join thousands of investors leveraging our proprietary algorithms and expert advisory for secure, consistent yield.')}
            </p>
            <div className="flex flex-wrap gap-sm pt-sm">
              <Link href="/register" className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-6 py-3 rounded-lg hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_4px_14px_0_rgba(254,166,25,0.2)]">
                Start Investing
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <a href="#telegram" className="border-2 border-primary-container text-primary-container font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary-container hover:text-on-primary transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">send</span>
                Join Telegram
              </a>
            </div>
            <div className="flex items-center space-x-lg pt-lg mt-md border-t border-outline-variant w-full max-w-xl">
              <div>
                <div className="text-headline-sm font-headline-sm text-on-surface">{getContent('stat_1_value', '15K+')}</div>
                <div className="text-body-sm font-body-sm text-on-surface-variant">{getContent('stat_1_label', 'Active Investors')}</div>
              </div>
              <div className="w-px h-8 bg-outline-variant"></div>
              <div>
                <div className="text-headline-sm font-headline-sm text-on-surface">{getContent('stat_2_value', '₹2.5Cr+')}</div>
                <div className="text-body-sm font-body-sm text-on-surface-variant">{getContent('stat_2_label', 'Total Payouts')}</div>
              </div>
              <div className="w-px h-8 bg-outline-variant"></div>
              <div>
                <div className="text-headline-sm font-headline-sm text-on-surface">{getContent('stat_3_value', '98%')}</div>
                <div className="text-body-sm font-body-sm text-on-surface-variant">{getContent('stat_3_label', 'Signal Accuracy')}</div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative w-full flex justify-end">
            <div className="absolute inset-0 bg-secondary-container opacity-5 rounded-full blur-3xl transform scale-150 -z-10"></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              alt="Trading Dashboard Mockup" 
              className="rounded-xl shadow-[0_20px_40px_-15px_rgba(16,28,46,0.15)] border border-outline-variant w-full max-w-lg object-cover" 
              src={getContent('hero_image', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAVKPY5eH784eI31xklUPfom8tf-wr_Oc-h1ojHGGvyFv_9Jt68DDvyRsVhpiArcTtrcWHjIF2R9EXBiridWY5kiLgDd7Z3ZIaWvH0y3wWChis3VmigRT-QtRVJv8lbWvWh86H3Tgbob8mPdRZE6LPmIneqYwJybj1_kmOkRRAppTXlPbRV48wJbYqCCzYH_cqrqlJnvr6EtLaqOZjz_XkbPU-9zhQzFXD5M3sTcDoNX742GNxgA4-Wkpf3SW0YgQP1ag-H-5Gz8U')} 
            />
          </div>
        </section>

        {/* About Section */}
        <section className="bg-surface-container-lowest py-xl border-y border-outline-variant" id="about">
          <div className="max-w-container-max mx-auto px-sm md:px-md grid md:grid-cols-2 gap-lg items-center">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                alt="Lead Trader Profile" 
                className="rounded-xl object-cover h-[500px] w-full border border-outline-variant shadow-sm" 
                src={getContent('about_image', '/Profile Image 1.png')} 
              />
              <div className="absolute -bottom-6 -right-6 bg-surface p-md rounded-xl shadow-lg border border-outline-variant hidden md:block">
                <div className="flex items-center gap-sm">
                  <div className="bg-secondary-container text-on-secondary-container p-2 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <div className="text-data-md font-data-md text-on-surface">{getContent('about_badge_title', 'SEBI Registered')}</div>
                    <div className="text-body-sm font-body-sm text-on-surface-variant">{getContent('about_badge_subtitle', 'Advisory Firm')}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-md">
              <h2 className="text-headline-lg-mobile font-headline-lg-mobile md:text-headline-lg md:font-headline-lg text-on-surface">
                {getContent('about_title', "India's #1 Trading Advisory Platform")}
              </h2>
              <p className="text-body-lg font-body-lg text-on-surface-variant">
                {getContent('about_description', 'At Trader FD Scheme, we bridge the gap between complex financial markets and individual investors. Our team of seasoned market analysts brings decades of institutional trading experience to deliver actionable signals and robust fixed-return plans.')}
              </p>
              <ul className="space-y-sm mt-md">
                <li className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-secondary-container">check_circle</span>
                  <span className="text-body-md font-body-md text-on-surface">{getContent('about_point_1', 'Over 10 years of collective market experience.')}</span>
                </li>
                <li className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-secondary-container">check_circle</span>
                  <span className="text-body-md font-body-md text-on-surface">{getContent('about_point_2', 'Risk-managed portfolios tailored for stable growth.')}</span>
                </li>
                <li className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-secondary-container">check_circle</span>
                  <span className="text-body-md font-body-md text-on-surface">{getContent('about_point_3', 'Transparent reporting and 24/7 dedicated support.')}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FD Plans Section */}
        <section className="py-xl max-w-container-max mx-auto px-sm md:px-md" id="fd-plans">
          <div className="text-center mb-lg space-y-sm">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile md:text-headline-lg md:font-headline-lg text-on-surface">
              {getContent('plans_title', 'Fixed Return Plans')}
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl mx-auto">
              {getContent('plans_subtitle', 'Select a strategy that aligns with your capital and growth objectives. All plans include dedicated account management.')}
            </p>
          </div>
          <PricingCards plans={fdPlans} />
        </section>

        {/* How It Works Section */}
        <section className="bg-surface-container-low py-xl border-t border-outline-variant">
          <div className="max-w-container-max mx-auto px-sm md:px-md">
            <div className="text-center mb-lg space-y-sm">
              <h2 className="text-headline-lg-mobile font-headline-lg-mobile md:text-headline-lg md:font-headline-lg text-on-surface">
                {getContent('how_it_works_title', 'How It Works')}
              </h2>
              <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl mx-auto">
                {getContent('how_it_works_subtitle', 'Four simple steps to begin your journey towards consistent wealth generation.')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-lg relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-[40px] left-[12%] right-[12%] h-px border-t-2 border-dashed border-outline-variant z-0"></div>
              
              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center border-2 border-primary-container shadow-sm mb-md">
                  <span className="material-symbols-outlined text-[32px] text-primary-container">app_registration</span>
                </div>
                <h4 className="text-data-md font-data-md text-on-surface mb-xs">{getContent('step_1_title', '1. Register')}</h4>
                <p className="text-body-sm font-body-sm text-on-surface-variant">{getContent('step_1_desc', 'Create your secure account in under 2 minutes.')}</p>
              </div>
              
              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center border-2 border-primary-container shadow-sm mb-md">
                  <span className="material-symbols-outlined text-[32px] text-primary-container">account_balance_wallet</span>
                </div>
                <h4 className="text-data-md font-data-md text-on-surface mb-xs">{getContent('step_2_title', '2. Deposit Fund')}</h4>
                <p className="text-body-sm font-body-sm text-on-surface-variant">{getContent('step_2_desc', 'Choose a plan and deposit your capital securely.')}</p>
              </div>
              
              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center border-2 border-secondary-container shadow-sm mb-md bg-secondary-container/5">
                  <span className="material-symbols-outlined text-[32px] text-secondary-container">trending_up</span>
                </div>
                <h4 className="text-data-md font-data-md text-on-surface mb-xs">{getContent('step_3_title', '3. Expert Trading')}</h4>
                <p className="text-body-sm font-body-sm text-on-surface-variant">{getContent('step_3_desc', 'Our algorithms and experts generate profits.')}</p>
              </div>
              
              {/* Step 4 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center border-2 border-primary-container shadow-sm mb-md">
                  <span className="material-symbols-outlined text-[32px] text-primary-container">payments</span>
                </div>
                <h4 className="text-data-md font-data-md text-on-surface mb-xs">{getContent('step_4_title', '4. Withdraw Returns')}</h4>
                <p className="text-body-sm font-body-sm text-on-surface-variant">{getContent('step_4_desc', 'Receive automated payouts directly to your bank.')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <footer className="bg-primary-container text-on-primary-container w-full py-lg px-sm md:px-md flex flex-col md:flex-row justify-between items-center gap-md">
        <div className="flex flex-col md:flex-row items-center gap-md">
          <span className="text-headline-sm font-headline-sm font-bold text-on-primary-container">Trader FD Scheme</span>
          <span className="text-body-sm font-body-sm opacity-80 md:ml-4">© 2024 Trader FD Scheme. All rights reserved.</span>
        </div>
        <div className="flex gap-sm">
          <Link className="text-body-sm font-body-sm text-on-primary-container opacity-80 hover:opacity-100 transition-opacity" href="/privacy">Privacy Policy</Link>
          <span className="text-outline-variant opacity-30">•</span>
          <Link className="text-body-sm font-body-sm text-on-primary-container opacity-80 hover:opacity-100 transition-opacity" href="/terms">Terms of Service</Link>
          <span className="text-outline-variant opacity-30">•</span>
          <Link className="text-body-sm font-body-sm text-on-primary-container opacity-80 hover:opacity-100 transition-opacity" href="/cookie-policy">Cookie Policy</Link>
        </div>
      </footer>
    </div>
  );
}

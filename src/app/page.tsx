import Link from 'next/link';
import prisma from '@/lib/prisma';
import PricingCards from '@/components/PricingCards';
import UserMenu from '@/components/UserMenu';
import ClearPinSession from '@/components/ClearPinSession';
import HeroBackground from '@/components/HeroBackground';
import HeroChart from '@/components/HeroChart';
import { getAuthUser } from '@/lib/auth';
import LandingNavLinks from '@/components/LandingNavLinks';
import ReadMoreAbout from '@/components/ReadMoreAbout';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const user = await getAuthUser();

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

  // Fetch FD Plans from the database, with fallback defaults
  let fdPlans: any[] = [];
  try {
    const dbPlans = await prisma.fDPlan.findMany({
      where: { isActive: true },
      orderBy: { amount: 'asc' },
    });
    if (dbPlans.length > 0) {
      fdPlans = dbPlans.map(p => ({
        id: p.id,
        name: p.name,
        dailyReturnAmount: Number(p.dailyReturnAmount),
        amount: Number(p.amount),
        tagline: p.tagline,
        description: p.description,
      }));
    }
  } catch (e) {
    console.log("Could not fetch FD plans from database. Using defaults.");
  }

  // Fallback if no plans in DB
  if (fdPlans.length === 0) {
    fdPlans = [
      { id: '1', name: '₹5k PLAN', dailyReturnAmount: 200, amount: 5000, tagline: 'Referral Bonus Available', description: 'Referral Bonus Available' },
      { id: '2', name: '₹10k PLAN', dailyReturnAmount: 500, amount: 10000, tagline: 'Beginner Friendly Plan', description: 'Beginner Friendly Plan' },
      { id: '3', name: '₹20k PLAN', dailyReturnAmount: 1100, amount: 20000, tagline: 'Strong Growth Potential', description: 'Strong Growth Potential' },
      { id: '4', name: '₹30k PLAN', dailyReturnAmount: 1700, amount: 30000, tagline: 'Advanced Income Plan', description: 'Advanced Income Plan' },
      { id: '5', name: '₹50k PLAN', dailyReturnAmount: 2800, amount: 50000, tagline: 'Premium Investor Plan', description: 'Premium Investor Plan' },
      { id: '6', name: '₹80k PLAN', dailyReturnAmount: 4500, amount: 80000, tagline: 'High Performance Portfolio', description: 'High Performance Portfolio' },
      { id: '7', name: '₹1L PLAN', dailyReturnAmount: 6000, amount: 100000, tagline: 'Elite Wealth Growth Plan', description: 'Elite Wealth Growth Plan' },
    ];
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col pt-16">
      {/* Clear PIN session when visiting landing page */}
      <ClearPinSession />
      {/* TopNavBar Component */}
      <header className="bg-surface text-primary border-b border-outline-variant fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-20">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-3 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.png" alt="Javitri Trading Logo" className="h-14 md:h-[76px] w-auto object-contain py-1" />
            <span className="hidden md:inline text-title-md md:text-headline-md font-bold text-gray-900 truncate">Javitri Trading Service</span>
          </div>
          <LandingNavLinks />
          <div className="flex items-center space-x-sm">
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link className="text-primary-container font-label-md text-label-md hover:opacity-80 transition-opacity" href="/login">Login</Link>
                <Link className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-label-md text-label-md px-4 py-2 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-opacity" href="/register">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full flex items-center min-h-[calc(75vh-64px)] overflow-hidden pt-xl pb-xl md:py-0 bg-[#0a1628]">
          <HeroBackground />
          
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-[60%] h-full z-0 opacity-20 md:opacity-100 hidden md:block">
            <HeroChart />
          </div>

          <div className="max-w-container-max mx-auto px-sm md:px-md w-full relative z-10 flex">
            <div className="w-full md:w-1/2 flex flex-col items-start space-y-md md:pr-xl">
              <span className="text-label-md font-label-md text-amber-500 uppercase tracking-wider">
                {getContent('hero_badge', 'Premium Investment Platform')}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold md:text-headline-xl md:font-headline-xl text-white max-w-2xl leading-tight">
                {getContent('hero_title', 'Grow Your Wealth With Expert Trading Signals & Fixed Returns')}
              </h1>
              <p className="text-base sm:text-lg md:text-body-lg md:font-body-lg text-gray-300 max-w-xl">
                {getContent('hero_subtitle', 'Experience institutional-grade financial growth. Join thousands of investors leveraging our proprietary algorithms and expert advisory for secure, consistent yield.')}
              </p>
              <div className="flex flex-wrap md:flex-nowrap gap-3 pt-sm w-full md:w-max">
                {user ? (
                  <Link href="/dashboard/investments/new" className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-label-md text-label-md px-4 md:px-5 py-3 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.5)] whitespace-nowrap">
                    Start Investing
                    <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  </Link>
                ) : (
                  <Link href="/register" className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-label-md text-label-md px-4 md:px-5 py-3 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.5)] whitespace-nowrap">
                    Create Free Account
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                )}
                <a href="https://t.me/Javitritradingservice" target="_blank" rel="noopener noreferrer" className="bg-white/5 backdrop-blur-md border border-white/20 text-white font-label-md text-label-md px-4 md:px-5 py-3 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Join Telegram
                </a>
                <a href="https://invite.dhan.co/?join=GEED36" target="_blank" rel="noopener noreferrer" className="bg-white/5 backdrop-blur-md border border-white/20 text-white font-label-md text-label-md px-4 md:px-5 py-3 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                  <span className="material-symbols-outlined text-[18px]">account_balance</span>
                  Demat Account
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-between md:justify-start gap-y-4 md:space-x-lg pt-lg mt-md border-t border-white/10 w-full max-w-xl">
                <div>
                  <div className="text-headline-sm font-headline-sm text-white">{getContent('stat_1_value', '15K+')}</div>
                  <div className="text-body-sm font-body-sm text-gray-400">{getContent('stat_1_label', 'Active Investors')}</div>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div>
                  <div className="text-headline-sm font-headline-sm text-white">{getContent('stat_2_value', '₹2.5Cr+')}</div>
                  <div className="text-body-sm font-body-sm text-gray-400">{getContent('stat_2_label', 'Total Payouts')}</div>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div>
                  <div className="text-headline-sm font-headline-sm text-white">{getContent('stat_3_value', '98%')}</div>
                  <div className="text-body-sm font-body-sm text-gray-400">{getContent('stat_3_label', 'Client Retention')}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Ticker */}
        <div className="w-full overflow-hidden bg-surface border-y border-outline-variant py-4 relative z-20">
          <div className="flex whitespace-nowrap animate-scroll-left w-max">
            {/* Group 1 */}
            <div className="flex items-center gap-12 px-6">
              <div className="flex items-center gap-2 text-on-surface-variant font-body-md"><span className="material-symbols-outlined text-secondary-container">verified_user</span> SEBI Registered</div>
              <div className="flex items-center gap-2 text-on-surface font-body-md text-xl font-bold">ANGEL ONE</div>
              <div className="flex items-center gap-2 text-on-surface-variant font-body-md"><span className="material-symbols-outlined text-secondary-container">lock</span> SSL Secured</div>
              <div className="flex items-center gap-2 text-on-surface font-body-md text-xl font-bold">DHAN</div>
              <div className="flex items-center gap-2 text-on-surface-variant font-body-md"><span className="material-symbols-outlined text-secondary-container">workspace_premium</span> ISO 27001</div>
            </div>
            {/* Group 2 (Duplicate for seamless loop) */}
            <div className="flex items-center gap-12 px-6">
              <div className="flex items-center gap-2 text-on-surface-variant font-body-md"><span className="material-symbols-outlined text-secondary-container">verified_user</span> SEBI Registered</div>
              <div className="flex items-center gap-2 text-on-surface font-body-md text-xl font-bold">ANGEL ONE</div>
              <div className="flex items-center gap-2 text-on-surface-variant font-body-md"><span className="material-symbols-outlined text-secondary-container">lock</span> SSL Secured</div>
              <div className="flex items-center gap-2 text-on-surface font-body-md text-xl font-bold">DHAN</div>
              <div className="flex items-center gap-2 text-on-surface-variant font-body-md"><span className="material-symbols-outlined text-secondary-container">workspace_premium</span> ISO 27001</div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="bg-surface-container-lowest py-xl border-y border-outline-variant" id="about">
          <div className="max-w-container-max mx-auto px-sm md:px-md grid lg:grid-cols-12 gap-xl items-start">
            <div className="relative lg:col-span-5 lg:sticky lg:top-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Lead Trader Profile"
                className="rounded-xl object-cover h-[400px] lg:h-[600px] w-full border border-outline-variant shadow-sm"
                src={getContent('about_image', '/Profile Image 1.png')}
              />
              <div className="absolute -bottom-6 -right-6 bg-surface p-md rounded-xl shadow-lg border border-outline-variant hidden md:block z-10">
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
            <div className="lg:col-span-7 space-y-md pt-4 lg:pt-0">
              <h2 className="text-headline-md-mobile font-headline-md-mobile md:text-headline-md md:font-headline-md text-on-surface leading-snug">
                {getContent('about_title', "Welcome to Javitri Trading Service — India's Trusted Stock Market Advisory")}
              </h2>
              <ReadMoreAbout 
                desc1={getContent('about_description_1', 'Javitri Trading Service is a SEBI-registered stock market research, analysis, and advisory firm with over 10 years of professional experience in the Indian financial markets. Led by a dedicated team of 7 expert analysts and traders, we specialize in delivering accurate market research and real-time actionable insights to help investors make smarter, more confident decisions.')}
                desc2={getContent('about_description_2', "We are proud to be an official business partner of Angel One and Dhan — two of India's most trusted and leading stock broking platforms — ensuring our clients always have access to the best tools, technology, and execution infrastructure available in the market today.")}
                desc3={getContent('about_description_3', "With a thriving community of over 1,000 active members on our Telegram channel, we provide real-time buy and sell signals directly to your fingertips — so you never miss a profitable opportunity in the market.")}
                desc4={getContent('about_description_4', "We believe smart investing should be simple, safe, and rewarding for everyone. That's why we've introduced our exclusive Daily Income Investment Scheme — a structured plan where you invest once and earn daily returns, managed entirely by our expert trading team. Whether you're a beginner starting with ₹5,000 or a seasoned investor looking at our ₹1 Lakh Elite Plan, we have a strategy tailored just for you.")}
                desc5={getContent('about_description_5', "Our plans offer expected daily returns starting from ₹200 and going up to ₹6,000+, with full live market support, daily updates, and transparent reporting at every step.")}
                desc6={getContent('about_description_6', "Join thousands of smart investors who trust Javitri Trading Service to grow their wealth — one trading day at a time.")}
              />
            </div>
          </div>
        </section>

        {/* FD Plans Section */}
        <section className="py-xl max-w-container-max mx-auto px-sm md:px-md" id="fd-plans">
          <div className="text-center mb-lg space-y-sm">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile md:text-headline-lg md:font-headline-lg text-on-surface">
              {getContent('plans_title', 'Investment Plans')}
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl mx-auto">
              {getContent('plans_subtitle', 'Daily income opportunities with expert guidance. Low investment, high growth potential, safe strategy, and trusted service.')}
            </p>
          </div>
          <PricingCards plans={fdPlans} isLoggedIn={!!user} />
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

        {/* Why Choose Us Section */}
        <section className="py-xl max-w-container-max mx-auto px-sm md:px-md">
          <div className="text-center mb-lg space-y-sm">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile md:text-headline-lg md:font-headline-lg text-on-surface">
              Why Investors Trust Us
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl mx-auto">
              We combine institutional-grade technology with transparent advisory services to provide an unmatched investment experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
            <div className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant hover:border-secondary-container transition-colors shadow-sm">
              <div className="w-12 h-12 bg-secondary-container/10 rounded-full flex items-center justify-center mb-sm">
                <span className="material-symbols-outlined text-[24px] text-secondary-container">shield</span>
              </div>
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2">Capital Protection</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Strict risk management rules protect your core capital from market down-swings.</p>
            </div>
            <div className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant hover:border-secondary-container transition-colors shadow-sm">
              <div className="w-12 h-12 bg-secondary-container/10 rounded-full flex items-center justify-center mb-sm">
                <span className="material-symbols-outlined text-[24px] text-secondary-container">currency_rupee</span>
              </div>
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2">Daily Payouts</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Enjoy consistent daily returns deposited directly to your wallet, available for instant withdrawal.</p>
            </div>
            <div className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant hover:border-secondary-container transition-colors shadow-sm">
              <div className="w-12 h-12 bg-secondary-container/10 rounded-full flex items-center justify-center mb-sm">
                <span className="material-symbols-outlined text-[24px] text-secondary-container">monitoring</span>
              </div>
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2">Expert Trading</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Benefit from strategies developed by SEBI registered analysts with a 98% signal accuracy.</p>
            </div>
            <div className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant hover:border-secondary-container transition-colors shadow-sm">
              <div className="w-12 h-12 bg-secondary-container/10 rounded-full flex items-center justify-center mb-sm">
                <span className="material-symbols-outlined text-[24px] text-secondary-container">support_agent</span>
              </div>
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2">24/7 Support</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">A dedicated support team available around the clock to assist you with any questions.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-secondary-container text-on-secondary-container py-xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary opacity-5 rounded-full blur-3xl transform scale-150"></div>
          <div className="max-w-2xl mx-auto px-sm md:px-md relative z-10 space-y-md">
            <h2 className="text-headline-xl-mobile font-headline-xl-mobile md:text-headline-xl md:font-headline-xl text-on-surface">
              Ready to Start Earning?
            </h2>
            <p className="text-body-lg font-body-lg text-on-surface opacity-80">
              Join the fastest-growing trading advisory platform today and secure your daily income.
            </p>
            <div className="pt-sm">
              {user ? (
                <Link href="/dashboard/investments/new" className="inline-flex items-center gap-2 bg-on-surface text-surface font-label-md text-label-md px-8 py-4 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                  Start Investing
                  <span className="material-symbols-outlined text-[20px]">trending_up</span>
                </Link>
              ) : (
                <Link href="/register" className="inline-flex items-center gap-2 bg-on-surface text-surface font-label-md text-label-md px-8 py-4 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                  Create Free Account
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* Footer Component */}
      <footer className="bg-primary-container text-on-primary-container w-full">
        {/* Main Footer Content */}
        <div className="max-w-container-max mx-auto px-sm md:px-md py-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
            {/* Company Info */}
            <div className="md:col-span-1 space-y-md">
              <span className="text-headline-md font-headline-md font-bold text-on-primary-container block">Javitri Trading Service</span>
              <p className="text-body-sm font-body-sm opacity-70 leading-relaxed">
                India&apos;s trusted platform for expert trading signals and fixed-return investment plans. Grow your wealth with confidence.
              </p>
              {/* Social Icons */}
              <div className="flex gap-xs pt-xs">
                <a href="https://t.me/Javitritradingservice" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-9 h-9 rounded-full bg-on-primary-container/10 hover:bg-secondary-container hover:text-on-secondary-container flex items-center justify-center transition-all duration-200">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </a>
                <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-on-primary-container/10 hover:bg-secondary-container hover:text-on-secondary-container flex items-center justify-center transition-all duration-200">
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </a>
                <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-full bg-on-primary-container/10 hover:bg-secondary-container hover:text-on-secondary-container flex items-center justify-center transition-all duration-200">
                  <span className="material-symbols-outlined text-[18px]">play_circle</span>
                </a>
                <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-on-primary-container/10 hover:bg-secondary-container hover:text-on-secondary-container flex items-center justify-center transition-all duration-200">
                  <span className="material-symbols-outlined text-[18px]">tag</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-md">
              <h4 className="text-data-md font-data-md text-secondary-container uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-sm">
                <li><Link href="/" className="text-body-sm font-body-sm opacity-70 hover:opacity-100 hover:text-secondary-container transition-all duration-200">Home</Link></li>
                <li><Link href="#fd-plans" className="text-body-sm font-body-sm opacity-70 hover:opacity-100 hover:text-secondary-container transition-all duration-200">FD Plans</Link></li>
                <li><Link href="/about" className="text-body-sm font-body-sm opacity-70 hover:opacity-100 hover:text-secondary-container transition-all duration-200">About Us</Link></li>
                <li><Link href="/register" className="text-body-sm font-body-sm opacity-70 hover:opacity-100 hover:text-secondary-container transition-all duration-200">Get Started</Link></li>
                <li><Link href="/login" className="text-body-sm font-body-sm opacity-70 hover:opacity-100 hover:text-secondary-container transition-all duration-200">Login</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-md">
              <h4 className="text-data-md font-data-md text-secondary-container uppercase tracking-wider">Legal</h4>
              <ul className="space-y-sm">
                <li><Link href="/privacy" className="text-body-sm font-body-sm opacity-70 hover:opacity-100 hover:text-secondary-container transition-all duration-200">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-body-sm font-body-sm opacity-70 hover:opacity-100 hover:text-secondary-container transition-all duration-200">Terms of Service</Link></li>
                <li><Link href="/cookie-policy" className="text-body-sm font-body-sm opacity-70 hover:opacity-100 hover:text-secondary-container transition-all duration-200">Cookie Policy</Link></li>
                <li><Link href="/refund-policy" className="text-body-sm font-body-sm opacity-70 hover:opacity-100 hover:text-secondary-container transition-all duration-200">Refund Policy</Link></li>
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div className="space-y-md">
              <h4 className="text-data-md font-data-md text-secondary-container uppercase tracking-wider">Get In Touch</h4>
              <div className="space-y-sm">
                <div className="flex items-start gap-xs">
                  <span className="material-symbols-outlined text-[18px] text-secondary-container mt-0.5">mail</span>
                  <span className="text-body-sm font-body-sm opacity-70">support@javitritrading.com</span>
                </div>
                <div className="flex items-start gap-xs">
                  <span className="material-symbols-outlined text-[18px] text-secondary-container mt-0.5">schedule</span>
                  <span className="text-body-sm font-body-sm opacity-70">Mon - Sat, 9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-start gap-xs">
                  <span className="material-symbols-outlined text-[18px] text-secondary-container mt-0.5">location_on</span>
                  <span className="text-body-sm font-body-sm opacity-70">Mumbai, Maharashtra, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-on-primary-container/10">
          <div className="max-w-container-max mx-auto px-sm md:px-md py-md flex flex-col md:flex-row justify-between items-center gap-xs">
            <span className="text-body-sm font-body-sm opacity-50">© {new Date().getFullYear()} Javitri Trading Service. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a href="https://my-portfolio-3-five.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-body-sm font-body-sm opacity-70 hover:opacity-100 hover:text-primary transition-all flex items-center gap-1 border border-outline-variant/30 bg-surface-container-low px-2 py-1 rounded-md">
                <span className="material-symbols-outlined text-[14px]">code</span>
                Developer
              </a>
              <span className="text-body-sm font-body-sm opacity-50">Made with <span className="text-secondary-container">♥</span> in India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

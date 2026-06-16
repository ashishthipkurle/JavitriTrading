import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProfilePage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      kyc: true,
    }
  });

  if (!user) redirect('/login');

  const [firstName, ...lastNameParts] = (user.name || '').split(' ');
  const lastName = lastNameParts.join(' ');
  
  let bankAccount = 'Not Linked';
  if (user.kyc?.bankAccount) {
    bankAccount = decrypt(user.kyc.bankAccount);
    // show only last 4 digits
    if (bankAccount.length > 4 && !bankAccount.includes('***DECRYPTION_FAILED***')) {
      bankAccount = '••••' + bankAccount.slice(-4);
    }
  }

  const ifsc = user.kyc?.ifsc || 'N/A';
  
  // Format member since date
  const memberSince = new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' }).format(new Date(user.createdAt));

  return (
    <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full">
      {/* Page Header */}
      <div className="mb-gutter">
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary tracking-tight">Account Profile</h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant mt-1">View your personal information and linked financial accounts.</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          {/* Personal Information Card */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md md:p-unit-lg relative overflow-hidden hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-surface-tint opacity-20"></div>
            <div className="flex flex-col sm:flex-row justify-between items-start mb-unit-lg gap-4">
              <div className="flex flex-col sm:flex-row gap-gutter items-start sm:items-center">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-surface-container overflow-hidden border border-outline-variant relative flex items-center justify-center">
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant">person</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-headline-md font-headline-md text-primary">Personal Details</h2>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Your registered identity details.</p>
                </div>
              </div>
              <Link href="/dashboard/settings" className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-bold text-label-md hover:opacity-90 transition-opacity">
                Edit Profile
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-unit-md">
              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Legal First Name</label>
                <div className="bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-primary">{firstName || '-'}</div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Legal Last Name</label>
                <div className="bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-primary">{lastName || '-'}</div>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Primary Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
                  <div className="bg-surface border border-outline-variant rounded-lg pl-12 pr-4 py-3 text-body-md font-body-md text-primary">{user.email}</div>
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Phone Number</label>
                <div className="bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-primary">{user.phone}</div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          {/* Bank Account Details Card */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden relative hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
            <div className="h-1 w-full bg-secondary-container"></div>
            <div className="p-unit-md md:p-unit-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-headline-sm font-headline-sm text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container">account_balance</span>
                  Linked Bank
                </h3>
                {user.kycStatus === 'APPROVED' && (
                  <span className="bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant text-label-sm font-label-sm px-2 py-1 rounded-full uppercase tracking-wider font-bold">Verified</span>
                )}
              </div>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-6">This account is used for all deposits and withdrawals to your portfolio.</p>
              <div className="bg-surface rounded-lg border border-outline-variant p-4 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-container text-on-primary-container rounded flex items-center justify-center font-bold text-label-md">
                    <span className="material-symbols-outlined">account_balance</span>
                  </div>
                  <div>
                    <div className="text-label-md font-label-md text-primary">Bank Account</div>
                    <div className="text-label-sm font-label-sm text-outline">Savings Account</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-label-sm font-label-sm text-on-surface-variant mb-1">IFSC Code</div>
                    <div className="text-data-mono font-data-mono text-primary tracking-widest">{ifsc}</div>
                  </div>
                  <div>
                    <div className="text-label-sm font-label-sm text-on-surface-variant mb-1">Account Number</div>
                    <div className="text-data-mono font-data-mono text-primary tracking-widest">{bankAccount}</div>
                  </div>
                </div>
              </div>
              <Link href="/dashboard/settings" className="w-full border border-outline-variant text-primary rounded-lg py-2.5 text-label-md font-label-md hover:border-primary transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                Change Linked Account
              </Link>
            </div>
          </section>

          {/* Meta / Activity Info */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-md">
            <h4 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-4 border-b border-surface-container-high pb-2">Account Meta</h4>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-body-sm font-body-sm text-on-surface-variant">Member Since</span>
                <span className="text-label-md font-label-md text-primary">{memberSince}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-sm font-body-sm text-on-surface-variant">Identity Tier</span>
                <span className="text-label-md font-label-md text-primary flex items-center gap-1">
                  Tier {user.kycStatus === 'APPROVED' ? '3' : '1'}
                  {user.kycStatus === 'APPROVED' && (
                    <span className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  )}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

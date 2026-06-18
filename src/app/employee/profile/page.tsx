import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AvatarUpload from '@/components/AvatarUpload';

export default async function EmployeeProfilePage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect('/login');
  if (authUser.role !== 'EMPLOYEE') redirect('/dashboard');

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      clients: {
        select: { id: true },
      },
      commissionsEarned: {
        select: { amount: true, status: true },
      },
    },
  });

  if (!user) redirect('/login');

  const [firstName, ...lastNameParts] = (user.name || '').split(' ');
  const lastName = lastNameParts.join(' ');

  const memberSince = new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' }).format(new Date(user.createdAt));

  const totalClients = user.clients.length;
  const totalCommissions = user.commissionsEarned.reduce((sum, c) => sum + Number(c.amount), 0);
  const pendingCommissions = user.commissionsEarned.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + Number(c.amount), 0);

  return (
    <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full">
      {/* Page Header */}
      <div className="mb-gutter">
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary tracking-tight">My Profile</h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant mt-1">View and manage your employee profile details.</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          {/* Personal Information Card */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md md:p-unit-lg relative overflow-hidden hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-surface-tint opacity-20"></div>
            <div className="flex flex-col sm:flex-row justify-between items-start mb-unit-lg gap-4">
              <div className="flex flex-col sm:flex-row gap-gutter items-start sm:items-center">
                <AvatarUpload
                  currentAvatarUrl={user.avatarUrl}
                  userName={user.name || 'E'}
                />
                <div>
                  <h2 className="text-headline-md font-headline-md text-primary">Personal Details</h2>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Your registered identity as an employee.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-unit-md">
              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">First Name</label>
                <div className="bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-primary">{firstName || '-'}</div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Last Name</label>
                <div className="bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-primary">{lastName || '-'}</div>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Email Address</label>
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
          {/* Stats Card */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden relative hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
            <div className="h-1 w-full bg-secondary-container"></div>
            <div className="p-unit-md md:p-unit-lg">
              <h3 className="text-headline-sm font-headline-sm text-primary flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary-container">bar_chart</span>
                Performance
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-surface rounded-lg border border-outline-variant p-4">
                  <div className="text-label-sm font-label-sm text-on-surface-variant mb-1">Total Clients</div>
                  <div className="text-headline-md font-headline-md text-primary">{totalClients}</div>
                </div>
                <div className="bg-surface rounded-lg border border-outline-variant p-4">
                  <div className="text-label-sm font-label-sm text-on-surface-variant mb-1">Total Commissions Earned</div>
                  <div className="text-headline-md font-headline-md text-primary">₹{totalCommissions.toLocaleString('en-IN')}</div>
                </div>
                <div className="bg-surface rounded-lg border border-outline-variant p-4">
                  <div className="text-label-sm font-label-sm text-on-surface-variant mb-1">Pending Commissions</div>
                  <div className="text-headline-md font-headline-md text-secondary">₹{pendingCommissions.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Account Meta */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-md">
            <h4 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-4 border-b border-surface-container-high pb-2">Account Meta</h4>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-body-sm font-body-sm text-on-surface-variant">Role</span>
                <span className="bg-secondary-container text-on-secondary-container text-label-sm font-label-sm px-2 py-1 rounded-full uppercase tracking-wider font-bold">Employee</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-sm font-body-sm text-on-surface-variant">Member Since</span>
                <span className="text-label-md font-label-md text-primary">{memberSince}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-sm font-body-sm text-on-surface-variant">Account Status</span>
                <span className="text-label-md font-label-md text-primary flex items-center gap-1">
                  {user.isBlocked ? (
                    <span className="text-error">Blocked</span>
                  ) : (
                    <>
                      Active
                      <span className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </>
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

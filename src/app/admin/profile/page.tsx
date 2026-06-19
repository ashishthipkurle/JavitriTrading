import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AvatarUpload from '@/components/AvatarUpload';


export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect('/login');
  if (authUser.role !== 'ADMIN') redirect('/dashboard');

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
  });

  if (!user) redirect('/login');

  const [firstName, ...lastNameParts] = (user.name || '').split(' ');
  const lastName = lastNameParts.join(' ');

  const memberSince = new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' }).format(new Date(user.createdAt));

  return (
    <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full">
      {/* Page Header */}
      <div className="mb-gutter">
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary tracking-tight">Admin Profile</h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant mt-1">View and manage your admin profile details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md md:p-unit-lg relative overflow-hidden hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)] transition-shadow">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-surface-tint opacity-20"></div>
            <div className="flex flex-col sm:flex-row justify-between items-start mb-unit-lg gap-4">
              <div className="flex flex-col sm:flex-row gap-gutter items-start sm:items-center">
                <AvatarUpload
                  currentAvatarUrl={user.avatarUrl}
                  userName={user.name || 'A'}
                />
                <div>
                  <h2 className="text-headline-md font-headline-md text-primary">Personal Details</h2>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Your admin identity details.</p>
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
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-md">
            <h4 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-4 border-b border-surface-container-high pb-2">Account Meta</h4>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-body-sm font-body-sm text-on-surface-variant">Role</span>
                <span className="bg-primary text-on-primary text-label-sm font-label-sm px-2 py-1 rounded-full uppercase tracking-wider font-bold">Admin</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-sm font-body-sm text-on-surface-variant">Member Since</span>
                <span className="text-label-md font-label-md text-primary">{memberSince}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

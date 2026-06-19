import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";


export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case "SUCCESS": return <span className="material-symbols-outlined">check_circle</span>;
      case "WARNING": return <span className="material-symbols-outlined">warning</span>;
      case "ERROR": return <span className="material-symbols-outlined">error</span>;
      default: return <span className="material-symbols-outlined">info</span>;
    }
  };

  const getIconBgClass = (type: string) => {
    switch (type) {
      case "SUCCESS": return "bg-primary-container text-on-primary-container";
      case "WARNING": return "bg-secondary-container text-on-secondary-container";
      case "ERROR": return "bg-error-container text-on-error-container";
      default: return "bg-surface-variant text-on-surface-variant";
    }
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop bg-surface min-h-full">
      <div className="max-w-container-max mx-auto">
        <header className="mb-unit-xl flex flex-col md:flex-row justify-between items-start md:items-end border-b border-outline-variant pb-unit-md gap-unit-md">
          <div>
            <h1 className="text-headline-xl font-headline-xl text-primary mb-unit-xs">Notifications</h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant">Stay updated with your account activities.</p>
          </div>
        </header>

        {/* Notifications List */}
        <div className="flex flex-col gap-unit-sm">
          {notifications.length === 0 ? (
            <div className="p-unit-xl text-center border border-outline-variant rounded-xl bg-surface-container-lowest">
              <span className="material-symbols-outlined text-[64px] text-outline mb-unit-md">notifications_off</span>
              <h3 className="text-headline-sm font-headline-sm text-primary mb-unit-xs">No Notifications</h3>
              <p className="text-body-md font-body-md text-on-surface-variant">You&apos;re all caught up! Check back later for updates.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id}
                className={`group relative border border-outline-variant rounded-xl p-unit-md flex gap-unit-md items-start transition-all ${notif.isRead ? 'bg-surface-container-lowest opacity-80' : 'bg-surface hover:shadow-[0px_4px_12px_rgba(10,22,40,0.04)]'}`}
              >
                {!notif.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"></div>
                )}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconBgClass(notif.type)}`}>
                  {getIconForType(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-label-md font-label-md ${!notif.isRead ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-label-sm font-label-sm text-on-surface-variant whitespace-nowrap ml-unit-sm">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

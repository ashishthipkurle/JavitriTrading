"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getUnreadCount, getNotifications, markAsRead, markAllAsRead } from "@/app/actions/notifications";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
};

export default function NotificationBell({ basePath }: { basePath: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    const count = await getUnreadCount();
    setUnreadCount(count);
    
    if (isOpen) {
      const data = await getNotifications(5);
      setNotifications(data as Notification[]);
    }
  };

  const handleToggle = async () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      const data = await getNotifications(5);
      setNotifications(data as Notification[]);
    }
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    fetchNotifications();
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "SUCCESS": return <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>;
      case "WARNING": return <span className="material-symbols-outlined text-secondary text-[20px]">warning</span>;
      case "ERROR": return <span className="material-symbols-outlined text-error text-[20px]">error</span>;
      default: return <span className="material-symbols-outlined text-primary text-[20px]">info</span>;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className="relative text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface flex items-center justify-center">
            {unreadCount > 9 && <span className="sr-only">9+</span>}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-outline-variant bg-surface-container-lowest">
            <h3 className="text-label-lg font-bold text-primary">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-label-sm text-primary hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[48px] opacity-20 mb-2">notifications_off</span>
                <p className="text-body-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`flex gap-3 p-4 border-b border-outline-variant transition-colors hover:bg-surface-container-lowest ${!notif.isRead ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getIconForType(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className={`text-label-md truncate ${!notif.isRead ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-label-sm text-outline flex-shrink-0">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className={`text-body-sm line-clamp-2 ${!notif.isRead ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                        {notif.message}
                      </p>
                      {!notif.isRead && (
                        <button 
                          onClick={(e) => handleMarkAsRead(notif.id, e)}
                          className="mt-2 text-label-sm text-primary hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Link 
            href={`${basePath}/notifications`}
            onClick={() => setIsOpen(false)}
            className="p-3 text-center border-t border-outline-variant text-label-md text-primary font-bold hover:bg-surface-container-low transition-colors"
          >
            View All Notifications
          </Link>
        </div>
      )}
    </div>
  );
}

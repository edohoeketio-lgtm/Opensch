"use client";

import { useState } from 'react';
import { Bell, Check, Trash2, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { markNotificationRead, markAllNotificationsRead } from '@/app/actions/notifications';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}

export default function NotificationPopover({ 
  initialNotifications = [], 
  initialUnreadCount = 0 
}: { 
  initialNotifications?: Notification[];
  initialUnreadCount?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  const handleMarkRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    await markNotificationRead(id);
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    await markAllNotificationsRead();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-8 h-8 rounded-full flex items-center justify-center hover:bg-admin-surface transition-colors text-[#AAAAAA] hover:text-surface"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-ink"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
             className="fixed inset-0 z-40" 
             onClick={() => setIsOpen(false)}
          ></div>
          
          <div className="absolute right-0 mt-3 w-80 md:w-96 bg-admin-surface border border-admin-border rounded-2xl shadow-2xl shadow-black/80 z-50 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-admin-border flex items-center justify-between shrink-0 bg-ink">
               <div className="flex items-center gap-2">
                 <h3 className="font-semibold text-surface">Notifications</h3>
                 {unreadCount > 0 && (
                   <span className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-white/5 text-admin-muted border border-admin-border">{unreadCount} New</span>
                 )}
               </div>
               {unreadCount > 0 && (
                 <button 
                   onClick={handleMarkAllRead}
                   className="text-[10px] font-semibold tracking-wider uppercase text-accent hover:text-white transition-colors"
                 >
                   Mark All Read
                 </button>
               )}
            </div>
            
            <div className="flex-1 overflow-y-auto w-full p-2 space-y-1">
              {notifications.length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center">
                   <div className="w-10 h-10 rounded-full bg-white/5 border border-admin-border flex items-center justify-center mb-3">
                     <Sparkles className="w-4 h-4 text-admin-muted" />
                   </div>
                   <p className="text-[13px] text-admin-muted">You're all caught up.</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div 
                    key={n.id} 
                    className={`relative p-4 rounded-xl border transition-colors group flex gap-3 items-start ${
                      n.isRead 
                        ? 'bg-transparent border-transparent hover:bg-white/5' 
                        : 'bg-white/5 border-admin-border shadow-md'
                    }`}
                  >
                     <div className="shrink-0 pt-0.5">
                       {n.type === 'alert' ? <AlertCircle className="w-4 h-4 text-rose-500" /> :
                        n.type === 'success' ? <Check className="w-4 h-4 text-emerald-500" /> :
                        n.type === 'warning' ? <ShieldAlert className="w-4 h-4 text-amber-500" /> :
                        <Bell className="w-4 h-4 text-[#B08D57]" />}
                     </div>
                     <div className="flex-1 flex flex-col gap-1 pr-6">
                        <span className={`text-[13px] leading-tight ${n.isRead ? 'text-admin-muted font-medium' : 'text-surface font-semibold'}`}>
                          {n.title}
                        </span>
                        <p className="text-[11px] text-admin-muted-dark leading-relaxed line-clamp-2">
                           {n.message}
                        </p>
                        <span className="text-[9px] uppercase tracking-widest text-[#555555] mt-1 font-semibold">
                           {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                     </div>
                     {!n.isRead && (
                       <button 
                         onClick={() => handleMarkRead(n.id)}
                         className="absolute top-4 right-4 text-admin-muted hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <Check className="w-3.5 h-3.5" />
                       </button>
                     )}
                     {!n.isRead && <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-accent group-hover:opacity-0 transition-opacity"></div>}
                  </div>
                ))
              )}
            </div>
            
            <div className="p-3 border-t border-admin-border bg-ink rounded-b-2xl">
              <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-admin-muted hover:text-surface rounded-xl text-[10px] uppercase tracking-widest font-semibold transition-colors">
                 View All History
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

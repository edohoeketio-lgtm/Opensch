"use client";

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Search, Bell, X, Target, BookOpen, MessageSquare, Award, AlertCircle, CheckCircle, Info, BellRing } from 'lucide-react';
import { CmdKPalette } from '../components/CmdKPalette';
import { Sidebar } from './components/Sidebar';
import { BottomMobileNav } from './components/BottomMobileNav';
import { ToastProvider } from './components/ToastContext';
import { getMyProfile } from '@/app/actions/settings';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/app/actions/notifications';
import Image from 'next/image';

const formatNotifTime = (date: Date) => {
  const diffInMinutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const getTypeConfig = (type: string) => {
  switch (type) {
    case 'warning': return { icon: AlertCircle, color: 'text-[#B08D57]', bg: 'bg-[#B08D57]/10' };
    case 'success': return { icon: CheckCircle, color: 'text-[#2E8B6C]', bg: 'bg-[#2E8B6C]/10' };
    case 'alert': return { icon: BellRing, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' };
    default: return { icon: Info, color: 'text-[#FFFFFF]', bg: 'bg-white/5' };
  }
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = true;
  
  if (!isAuthenticated) {
    redirect('/pricing');
  }

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = () => {
      getMyProfile().then(p => {
        if (p) setProfile(p);
      });
    };

    const fetchNotifs = async () => {
      try {
        const res = await getNotifications(10);
        setNotifications(res.notifications.map((n: any) => {
           const typeConfig = getTypeConfig(n.type);
           return {
             id: n.id,
             title: n.title,
             message: n.message,
             time: formatNotifTime(new Date(n.createdAt)),
             unread: !n.isRead,
             icon: typeConfig.icon,
             color: typeConfig.color,
             bg: typeConfig.bg,
             href: n.link || '#'
           }
        }));
        setUnreadCount(res.unreadCount);
      } catch (e) { console.error("Could not load notifications", e); }
    };

    fetchProfile();
    fetchNotifs();
    window.addEventListener('profileUpdated', fetchProfile);
    
    return () => {
      window.removeEventListener('profileUpdated', fetchProfile);
    };
  }, []);

  const handleMarkAllRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
    } catch(e) {}
  };

  const handleNotificationClick = async (id: string, currentlyUnread: boolean) => {
    setShowNotifications(false);
    if (!currentlyUnread) return;
    
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await markNotificationRead(id);
    } catch(e) {}
  };

  // Function to manually trigger CmdK palette via custom event
  const triggerSearch = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  return (
    <ToastProvider>
      <div className="flex bg-[#111111] text-[#FFFFFF] h-screen overflow-hidden font-sans selection:bg-white/30">
        <CmdKPalette />
      
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#111111]">
        
        {/* Top Utility Bar */}
        <header className="h-16 border-b border-[#2D2D2D] flex items-center justify-between px-4 md:px-8 shrink-0 bg-[#111111]/80 backdrop-blur-md z-50 sticky top-0">
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded bg-[#1C1C1E] border border-[#2D2D2D] text-[10px] font-semibold tracking-[0.2em] uppercase text-[#FFFFFF]">OS-C1</span>
            <span className="text-sm font-medium text-[#FFFFFF] hidden sm:block truncate">AI-Native Product Builder Cohort</span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
             {/* Search trigger */}
             <div 
               onClick={triggerSearch}
               className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 rounded-xl border border-[#2D2D2D] bg-white/5 text-xs font-medium cursor-pointer hover:bg-white/10 hover:border-[#2D2D2D] transition-all duration-300 text-[#FFFFFF]"
             >
                <Search className="w-4 h-4 md:w-3.5 md:h-3.5" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden sm:inline font-sans text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-[#FFFFFF] tracking-widest md:ml-4">⌘K</kbd>
             </div>
             
             {/* Notification */}
             <div className="relative">
               <button 

                 onClick={() => setShowNotifications(!showNotifications)}
                 className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors relative ${showNotifications ? 'bg-white/10 text-[#FFFFFF]' : 'hover:bg-[#1C1C1E] text-[#AAAAAA] hover:text-[#FFFFFF]'}`}
               >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#B08D57] ring-2 ring-[#111111]" />
                  )}
               </button>
               
               {/* Notification Popover */}
               {showNotifications && (
                 <div className="absolute top-full right-0 mt-2 w-80 rounded-2xl bg-[#111111] border border-[#2D2D2D] shadow-2xl overflow-hidden z-[100] animate-in slide-in-from-top-2 fade-in duration-200">
                   <div className="flex items-center justify-between px-4 py-3 border-b border-[#2D2D2D] bg-white/[0.02]">
                     <h3 className="text-[13px] font-semibold text-[#FFFFFF]">Notifications</h3>
                     {unreadCount > 0 && (
                       <button onClick={markAllNotificationsRead} className="text-[11px] font-medium text-[#888888] hover:text-[#FFFFFF] transition-colors">
                         Mark all read
                       </button>
                     )}
                   </div>
                   <div className="max-h-[360px] overflow-y-auto">
                     {notifications.length > 0 ? (
                       <div className="divide-y divide-[#2D2D2D]">
                         {notifications.map((notif) => (
                           <Link 
                             key={notif.id} 
                             href={notif.href}
                             onClick={() => handleNotificationClick(notif.id, notif.unread)}
                             className={`p-4 flex gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer relative block ${notif.unread ? 'bg-white/[0.01]' : ''}`}
                           >
                             {notif.unread && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#B08D57]" />}
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.bg} ${notif.color}`}>
                               <notif.icon className="w-4 h-4" />
                             </div>
                             <div className="flex-1 min-w-0">
                               <div className="flex items-start justify-between gap-2">
                                 <h4 className={`text-[13px] font-semibold truncate ${notif.unread ? 'text-[#FFFFFF]' : 'text-[#CCCCCC]'}`}>{notif.title}</h4>
                                 <span className="text-[10px] text-[#666666] whitespace-nowrap shrink-0">{notif.time}</span>
                               </div>
                               <p className="text-[12px] text-[#888888] leading-snug mt-0.5">{notif.message}</p>
                             </div>
                           </Link>
                         ))}
                       </div>
                     ) : (
                       <div className="py-8 px-4 text-center">
                         <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                           <Bell className="w-4 h-4 text-[#555555]" />
                         </div>
                         <p className="text-[13px] text-[#888888]">You&apos;re all caught up.</p>
                       </div>
                     )}
                   </div>
                 </div>
               )}
             </div>
             
             {/* Minimal Profile Escape Hatch */}
             <Link href="/settings" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1C1C1E] overflow-hidden relative cursor-pointer border border-[#2D2D2D] hover:border-[#2D2D2D] transition-all duration-300">
                {profile?.avatarUrl ? (
                  <Image width={600} height={600} src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover grayscale opacity-90 transition-all duration-500 hover:grayscale-0 hover:opacity-100" />
                ) : (
                  <span className="text-[10px] font-semibold text-[#888888]">{(profile?.fullName || 'S').charAt(0).toUpperCase()}</span>
                )}
             </Link>

             {/* Help & Support (Desktop Only) */}
             <Link href="/help" className="hidden md:flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border border-[#2D2D2D] bg-white/5 text-xs font-medium cursor-pointer hover:bg-white/10 hover:border-[#2D2D2D] transition-all duration-300 text-[#FFFFFF]">
                <div className="font-medium text-xs text-[#FFFFFF]">Help & Support</div>
                <div className="text-[10px] text-[#A0A0A0]">Docs & Assistance</div>
             </Link>
            
            {/* Mobile Header Menu (Settings / Logout) */}
            <div className="md:hidden relative flex items-center group">
               <button className="w-8 h-8 rounded-full bg-[#1C1C1E] flex items-center justify-center border border-[#2D2D2D] overflow-hidden">
                 {profile?.avatarUrl ? (
                   <Image width={32} height={32} src={profile.avatarUrl} alt="User" className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-[10px] font-bold text-[#FFFFFF]">{profile?.fullName ? profile.fullName.charAt(0) : 'S'}</span>
                 )}
               </button>
               
               {/* Mobile Profile Dropdown */}
               <div className="absolute top-10 right-0 w-48 bg-[#1C1C1E] border border-[#2D2D2D] rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1.5">
                  <div className="px-3 py-2 border-b border-[#2D2D2D]">
                     <div className="text-xs font-semibold text-[#FFFFFF]">{profile?.fullName || 'Student'}</div>
                     <div className="text-[10px] text-[#888888] flex items-center gap-1"><CheckCircle className="w-3 h-3 text-[#B08D57]" /> {profile?.role || 'Premium'}</div>
                  </div>
                  <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-xs text-[#FFFFFF] hover:bg-white/5 mx-1 my-1 rounded-lg">
                     <span>Profile Settings</span>
                  </Link>
                  <Link href="/portfolio" className="flex items-center gap-2 px-3 py-2 text-xs text-[#FFFFFF] hover:bg-white/5 mx-1 my-1 rounded-lg">
                     <span>My Portfolio</span>
                  </Link>
                  <button onClick={() => import('@/app/actions/auth').then(m => m.logOut())} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 mx-1 my-1 rounded-lg mt-1 border-t border-[#2D2D2D]">
                     <span>Log Out</span>
                  </button>
               </div>
            </div>

          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto w-full relative pb-20 md:pb-0">
          {children}
        </main>
        
        {/* Mobile Bottom Navigation Bar Tracker */}
        <BottomMobileNav />
      </div>

      </div>
    </ToastProvider>
  );
}

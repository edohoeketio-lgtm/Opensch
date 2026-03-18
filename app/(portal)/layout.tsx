"use client";

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Search, Bell, X, Target, BookOpen, MessageSquare, Award } from 'lucide-react';
import { CmdKPalette } from '../components/CmdKPalette';
import { Sidebar } from './components/Sidebar';
import { ToastProvider } from './components/ToastContext';

// Mock Notification Data based on architecture
const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'content', icon: BookOpen, title: 'New Module Released', message: "The 'Data Layer' module is now available.", time: '2m ago', unread: true, color: 'text-[#B08D57]', bg: 'bg-[#B08D57]/10', href: '/curriculum' },
  { id: 2, type: 'admin', icon: Target, title: 'Deliverable Graded', message: "Your 'OAuth Flow' deliverable has been reviewed.", time: '1h ago', unread: true, color: 'text-[#2E8B6C]', bg: 'bg-[#2E8B6C]/10', href: '/portfolio' },
  { id: 3, type: 'social', icon: MessageSquare, title: 'Peer Reply', message: "Sarah replied to your question about middleware.", time: '3h ago', unread: false, color: 'text-[#FFFFFF]', bg: 'bg-white/5', href: '/feed' },
  { id: 4, type: 'system', icon: Award, title: 'Platform Update', message: "We've shipped the new Portfolio layout. Check it out.", time: '1d ago', unread: false, color: 'text-[#FFFFFF]', bg: 'bg-white/5', href: '/portfolio' },
];

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
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    setShowNotifications(false);
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
        <header className="h-16 border-b border-[#2D2D2D] flex items-center justify-between px-8 shrink-0 bg-[#111111]/80 backdrop-blur-md z-50 sticky top-0">
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded bg-[#1C1C1E] border border-[#2D2D2D] text-[10px] font-semibold tracking-[0.2em] uppercase text-[#FFFFFF]">FS·C3</span>
            <span className="text-sm font-medium text-[#FFFFFF]">AI-Native Product Builder Cohort</span>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Search trigger */}
             <div 
               onClick={triggerSearch}
               className="flex items-center gap-3 px-3 py-1.5 rounded-xl border border-[#2D2D2D] bg-white/5 text-xs font-medium cursor-pointer hover:bg-white/10 hover:border-[#2D2D2D] transition-all duration-300 text-[#FFFFFF]"
             >
                <Search className="w-3.5 h-3.5" />
                <span>Search...</span>
                <kbd className="font-sans text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-[#FFFFFF] tracking-widest ml-4">⌘K</kbd>
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
                       <button onClick={markAllRead} className="text-[11px] font-medium text-[#888888] hover:text-[#FFFFFF] transition-colors">
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
                             onClick={() => handleNotificationClick(notif.id)}
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
             <Link href="/settings" className="w-8 h-8 rounded-full bg-[#1C1C1E] overflow-hidden relative cursor-pointer border border-[#2D2D2D] hover:border-[#2D2D2D] transition-all duration-300">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Maurice&backgroundColor=transparent" alt="Avatar" className="w-full h-full object-cover grayscale opacity-90 transition-all duration-500 hover:grayscale-0 hover:opacity-100" />
             </Link>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto relative bg-[#111111]">
          {children}
        </main>
      </div>

      </div>
    </ToastProvider>
  );
}

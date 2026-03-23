"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, Users, Video, Settings, 
  MessageSquare, BarChart, Bell, GraduationCap, 
  Mail, ClipboardList, Calendar, LogOut, Wallet, LayoutDashboard
} from "lucide-react";

export function MobileAdminDrawer({ userRole }: { userRole: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Cohort Builder", href: "/admin/curriculum", icon: GraduationCap },
    { name: "Review Queue", href: "/admin/reviews", icon: MessageSquare },
    { name: "Student Roster", href: "/admin/roster", icon: Users },
    { name: "Admissions Pipeline", href: "/admin/admissions", icon: ClipboardList, adminOnly: true },
    { name: "Live Ops HQ", href: "/admin/live-ops", icon: Calendar },
    { name: "Cohort Revenue", href: "/admin/revenue", icon: Wallet, adminOnly: true },
    { name: "Broadcasts", href: "/admin/broadcasts", icon: Bell, adminOnly: true },
    { name: "Faculty Invites", href: "/admin/instructors", icon: Mail, adminOnly: true },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart, adminOnly: true },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ].filter(item => userRole === 'ADMIN' || !(item as any).adminOnly);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-admin-border text-surface hover:bg-white/10 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
          <div className="relative w-[280px] h-full bg-ink flex flex-col border-r border-admin-border shadow-2xl animate-in slide-in-from-left duration-300">
             <button 
               onClick={() => setIsOpen(false)}
               className="absolute top-4 -right-12 w-10 h-10 flex items-center justify-center rounded-xl bg-ink border border-admin-border text-surface shadow-xl"
             >
               <X className="w-5 h-5" />
             </button>

             {/* Header */}
             <div className="p-8 pb-6 flex items-center">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-[#F5F2EB] flex items-center justify-center shrink-0">
                      <span className="font-bold text-[#0B0B0C] text-sm">OS</span>
                   </div>
                   <div className="flex flex-col overflow-hidden">
                      <span className="font-bold tracking-tight text-xl text-surface whitespace-nowrap leading-none">
                        OpenSch
                      </span>
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mt-1.5">
                        Admin
                      </span>
                   </div>
                </div>
             </div>

             {/* Links */}
             <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
               {navItems.map((item) => {
                 const isActive = pathname === item.href;
                 const Icon = item.icon;
                 return (
                   <Link
                     key={item.href}
                     href={item.href}
                     onClick={() => setIsOpen(false)}
                     className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 group ${
                       isActive 
                         ? 'bg-admin-surface text-surface border border-admin-border cursor-default' 
                         : 'hover:bg-white/5 text-admin-muted-dark hover:text-surface border border-transparent cursor-pointer'
                     }`}
                   >
                     <Icon className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isActive ? 'text-surface' : 'group-hover:text-surface'}`} />
                     <span className="font-medium text-sm tracking-wide whitespace-nowrap">{item.name}</span>
                   </Link>
                 );
               })}
             </nav>

             {/* Exit */}
             <div className="p-4 mt-auto">
                <Link href="/dashboard" className="block p-4 rounded-2xl bg-transparent border border-admin-border hover:bg-white/5 transition-colors duration-300 cursor-pointer group flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-admin-surface overflow-hidden relative border border-admin-border shrink-0 flex items-center justify-center">
                         <span className="text-sm font-bold text-surface">AD</span>
                      </div>
                      <div className="flex flex-col whitespace-nowrap">
                         <span className="text-sm font-medium text-surface/90 group-hover:text-surface tracking-tight">Return to Portal</span>
                         <span className="text-[10px] text-admin-muted font-semibold tracking-[0.1em] uppercase mt-0.5">Exit Admin</span>
                      </div>
                   </div>
                   <LogOut className="w-4 h-4 text-admin-muted group-hover:text-accent transition-colors shrink-0" />
                </Link>
             </div>

          </div>
        </div>
      )}
    </>
  );
}

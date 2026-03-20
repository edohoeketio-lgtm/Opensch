"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  Video, 
  Settings, 
  MessageSquare, 
  BarChart, 
  Bell, 
  GraduationCap, 
  Mail, 
  ClipboardList,
  Calendar,
  ChevronRight, 
  ChevronLeft, 
  LogOut,
  Wallet
} from "lucide-react";

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Cohort Builder", href: "/admin/curriculum", icon: GraduationCap },
    { name: "Review Queue", href: "/admin/reviews", icon: MessageSquare },
    { name: "Student Roster", href: "/admin/roster", icon: Users },
    { name: "Admissions Pipeline", href: "/admin/admissions", icon: ClipboardList },
    { name: "Live Ops HQ", href: "/admin/live-ops", icon: Calendar },
    { name: "Cohort Revenue", href: "/admin/revenue", icon: Wallet },
    { name: "Broadcasts", href: "/admin/broadcasts", icon: Bell },
    { name: "Faculty Invites", href: "/admin/instructors", icon: Mail },
    { name: "Resources", href: "/admin/resources", icon: Video },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className={`border-r border-admin-border hidden md:flex flex-col bg-ink transition-all duration-300 relative ${isCollapsed ? 'w-[88px]' : 'w-72'}`}>
      
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-admin-surface-hover border border-admin-border flex items-center justify-center text-[#9CA3AF] hover:text-surface hover:bg-admin-surface transition-colors z-20 shadow-md shadow-black/50"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Logo Area */}
      <div className={`p-8 pb-6 flex items-center ${isCollapsed ? 'px-6 justify-center' : ''}`}>
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-[#F5F2EB] flex items-center justify-center shrink-0">
              <span className="font-bold text-[#0B0B0C] text-sm">OS</span>
           </div>
           {!isCollapsed && (
             <div className="flex flex-col overflow-hidden">
                <span className="font-bold tracking-tight text-xl text-surface whitespace-nowrap transition-all duration-300 leading-none">
                  OpenSch
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mt-1.5">
                  Admin
                </span>
             </div>
           )}
        </div>
      </div>

      {/* Navigation Area */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 py-2.5 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-admin-surface text-surface border border-admin-border cursor-default' 
                  : 'hover:bg-white/5 text-admin-muted-dark hover:text-surface border border-transparent cursor-pointer'
              } ${isCollapsed ? 'justify-center px-0' : 'px-3'}`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isActive ? 'text-surface' : 'group-hover:text-surface'}`} />
              {!isCollapsed && <span className="font-medium text-sm tracking-wide whitespace-nowrap">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Admin Profile Widget */}
      <div className={`p-4 mt-auto ${isCollapsed ? 'px-3' : ''}`}>
         <Link href="/dashboard" className={`block p-4 rounded-2xl bg-transparent border border-admin-border hover:bg-white/5 transition-colors duration-300 cursor-pointer group flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-admin-surface overflow-hidden relative border border-admin-border shrink-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-surface">AD</span>
               </div>
               {!isCollapsed && (
                 <div className="flex flex-col whitespace-nowrap">
                    <span className="text-sm font-medium text-surface/90 group-hover:text-surface transition-colors tracking-tight">Return to Portal</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <span className="text-[10px] text-admin-muted font-semibold tracking-[0.1em] uppercase">Exit Admin</span>
                    </div>
                 </div>
               )}
            </div>
            {!isCollapsed && <LogOut className="w-4 h-4 text-admin-muted group-hover:text-accent transition-colors shrink-0" />}
         </Link>
      </div>
    </aside>
  );
}

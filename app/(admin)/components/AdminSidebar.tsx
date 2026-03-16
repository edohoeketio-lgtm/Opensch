"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Command, Blocks, Inbox, Users, Megaphone, ChevronRight, CheckCircle, ChevronLeft, LogOut } from 'lucide-react';

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Command Center', href: '/admin', icon: Command },
    { name: 'Course Builder', href: '/admin/curriculum', icon: Blocks },
    { name: 'Review Queue', href: '/admin/reviews', icon: Inbox },
    { name: 'Student Roster', href: '/admin/roster', icon: Users },
    { name: 'Broadcasts', href: '/admin/broadcasts', icon: Megaphone },
  ];

  return (
    <aside className={`border-r border-[#2D2D2D] hidden md:flex flex-col bg-[#111111] transition-all duration-300 relative ${isCollapsed ? 'w-[88px]' : 'w-72'}`}>
      
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-[#1D1D21] border border-[#2D2D2D] flex items-center justify-center text-[#9CA3AF] hover:text-[#FFFFFF] hover:bg-[#1C1C1E] transition-colors z-20 shadow-md shadow-black/50"
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
                <span className="font-bold tracking-tight text-xl text-[#FFFFFF] whitespace-nowrap transition-all duration-300 leading-none">
                  OpenSch
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B08D57] mt-1.5">
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
                  ? 'bg-[#1C1C1E] text-[#FFFFFF] border border-[#2D2D2D] cursor-default' 
                  : 'hover:bg-white/5 text-[#525252] hover:text-[#FFFFFF] border border-transparent cursor-pointer'
              } ${isCollapsed ? 'justify-center px-0' : 'px-3'}`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isActive ? 'text-[#FFFFFF]' : 'group-hover:text-[#FFFFFF]'}`} />
              {!isCollapsed && <span className="font-medium text-sm tracking-wide whitespace-nowrap">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Admin Profile Widget */}
      <div className={`p-4 mt-auto ${isCollapsed ? 'px-3' : ''}`}>
         <Link href="/dashboard" className={`block p-4 rounded-2xl bg-transparent border border-[#2D2D2D] hover:bg-white/5 transition-colors duration-300 cursor-pointer group flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-[#1C1C1E] overflow-hidden relative border border-[#2D2D2D] shrink-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#FFFFFF]">AD</span>
               </div>
               {!isCollapsed && (
                 <div className="flex flex-col whitespace-nowrap">
                    <span className="text-sm font-medium text-[#FFFFFF]/90 group-hover:text-[#FFFFFF] transition-colors tracking-tight">Return to Portal</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <span className="text-[10px] text-[#888888] font-semibold tracking-[0.1em] uppercase">Exit Admin</span>
                    </div>
                 </div>
               )}
            </div>
            {!isCollapsed && <LogOut className="w-4 h-4 text-[#888888] group-hover:text-[#B08D57] transition-colors shrink-0" />}
         </Link>
      </div>
    </aside>
  );
}

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, MessageSquare, Briefcase, ChevronRight, CheckCircle, ChevronLeft, Award, Calendar, Bookmark } from 'lucide-react';
import { getMyProfile } from '@/app/actions/settings';
import Image from 'next/image';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState<{ fullName: string | null, avatarUrl: string, role: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchProfile = () => {
      getMyProfile().then(p => {
        if (p) setProfile(p);
      });
    };

    fetchProfile();
    window.addEventListener('profileUpdated', fetchProfile);
    
    return () => {
      window.removeEventListener('profileUpdated', fetchProfile);
    };
  }, []);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Live Calendar', href: '/calendar', icon: Calendar },
    { name: 'Curriculum', href: '/curriculum', icon: BookOpen },
    { name: 'Knowledge Vault', href: '/resources', icon: Bookmark },
    { name: 'Campus Feed', href: '/feed', icon: MessageSquare },
    { name: 'My Portfolio', href: '/portfolio', icon: Award },
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
              <span className="font-bold text-[#0B0B0C] text-sm">O</span>
           </div>
           {!isCollapsed && (
             <span className="font-bold tracking-tight text-xl text-[#FFFFFF] whitespace-nowrap overflow-hidden transition-all duration-300">
                OpenSch
             </span>
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

      {/* Admin Mode Toggle (Visible for ADMIN and INSTRUCTOR) */}
      {profile?.role && ['ADMIN', 'INSTRUCTOR'].includes(profile.role) && (
        <div className={`px-4 pb-2 ${isCollapsed ? 'px-3' : ''}`}>
          <Link 
            href="/admin" 
            className={`flex items-center gap-3 py-2.5 rounded-xl transition-all duration-300 group bg-[#B08D57]/10 text-[#B08D57] hover:bg-[#B08D57]/20 border border-[#B08D57]/30 cursor-pointer shadow-[0_0_10px_rgba(176,141,87,0.1)] ${isCollapsed ? 'justify-center px-0' : 'px-3'}`}
          >
            <Briefcase className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-semibold text-xs tracking-[0.1em] uppercase whitespace-nowrap">Command Center</span>}
          </Link>
        </div>
      )}

      {/* Pinned User Profile & Logout Widget */}
      <div className={`p-4 mt-auto space-y-2 ${isCollapsed ? 'px-3' : ''}`}>
         <Link href="/settings" className={`block p-3 rounded-2xl bg-[#1C1C1E]/50 border border-[#2D2D2D] hover:bg-[#1C1C1E] transition-colors duration-300 cursor-pointer group flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-[#111111] overflow-hidden relative border border-[#2D2D2D] shrink-0">
                  {profile && <Image width={600} height={600} src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-500" />}
               </div>
               {!isCollapsed && (
                 <div className="flex flex-col whitespace-nowrap">
                    <span className="text-sm font-medium text-[#FFFFFF]/90 group-hover:text-[#FFFFFF] transition-colors tracking-tight">
                      {profile?.fullName ? `${profile.fullName.split(' ')[0]} ${profile.fullName.split(' ').slice(1).join(' ').charAt(0) ? profile.fullName.split(' ').slice(1).join(' ').charAt(0) + '.' : ''}`.trim() : "Scholar"}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <CheckCircle className="w-3.5 h-3.5 text-[#B08D57]" />
                       <span className="text-[10px] text-[#888888] font-semibold tracking-[0.1em] uppercase">{profile?.role || "Premium"}</span>
                    </div>
                 </div>
               )}
            </div>
            {!isCollapsed && <ChevronRight className="w-4 h-4 text-[#888888] group-hover:text-[#B08D57] transition-colors shrink-0" />}
         </Link>
      </div>
    </aside>
  );
}

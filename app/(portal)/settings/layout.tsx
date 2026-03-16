"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Bell } from 'lucide-react';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Profile', href: '/settings', icon: User },
    { name: 'Notifications', href: '/settings/notifications', icon: Bell },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-transparent">
      <div className="max-w-[1000px] mx-auto px-8 py-12">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#FFFFFF] tracking-tight mb-2">Account Settings</h1>
          <p className="text-[#D1D5DB]">Manage your profile and notification preferences.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Settings Navigation Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-white/10 text-[#FFFFFF] font-semibold' 
                        : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#FFFFFF] font-medium'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFFFFF]' : 'text-[#888888]'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Settings Main Content Area */}
          <main className="flex-1 max-w-3xl">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}

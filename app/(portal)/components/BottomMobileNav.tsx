"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, BookOpen, Bookmark, MessageSquare } from 'lucide-react';

export function BottomMobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Curriculum', href: '/curriculum', icon: BookOpen },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Resources', href: '/resources', icon: Bookmark },
    { name: 'Feed', href: '/feed', icon: MessageSquare },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#111111]/90 backdrop-blur-xl border-t border-[#2D2D2D] z-50 pb-safe">
      <div className="flex items-center justify-around px-2 py-3 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-14 ${
                isActive ? 'text-[#B08D57]' : 'text-[#888888] hover:text-[#FFFFFF]'
              } transition-colors`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
              <span className="text-[9px] font-medium tracking-wide mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

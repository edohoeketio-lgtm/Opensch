"use client";

import { useTimeGreeting, extractLastName } from "@/lib/utils/time";

export default function AdminHeader({ fullName, email }: { fullName: string | null, email: string }) {
  const lastName = extractLastName(fullName);
  const greeting = useTimeGreeting(lastName);

  // Derive initials for the avatar
  const initials = fullName 
    ? fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : email.substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-[22px] font-semibold tracking-[-0.02em] text-surface flex items-center gap-2">
          {greeting} <span className="opacity-40">·</span> Command Center
        </h1>
        <p className="text-gray-300 text-[13px] leading-relaxed">Mission control for live cohorts. Prioritize interventions and unblock students.</p>
      </div>
      
      <div className="flex items-center gap-3 bg-admin-surface border border-admin-border rounded-full pl-2 pr-4 py-1.5 shadow-xl shadow-black/20 w-fit">
         <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs font-bold tracking-wider">
            {initials}
         </div>
         <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-surface leading-tight">{fullName || "Admin"}</span>
            <span className="text-[9px] font-medium text-admin-muted uppercase tracking-[0.1em]">{email}</span>
         </div>
      </div>
    </div>
  );
}

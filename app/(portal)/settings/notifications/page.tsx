"use client";

import { Save, BellRing, Mail, AppWindow } from 'lucide-react';

export default function NotificationSettingsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-bold text-[#FFFFFF] tracking-tight mb-6">Notification Preferences</h2>
        
        <form className="space-y-8">
          {/* Email Notifications Segment */}
          <div>
             <div className="flex items-center gap-3 mb-4 pb-2 border-b border-[#2D2D2D]">
                <Mail className="w-5 h-5 text-[#B08D57]" />
                <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-[0.1em]">Email Notifications</h3>
             </div>
             
             <div className="space-y-4 max-w-2xl">
                {[
                  { title: "Product Updates", desc: "Get notified about new features and platform improvements." },
                  { title: "Cohort Announcements", desc: "Important updates from your instructor or TA." },
                  { title: "Forum Replies", desc: "When someone replies directly to your post in the Campus Forum." },
                  { title: "Mentions", desc: "When someone @mentions you anywhere on the platform." }
                ].map((item, i) => (
                  <label key={i} className="flex items-start justify-between cursor-pointer group">
                     <div>
                        <div className="text-sm font-bold text-[#FFFFFF] tracking-tight group-hover:text-blue-400 transition-colors">{item.title}</div>
                        <div className="text-xs text-[#9CA3AF] mt-0.5">{item.desc}</div>
                     </div>
                     <div className="relative inline-flex items-center mx-4 mt-1">
                        <input type="checkbox" className="sr-only peer" defaultChecked={i !== 0} />
                        <div className="w-9 h-5 bg-[#1C1C1E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] border border-[#2D2D2D] after:bg-[#A7A29A] peer-checked:after:bg-[#050505] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F5F2EB] peer-checked:border-[#F5F2EB]"></div>
                     </div>
                  </label>
                ))}
             </div>
          </div>

          {/* In-App Notifications Segment */}
          <div>
             <div className="flex items-center gap-3 mb-4 pb-2 border-b border-[#2D2D2D]">
                <AppWindow className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-[0.1em]">In-App Alerts</h3>
             </div>
             
             <div className="space-y-4 max-w-2xl">
                {[
                  { title: "Forum Replies", desc: "Receive a bell notification when someone replies to you." },
                  { title: "Direct Mentions", desc: "Receive a bell notification for @mentions." },
                  { title: "Deliverable Graded", desc: "Get notified immediately when an instructor grades your work." }
                ].map((item, i) => (
                  <label key={i} className="flex items-start justify-between cursor-pointer group">
                     <div>
                        <div className="text-sm font-bold text-[#FFFFFF] tracking-tight group-hover:text-blue-400 transition-colors">{item.title}</div>
                        <div className="text-xs text-[#9CA3AF] mt-0.5">{item.desc}</div>
                     </div>
                     <div className="relative inline-flex items-center mx-4 mt-1">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-[#1C1C1E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] border border-[#2D2D2D] after:bg-[#A7A29A] peer-checked:after:bg-[#050505] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F5F2EB] peer-checked:border-[#F5F2EB]"></div>
                     </div>
                  </label>
                ))}
             </div>
          </div>

          <div className="pt-8">
            <button type="button" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F5F2EB] hover:bg-white text-[#050505] text-xs font-bold uppercase tracking-[0.1em] transition-all shadow-[0_0_15px_rgba(245,242,235,0.15)]">
              <Save className="w-4 h-4" />
              Save Preferences
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

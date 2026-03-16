"use client";

import { MessageSquare, Target, Award, ArrowUpRight, CheckCircle2, HelpCircle, BookOpen, Video, Link as LinkIcon, ChevronUp, ChevronDown, Flame, Calendar, Users, PenTool, Lightbulb, Bell, FileText, Bookmark, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { ClientFeed } from './ClientFeed';

import { MOCK_FEED_ITEMS } from '@/lib/mock-data';

export default function CampusFeedPage() {
  const feedItems = MOCK_FEED_ITEMS;

  return (
    <div className="flex-1 overflow-y-auto bg-transparent relative">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-[#FFFFFF] tracking-tight">Campus Activity</h1>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span> Live</span>
          </div>
          <p className="text-[15px] font-medium text-[#9CA3AF]">High-signal discussions, peer review, and continuous learning from your cohort.</p>
        </header>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Feed Column */}
          <ClientFeed initialItems={feedItems} />

          {/* Right Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
             
            {/* Active Sprint Goals */}
            <div className="p-6 rounded-2xl bg-[#1C1C1E] border border-[#2D2D2D]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[11px] font-bold text-[#A6A197] uppercase tracking-widest">Active Sprint</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#2E8B6C]/10 text-[#2E8B6C]">LIVE</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-[#FFFFFF] font-semibold text-sm mb-1">Sprint 3: Stateful Applications</div>
                  <div className="text-xs text-[#888888] flex items-center justify-between">
                     <span>Ends in 3 days</span>
                     <span className="text-[#A6A197]">65% Cohort Completion</span>
                  </div>
                </div>
                {/* Progress bar visual */}
                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                   <div className="h-full bg-[#B08D57] rounded-full" style={{ width: '65%' }}></div>
                </div>
                
                <div className="pt-4 border-t border-[#2D2D2D]">
                   <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider mb-2 block">Key Deliverables</span>
                   <ul className="space-y-2">
                     <li className="flex items-start gap-2 text-xs text-[#A6A197]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] mt-1.5 shrink-0"></span>
                        OAuth Integration via Supabase
                     </li>
                     <li className="flex items-start gap-2 text-xs text-[#A6A197]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] mt-1.5 shrink-0"></span>
                        Relational Database Schema Design
                     </li>
                   </ul>
                </div>
              </div>
            </div>

            {/* Instructor Notes */}
            <div className="p-6 rounded-2xl bg-[#1C1C1E] border border-[#2D2D2D] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B08D57]/5 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
              <h3 className="text-[11px] font-bold text-[#A6A197] uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Bookmark className="w-3 h-3 text-[#B08D57]" />
                 Faculty Note
              </h3>
              <div className="space-y-3 relative z-10">
                <p className="text-sm text-[#FFFFFF] leading-relaxed">
                  "Seeing a lot of struggles with React Server Components this sprint. Remember: keep your boundaries explicit. Only use 'use client' at the absolute leaves of your tree."
                </p>
                <div className="flex items-center gap-2 pt-2">
                   <div className="w-6 h-6 rounded-full bg-[#B08D57]/20 flex items-center justify-center">
                     <span className="text-[#B08D57] font-bold text-[10px]">ME</span>
                   </div>
                   <span className="text-xs font-medium text-[#A6A197]">Maurice E., Lead Instructor</span>
                </div>
              </div>
            </div>



          </div>

        </div>
      </div>
    </div>
  );
}

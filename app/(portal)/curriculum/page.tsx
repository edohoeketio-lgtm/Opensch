"use client";

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Play, Lock, ChevronRight, BookOpen, Clock, FileText } from 'lucide-react';
import { CURRICULUM_WEEKS } from '@/lib/content';

export default function CurriculumPage() {
  const currentActiveWeek = 3;
  const currentActiveSprintIndex = 3; // 1-indexed (e.g., Hooking up Authentication Flows is the 3rd sprint in Week 3)
  
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([currentActiveWeek]);

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks(prev => 
      prev.includes(weekNum) 
        ? prev.filter(w => w !== weekNum)
        : [...prev, weekNum]
    );
  };

  return (
    <div className="p-8 md:p-14 max-w-[1000px] mx-auto text-[#FFFFFF] pb-32">
      {/* Header */}
      <header className="mb-14 flex flex-col items-start border-b border-[#2D2D2D] pb-8">
        <h1 className="text-2xl md:text-[28px] font-semibold tracking-[-0.02em] text-[#FFFFFF] leading-tight mb-2">Curriculum Map</h1>
        <p className="text-[#D1D5DB] text-[14px] leading-relaxed max-w-2xl">
          The complete roadmap for the AI-Native Product Builder Cohort. Track your progress, revisit past modules, and prepare for upcoming sprints.
        </p>
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[#2D2D2D] w-full">
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] font-semibold mb-1">Overall Progress</span>
                <span className="text-lg font-medium text-[#FFFFFF]">60%</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] font-semibold mb-1">Time Invested</span>
                <span className="text-lg font-medium text-[#FFFFFF]">42.5 hrs</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] font-semibold mb-1">Next Milestone</span>
                <span className="text-lg font-medium text-[#FFFFFF]">Auth Gates (Sprint 3)</span>
            </div>
        </div>
      </header>

      {/* Curriculum Timeline */}
      <div className="space-y-8 relative">
        {/* Connection Line Behind Modules */}
        <div className="absolute left-10 top-10 bottom-10 w-px bg-white/5 z-0 hidden md:block"></div>

        {CURRICULUM_WEEKS.map((week) => {
          const isMastered = week.number < currentActiveWeek;
          const isActive = week.number === currentActiveWeek;
          const isLocked = week.number > currentActiveWeek;
          
          const isExpanded = expandedWeeks.includes(week.number);
          
          // Flatten all lessons across all modules into a single sequential list of sprints
          const allSprints = week.modules.flatMap(m => m.lessons);

          return (
            <section key={week.number} className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 group">
               {/* Timeline Node */}
               <div className="hidden md:flex flex-col items-center pt-8">
                  {isMastered && (
                     <div className="w-20 h-20 rounded-full bg-[#1C1C1E] border border-emerald-500/20 flex items-center justify-center shrink-0 z-10 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <CheckCircle className="w-8 h-8 text-emerald-500/80" />
                     </div>
                  )}
                  {isActive && (
                     <div className="w-20 h-20 rounded-full bg-[#1D1D21] border border-[#B08D57]/30 flex items-center justify-center shrink-0 z-10 shadow-[0_0_20px_rgba(176,141,87,0.15)] relative">
                        <div className="absolute inset-0 rounded-full border border-[#B08D57] animate-ping opacity-20"></div>
                        <BookOpen className="w-7 h-7 text-[#B08D57]" />
                     </div>
                  )}
                  {isLocked && (
                     <div className="w-20 h-20 rounded-full bg-[#111111] border border-[#2D2D2D] border-dashed flex items-center justify-center shrink-0 z-10">
                        <Lock className="w-6 h-6 text-[#888888]" />
                     </div>
                  )}
               </div>
               
               {/* Content Card */}
               <div className={`flex-1 rounded-2xl border flex flex-col relative overflow-hidden transition-all duration-500
                  ${isActive ? 'bg-[#1C1C1E] border-[#2D2D2D] shadow-2xl shadow-black/50 p-8' : ''}
                  ${isMastered ? 'bg-[#111111] border-[#2D2D2D] p-8 opacity-70 hover:opacity-100' : ''}
                  ${isLocked ? 'bg-transparent border-dashed border-[#2D2D2D] p-8 opacity-40' : ''}
               `}>
                  
                  {isActive && (
                     <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#B08D57] to-transparent z-30 opacity-80"></div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4 relative z-20">
                     <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${isActive ? 'text-[#B08D57]' : 'text-[#9CA3AF]'}`}>
                        Week {week.number} {isActive && '· Current Focus'}
                     </span>
                     
                     {isMastered && (
                        <span className="text-[11px] text-[#888888] font-medium px-2 py-1 rounded bg-white/5 flex items-center gap-1.5">
                           <CheckCircle className="w-3.5 h-3.5" /> Mastered
                        </span>
                     )}
                     {isActive && (
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#FFFFFF] px-2 py-1 rounded bg-[#B08D57]/20 border border-[#B08D57]/30 flex items-center gap-1.5">
                           <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57]"></span> In Progress
                        </span>
                     )}
                     {isLocked && (
                        <span className="text-[11px] text-[#888888] font-medium px-2 py-1 rounded bg-white/5 flex items-center gap-1.5">
                           <Lock className="w-3.5 h-3.5" /> Locked
                        </span>
                     )}
                  </div>
                  
                  <h2 className={`text-xl md:text-2xl font-semibold tracking-[-0.01em] mb-3 relative z-20 ${isLocked ? 'text-[#9CA3AF]' : 'text-[#FFFFFF]'}`}>
                     {week.title}
                  </h2>
                  <p className={`text-[13px] md:text-[14px] leading-relaxed mb-6 md:mb-8 max-w-xl relative z-20 ${isLocked ? 'text-[#888888]' : 'text-[#D1D5DB]'}`}>
                     {week.goal}
                  </p>
                  
                  {/* Expanded Sprints List */}
                  {isExpanded && !isLocked && (
                     <div className="bg-[#1C1C1E] rounded-xl border border-[#2D2D2D] flex flex-col relative z-20 mt-2 mb-6 shadow-inner overflow-hidden">
                        {allSprints.map((sprint, idx) => {
                           const sprintNumber = idx + 1;
                           const isSprintMastered = isMastered || (isActive && sprintNumber < currentActiveSprintIndex);
                           const isSprintActive = isActive && sprintNumber === currentActiveSprintIndex;
                           const isSprintLocked = isActive && sprintNumber > currentActiveSprintIndex;

                           const sprintUrl = `/course/ai-product-builder/module/${week.number}/lesson/${sprintNumber}`;

                           if (isSprintMastered) {
                              return (
                                 <Link key={idx} href={sprintUrl} className="p-4 border-b border-[#2D2D2D] flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                       <CheckCircle className="w-4 h-4 text-[#9CA3AF] group-hover:text-emerald-500/70 transition-colors" />
                                       <span className="text-sm font-medium text-[#9CA3AF] group-hover:text-[#FFFFFF] transition-colors">
                                          {sprintNumber}. {sprint.title}
                                       </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                       <span className="text-xs text-[#888888] hidden sm:block">Mastered</span>
                                       <ChevronRight className="w-4 h-4 text-[#888888] group-hover:text-[#9CA3AF] transition-colors" />
                                    </div>
                                 </Link>
                              );
                           }

                           if (isSprintActive) {
                              return (
                                 <Link key={idx} href={sprintUrl} className="p-4 border-b border-[#B08D57]/20 bg-[#1D1D21] flex items-center justify-between cursor-pointer hover:bg-[#252529] transition-colors group">
                                    <div className="flex items-center gap-4">
                                       <div className="w-6 h-6 rounded-full bg-[#B08D57] flex items-center justify-center -ml-1 shrink-0">
                                          <Play className="w-3 h-3 text-[#121214] ml-0.5 fill-current" />
                                       </div>
                                       <div className="flex flex-col">
                                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B08D57] mb-0.5">Resume Learning</span>
                                          <span className="text-sm font-medium text-[#FFFFFF] tracking-tight">{sprintNumber}. {sprint.title}</span>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                       <span className="text-xs text-[#FFFFFF] font-medium hidden sm:block">Up Next</span>
                                       <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#FFFFFF] transition-colors" />
                                    </div>
                                 </Link>
                              );
                           }

                           if (isSprintLocked) {
                              return (
                                 <div key={idx} className="p-4 border-b border-[#2D2D2D] flex items-center justify-between opacity-50 cursor-not-allowed bg-[#111111]">
                                    <div className="flex items-center gap-4">
                                       <Lock className="w-4 h-4 text-[#888888]" />
                                       <span className="text-sm font-medium text-[#888888]">{sprintNumber}. {sprint.title}</span>
                                    </div>
                                 </div>
                              );
                           }
                        })}
                     </div>
                  )}
                  
                  {/* Action Bar / Toggle */}
                  <div className={`mt-auto pt-5 border-t border-[#2D2D2D] flex justify-between items-center text-[12px] font-medium text-[#888888] ${isActive ? 'mt-4' : ''}`}>
                     {!isLocked ? (
                        <>
                           <span>{week.modules.length} Modules • {allSprints.length} Sprints • 1 Deliverable</span>
                           <button onClick={() => toggleWeek(week.number)} className="hover:text-[#FFFFFF] transition-colors flex items-center">
                              {isExpanded ? 'Hide Sprints' : 'View Sprints'} 
                              <ChevronRight className={`w-3.5 h-3.5 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                           </button>
                        </>
                     ) : (
                        <>
                           <span>Opens on Week {week.number}</span>
                           <Clock className="w-4 h-4" />
                        </>
                     )}
                  </div>
               </div>
            </section>
          );
        })}

      </div>
    </div>
  );
}


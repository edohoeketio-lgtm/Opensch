"use client";

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Play, Lock, ChevronRight, BookOpen, Clock, FileText } from 'lucide-react';

export default function CurriculumClient({ course, progressMap = {}, isInstructor = false }: { course: any, progressMap?: Record<string, boolean>, isInstructor?: boolean }) {
  
  const allLessonsInOrder = course.modules.flatMap((m: any) => m.sections ? m.sections.flatMap((s: any) => s.lessons) : []);
  let firstIncompleteLessonId: string | null = null;
  for (let i = 0; i < allLessonsInOrder.length; i++) {
     if (!progressMap[allLessonsInOrder[i].id]) {
        firstIncompleteLessonId = allLessonsInOrder[i].id;
        break;
     }
  }

  let activeModuleIndex = 0;
  if (firstIncompleteLessonId) {
     activeModuleIndex = course.modules.findIndex((m: any) => m.sections?.some((s:any) => s.lessons.some((l:any) => l.id === firstIncompleteLessonId)));
     if (activeModuleIndex === -1) activeModuleIndex = 0;
  } else {
     activeModuleIndex = course.modules.length > 0 ? course.modules.length - 1 : 0;
  }

  const currentActiveWeek = activeModuleIndex;
  const activeModuleTasks = course.modules[activeModuleIndex]?.sections?.flatMap((s: any) => s.lessons) || [];
  const activeSprintIndexRaw = activeModuleTasks.findIndex((l: any) => l.id === firstIncompleteLessonId);
  const currentActiveSprintIndex = activeSprintIndexRaw === -1 ? activeModuleTasks.length + 1 : activeSprintIndexRaw + 1; 

  const [expandedWeeks, setExpandedWeeks] = useState<number[]>(course.modules.map((_: any, i: number) => i));

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
        <h1 className="text-2xl md:text-[28px] font-semibold tracking-[-0.02em] text-[#FFFFFF] leading-tight mb-2">{course.title}</h1>
        <p className="text-[#D1D5DB] text-[14px] leading-relaxed max-w-2xl">
          {course.description}
        </p>
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[#2D2D2D] w-full">
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] font-semibold mb-1">Overall Progress</span>
                <span className="text-lg font-medium text-[#FFFFFF]">{allLessonsInOrder.length ? Math.round((Object.keys(progressMap).filter(k => progressMap[k]).length / allLessonsInOrder.length) * 100) : 0}%</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] font-semibold mb-1">Completed</span>
                <span className="text-lg font-medium text-[#FFFFFF]">{Object.keys(progressMap).filter(k => progressMap[k]).length} Lessons</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] font-semibold mb-1">Next Milestone</span>
                <span className="text-lg font-medium text-[#FFFFFF]">{firstIncompleteLessonId ? 'Continue Learning' : 'Mastery Achieved'}</span>
            </div>
        </div>
      </header>

      {/* Curriculum Timeline */}
      <div className="space-y-8 relative">
        <div className="absolute left-10 top-10 bottom-10 w-px bg-white/5 z-0 hidden md:block"></div>

        {course.modules.length === 0 && (
           <p className="text-[#888888] text-center mt-12 text-sm">No curriculum modules have been added yet.</p>
        )}

        {course.modules.map((week: any, weekIndex: number) => {
          const isMastered = isInstructor || weekIndex < currentActiveWeek;
          const isActive = !isInstructor && weekIndex === currentActiveWeek;
          const isLocked = !isInstructor && weekIndex > currentActiveWeek;
          
          const isExpanded = expandedWeeks.includes(weekIndex);
          const allSprints = week.sections ? week.sections.flatMap((s: any) => s.lessons) : [];

          return (
            <section key={week.id} className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 group">
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
                        Week {weekIndex + 1} {isActive && '· Current Focus'}
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
                     {week.description}
                  </p>
                  
                  {isExpanded && (
                     <div className="bg-[#1C1C1E] rounded-xl border border-[#2D2D2D] flex flex-col relative z-20 mt-2 mb-6 shadow-inner overflow-hidden">
                        {week.sections?.length === 0 && (
                          <div className="p-4 text-xs text-[#888888] italic">No content in this module yet.</div>
                        )}
                        {week.sections?.map((section: any, sIdx: number) => (
                           <div key={section.id} className="flex flex-col">
                              {section.title && (
                                <div className="px-5 py-3 border-b border-[#2D2D2D] bg-[#111111]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888888]">{section.title}</h4>
                                </div>
                              )}
                              {section.lessons?.map((sprint: any, idx: number) => {
                           const sprintNumber = idx + 1;
                           const isSprintMastered = isInstructor || progressMap[sprint.id] === true;
                           const isSprintActive = !isInstructor && sprint.id === firstIncompleteLessonId;
                           const isSprintLocked = !isInstructor && !isSprintMastered && !isSprintActive;

                           const sprintUrl = `/course/${course.id}/module/${week.id}/lesson/${sprint.id}`;

                           if (isSprintMastered) {
                              return (
                                 <Link key={sprint.id} href={sprintUrl} className="p-4 border-b border-[#2D2D2D] flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
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
                                 <Link key={sprint.id} href={sprintUrl} className="p-4 border-b border-[#B08D57]/20 bg-[#1D1D21] flex items-center justify-between cursor-pointer hover:bg-[#252529] transition-colors group">
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
                                 <div key={sprint.id} className="p-4 border-b border-[#2D2D2D] flex items-center justify-between opacity-50 cursor-not-allowed bg-[#111111]">
                                    <div className="flex items-center gap-4">
                                       <Lock className="w-4 h-4 text-[#888888]" />
                                       <span className="text-sm font-medium text-[#888888]">{sprintNumber}. {sprint.title}</span>
                                    </div>
                                 </div>
                              );
                           }
                              })}
                           </div>
                        ))}
                     </div>
                  )}
                  
                  {/* Action Bar / Toggle */}
                  <div className={`mt-auto pt-5 border-t border-[#2D2D2D] flex justify-between items-center text-[12px] font-medium text-[#888888] ${isActive ? 'mt-4' : ''}`}>
                        <span>{allSprints.length} Sprints</span>
                        <div className="flex items-center gap-4">
                           {isLocked && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Locked</span>}
                           <button onClick={() => toggleWeek(weekIndex)} className="hover:text-[#FFFFFF] transition-colors flex items-center">
                              {isExpanded ? 'Hide Sprints' : 'View Sprints'} 
                              <ChevronRight className={`w-3.5 h-3.5 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                           </button>
                        </div>
                  </div>
               </div>
            </section>
          );
        })}

      </div>
    </div>
  );
}

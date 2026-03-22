"use client";

import Link from 'next/link';
import { Play, Target, MessageSquare, ChevronRight, Eye } from 'lucide-react';
import { CURRICULUM_WEEKS } from '@/lib/content';
import { useTimeGreeting, extractFirstName } from '@/lib/utils/time';
import CurriculumCopilot from '../components/CurriculumCopilot';
import Image from 'next/image';

export default function DashboardClient({ 
  studentName, 
  isImpersonating, 
  studentId,
  milestone,
  honor,
  recentActivity = [],
  upcomingAssignment,
  upcomingEvent,
  currentWeek,
  progressMetrics,
  resumeUrl
}: { 
  studentName: string | null, 
  isImpersonating: boolean, 
  studentId: string | null,
  milestone?: { title: string, subtitle: string },
  honor?: { title: string, subtitle: string },
  recentActivity?: Array<{ id: string, authorName: string, authorAvatar?: string, authorInitial: string, title: string, timeLabel: string, type: string }>,
  upcomingAssignment?: { title: string, description: string, url: string, deadlineText: string } | null,
  upcomingEvent?: { title: string, description: string, url: string, timeText: string, timeLabel: string } | null,
  currentWeek?: number,
  progressMetrics?: { 
    mastery: number, 
    timeSpentHrs: number, 
    points: number,
    moduleProgress: Array<{ title: string, completedLessons: number, totalLessons: number }> 
  },
  resumeUrl?: string
}) {
  const firstName = extractFirstName(studentName);
  const greeting = useTimeGreeting(firstName);
  const activeWeekNumber = currentWeek || 1;
  const activeWeekData = CURRICULUM_WEEKS.find(w => w.number === activeWeekNumber) || CURRICULUM_WEEKS[0];

  return (
    <div className="p-4 md:p-14 max-w-[1400px] mx-auto text-[#FFFFFF] pb-24 md:pb-14">
      
      {/* Impersonation Banner */}
      {isImpersonating && (
        <div className="mb-10 bg-[#B08D57]/10 border border-[#B08D57]/30 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-[#B08D57]/5">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B08D57]/20 flex items-center justify-center">
                 <Eye className="w-4 h-4 text-[#B08D57]" />
              </div>
              <div>
                 <div className="text-xs font-semibold uppercase tracking-[0.1em] text-[#B08D57]">Admin Impersonation Mode</div>
                 <div className="text-sm font-medium text-[#FFFFFF] mt-0.5">Viewing academic record for: <span className="text-[#D1D5DB]">{studentName || 'Student'}</span></div>
              </div>
           </div>
           <Link href="/admin/roster" className="px-4 py-2 bg-[#1C1C1E] border border-white/10 rounded-lg text-xs font-semibold text-[#FFFFFF] hover:bg-white/5 transition-colors">
              Exit to Roster
           </Link>
        </div>
      )}

      {/* Header */}
      <header className="mb-10 flex flex-col items-start">
        <div className="flex items-center gap-3 mb-1">
           <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B08D57]">Current Focus</span>
           <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-[#2D2D2D] text-[9px] font-semibold uppercase tracking-[0.15em] text-[#9CA3AF] flex items-center gap-1.5 shadow-sm"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span> On Track</span>
        </div>
        <h1 className="text-2xl md:text-[28px] font-semibold tracking-[-0.03em] text-[#FFFFFF] leading-tight mb-3">{greeting}!</h1>
        <h2 className="text-lg md:text-[20px] font-medium tracking-tight text-[#D1D5DB] leading-tight mb-1.5">Week {activeWeekData.number} · {activeWeekData.title}.</h2>
        <p className="text-[#D1D5DB] text-[13px] leading-relaxed max-w-2xl">{activeWeekData.goal}</p>
      </header>

      {/* Row 1: Apex Priority */}
      <div className="flex flex-col xl:flex-row gap-8">
         {/* 60% Hero: Resume Learning */}         <section className="flex-1 xl:w-3/5 flex flex-col">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888] mb-4">Continue Learning</h3>
            <Link href={resumeUrl || `/course/ai-product-builder/module/${activeWeekData.number}/lesson/1${isImpersonating && studentId ? '?studentId='+studentId : ''}`} className="group flex-1 flex flex-col rounded-2xl bg-[#1C1C1E] hover:bg-gradient-to-br hover:from-[#1A1A1E] hover:to-[#121214] border border-[#2D2D2D] overflow-hidden hover:border-[#2D2D2D] hover:shadow-2xl hover:shadow-black/80 transition-all duration-500 relative">
               {/* The Academic Horizon Line */}
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#B08D57] to-transparent z-30 opacity-80"></div>
               
               <div className="flex flex-col md:flex-row items-stretch flex-1">
                  {/* Media */}
                  <div className="w-full md:w-5/12 bg-[#111111] relative overflow-hidden flex-shrink-0 border-b md:border-b-0 md:border-r border-[#2D2D2D] min-h-[200px] md:min-h-0">
                     <div className="absolute inset-0 bg-[#1D1D21]/40 mix-blend-overlay z-10 transition-colors duration-500 group-hover:bg-[#1D1D21]/20"></div>
                     <Image width={600} height={600} src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop" alt="Code" className="w-full h-full object-cover opacity-40 grayscale group-hover:scale-105 group-hover:opacity-50 transition-all duration-[3000ms] ease-out absolute inset-0 z-0" />
                     {/* Overlay Icon */}
                     <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="w-14 h-14 rounded-full bg-[#1C1C1E]/80 backdrop-blur-md border border-[#2D2D2D] flex items-center justify-center group-hover:bg-[#F5F2EB] transition-colors duration-300">
                           <Play className="w-5 h-5 text-[#FFFFFF] ml-0.5 fill-current group-hover:text-[#0B0B0C]" />
                        </div>
                     </div>
                     <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/5 z-20">
                        <div className="h-full bg-[#B08D57]" style={{ width: `${progressMetrics?.mastery || 0}%` }}></div>
                     </div>
                  </div>
                  {/* Content */}
                  <div className="p-7 xl:p-8 flex flex-col flex-1">
                     <div className="flex-1 flex flex-col justify-center mb-6">
                        <div className="flex items-center gap-3 mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#9CA3AF] uppercase">
                           <span className="text-[#FFFFFF]">Sprint 0{activeWeekData.number}</span>
                           <span className="w-1 h-1 rounded-full bg-white/10"></span>
                           <span className="flex items-center gap-1.5"><Play className="w-2.5 h-2.5" /> {(progressMetrics?.mastery || 0) === 0 ? 'Start Learning' : 'In Progress'}</span>
                        </div>
                        <h2 className="text-xl md:text-[24px] font-semibold tracking-[-0.01em] leading-tight text-[#FFFFFF] mb-3 group-hover:text-white transition-colors">{activeWeekData.modules?.[0]?.title || activeWeekData.title}</h2>
                        <p className="text-[#D1D5DB] text-[14px] leading-relaxed line-clamp-2">{activeWeekData.goal}</p>
                     </div>
                     
                     <div className="mt-auto flex items-center justify-between border-t border-[#2D2D2D] pt-6">
                        <div className="flex items-center text-[13px] font-medium text-[#FFFFFF] group-hover:text-white transition-colors">
                           Resume Sprint <ChevronRight className="w-3.5 h-3.5 ml-1.5 group-hover:ml-2.5 transition-all ease-out" />
                        </div>
                        <div className="text-[10px] text-[#9CA3AF] font-medium tracking-widest uppercase">{progressMetrics?.mastery || 0}% Mastered</div>
                     </div>
                  </div>
               </div>
            </Link>
         </section>

         {/* 40% This Week Panel */}
         <section className="w-full xl:w-2/5 flex flex-col">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888] mb-4">Current Sprint</h3>
            <div className="flex-1 rounded-2xl bg-[#1C1C1E] border border-[#2D2D2D] p-7 xl:p-8 flex flex-col">
               <div className="flex items-end justify-between mb-8">
                  <div>
                     <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B08D57] mb-1">Sprint Overview</div>
                     <div className="text-lg font-medium tracking-[-0.01em] text-[#FFFFFF]">Week {activeWeekData.number} of {CURRICULUM_WEEKS.length}</div>
                  </div>
                  <div className="text-right">
                     <div className="text-[13px] font-medium text-[#FFFFFF]">{progressMetrics?.mastery || 0}%</div>
                     <div className="text-[#888888] text-[9px] uppercase tracking-[0.2em] mt-0.5">Mastery</div>
                  </div>
               </div>
               
               {/* Segmented Timeline */}
               <div className="space-y-6 border-l border-[#2D2D2D] ml-2.5 pl-6 relative">
                  {(progressMetrics?.moduleProgress && progressMetrics.moduleProgress.length > 0) ? (
                    progressMetrics.moduleProgress.slice(0, 3).map((mod, idx) => {
                      const isMastered = mod.completedLessons === mod.totalLessons && mod.totalLessons > 0;
                      const statusText = isMastered 
                        ? 'Mastered' 
                        : mod.completedLessons > 0 
                          ? `${mod.completedLessons}/${mod.totalLessons} Lessons Mastered` 
                          : 'Upcoming';
                      
                      return (
                        <div key={idx} className="relative">
                          <span className={`absolute -left-[28.5px] top-1.5 w-2 h-2 rounded-full ${isMastered || mod.completedLessons > 0 ? 'bg-[#B08D57]' : 'bg-white/10'} ring-4 ring-[#1C1C1E]`}></span>
                          <div className={`${isMastered || mod.completedLessons > 0 ? 'text-[#FFFFFF]' : 'text-[#9CA3AF]'} text-[13px] font-medium`}>{mod.title}</div>
                          <div className={`text-[11px] ${isMastered || mod.completedLessons > 0 ? 'text-[#9CA3AF]' : 'text-[#888888]'} mt-1 tracking-wide`}>{statusText}</div>
                       </div>
                      );
                    })
                  ) : (
                    <div className="text-[13px] text-[#888888]">No modules defined for this sprint yet.</div>
                  )}
               </div>
               
               <div className="mt-auto pt-6 border-t border-[#2D2D2D] flex items-center justify-between text-[10px] tracking-[0.2em] uppercase font-semibold text-[#888888]">
                  <span>Total Time: {progressMetrics?.timeSpentHrs || 0} hrs</span>
                  <span>{progressMetrics?.points || 0} Points</span>
               </div>
            </div>
         </section>
      </div>

      {/* Row 2: Macro Context */}
      <section className="mt-12">
         <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888] mb-5">The Academic Journey</h3>
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CURRICULUM_WEEKS.map((week) => {
               const isActive = week.number === activeWeekNumber;
               const isPast = week.number < activeWeekNumber;
               const isFuture = week.number > activeWeekNumber;
               return (
                  <div key={week.number} className={`rounded-2xl p-6 flex flex-col ${
                     isActive ? 'bg-[#1C1C1E] border border-[#B08D57]/40 relative overflow-hidden group' : 
                     isFuture ? 'bg-transparent border border-[#2D2D2D] border-dashed opacity-40' : 
                     'bg-[#111111] border border-[#2D2D2D] opacity-50'
                  }`}>
                     {isActive && <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#B08D57] to-transparent opacity-50"></div>}
                     <div className={`text-[9px] font-semibold uppercase tracking-[0.2em] mb-2 ${
                        isActive ? 'text-[#B08D57]' : isPast ? 'text-[#9CA3AF]' : 'text-[#888888]'
                     }`}>Phase {week.number}{isActive ? ' (Current)' : ''}</div>
                     <div className={`text-base font-medium tracking-tight mb-0.5 ${
                        isActive ? 'text-[#FFFFFF]' : 'text-[#9CA3AF]'
                     }`}>{week.pillar}</div>
                     <div className={`text-[11px] tracking-wide ${
                        isActive ? 'text-[#9CA3AF]' : 'text-[#888888]'
                     }`}>{week.title}</div>
                  </div>
               );
            })}
         </div>
      </section>

      {/* Row 3: Operational Cards */}
      <section className="mt-16">
         <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888] mb-5">Needs Attention</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Priority 1: Deliverable */}
            {upcomingAssignment ? (
              <Link href={upcomingAssignment.url} className="rounded-2xl bg-[#1C1C1E] border border-[#2D2D2D] p-6 hover:bg-[#1D1D21] hover:border-[#2D2D2D] transition-all duration-500 cursor-pointer group flex flex-col hover:-translate-y-0.5 shadow-xl shadow-black/50">
                 <div className="flex items-center justify-between mb-8">
                    <div className="w-10 h-10 rounded-full bg-[#1D1D21] border border-[#2D2D2D] flex items-center justify-center">
                       <Target className="w-4 h-4 text-[#FFFFFF]" />
                    </div>
                    <span className="px-2 py-1 rounded bg-[#1D1D21] text-[9px] font-semibold tracking-[0.2em] uppercase text-[#B08D57]">Pending</span>
                 </div>
                 <h4 className="text-sm font-medium text-[#FFFFFF] tracking-tight mb-1.5">{upcomingAssignment.title}</h4>
                 <p className="text-[13px] leading-relaxed text-[#D1D5DB] mb-6">{upcomingAssignment.description}</p>
                 <div className="mt-auto flex items-center justify-between text-xs">
                    <span className="text-[#9CA3AF]">{upcomingAssignment.deadlineText}</span>
                    <span className="text-[#FFFFFF] font-medium group-hover:underline flex items-center">Commit Deliverable <ChevronRight className="w-3.5 h-3.5 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></span>
                 </div>
              </Link>
            ) : (
              <div className="rounded-2xl bg-[#1C1C1E] border border-[#2D2D2D] p-6 flex flex-col justify-center items-center text-center opacity-70">
                 <Target className="w-6 h-6 text-[#525252] mb-3" />
                 <h4 className="text-sm font-medium text-[#FFFFFF] mb-1">Up to Date</h4>
                 <p className="text-xs text-[#888888]">No pending deliverables.</p>
              </div>
            )}

            {/* Priority 2: Live Session */}
            {upcomingEvent ? (
              <a href={upcomingEvent.url} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-[#1C1C1E] border border-[#2D2D2D] p-6 hover:bg-[#1D1D21] hover:border-[#2D2D2D] transition-all duration-500 cursor-pointer group flex flex-col hover:-translate-y-0.5 shadow-xl shadow-black/50">
                 <div className="flex items-center justify-between mb-8">
                    <div className="w-10 h-10 rounded-full bg-[#1D1D21] border border-[#2D2D2D] flex items-center justify-center">
                       <Play className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#FFFFFF] transition-colors" />
                    </div>
                    <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#888888]">{upcomingEvent.timeLabel}</span>
                 </div>
                 <h4 className="text-sm font-medium text-[#FFFFFF] tracking-tight mb-1.5">{upcomingEvent.title}</h4>
                 <p className="text-[13px] leading-relaxed text-[#D1D5DB] mb-6">{upcomingEvent.description}</p>
                 <div className="mt-auto flex items-center justify-between text-xs">
                    <span className="text-[#888888]">{upcomingEvent.timeText}</span>
                    <span className="text-[#FFFFFF] font-medium group-hover:underline">Join Session</span>
                 </div>
              </a>
            ) : (
              <div className="rounded-2xl bg-[#1C1C1E] border border-[#2D2D2D] p-6 flex flex-col justify-center items-center text-center opacity-70">
                 <Play className="w-6 h-6 text-[#525252] mb-3" />
                 <h4 className="text-sm font-medium text-[#FFFFFF] mb-1">No Upcoming Events</h4>
                 <p className="text-xs text-[#888888]">Check back later for live sessions.</p>
              </div>
            )}

            {/* Priority 3: Help / Support */}
            <div 
               onClick={() => document.dispatchEvent(new CustomEvent('open-cmdk', { detail: { mode: 'copilot' } }))}
               className="rounded-2xl bg-transparent border border-[#2D2D2D] border-dashed p-6 hover:bg-[#1C1C1E] hover:border-[#2D2D2D] hover:border-solid transition-all duration-500 cursor-pointer group flex flex-col relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5F2EB]/5 rounded-full blur-3xl group-hover:bg-[#F5F2EB]/10 transition-colors"></div>
               <div className="flex items-center justify-between mb-8 relative">
                  <div className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-[#2D2D2D] flex items-center justify-center">
                     <MessageSquare className="w-4 h-4 text-[#888888] group-hover:text-[#FFFFFF] transition-colors" />
                  </div>
               </div>
               <h4 className="text-sm font-medium text-[#FFFFFF] tracking-tight mb-1.5 relative">OpenSch Intelligence</h4>
               <p className="text-[13px] leading-relaxed text-[#D1D5DB] transition-colors mb-6 relative">Instantly resolve code blockers using our curriculum-trained AI.</p>
               <div className="mt-auto flex items-center justify-between text-xs relative">
                  <span className="text-[#888888]">Available 24/7</span>
                  <span className="text-[#FFFFFF] font-medium group-hover:underline">OpenSch Intelligence Chat</span>
               </div>
            </div>

         </div>
      </section>

      {/* Row 4: Periphery */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pb-20">
         
         {/* Community Pulses -> Cohort Activity */}
         <div className="flex flex-col">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888] mb-5">Cohort Activity</h3>
            <div className="space-y-4 flex-1">
               {recentActivity.length > 0 ? recentActivity.map((activity) => (
                 <Link href={`/feed/${activity.id}`} key={activity.id} className="flex gap-4 p-4 rounded-xl border border-transparent hover:border-[#2D2D2D] hover:bg-[#1C1C1E] transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-[#1D1D21] shrink-0 flex items-center justify-center overflow-hidden border border-[#2D2D2D]">
                       {activity.authorAvatar ? (
                         <Image width={600} height={600} src={activity.authorAvatar} alt={activity.authorName} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
                       ) : (
                         <span className="text-[#FFFFFF] text-sm font-bold">{activity.authorInitial}</span>
                       )}
                    </div>
                    <div>
                       <div className="text-[13px] text-[#FFFFFF] leading-tight mb-1.5"><span className="font-medium">{activity.authorName}</span> posted in <span className="text-[#9CA3AF]">{activity.type}</span>: <span className="text-[#D1D5DB]">{activity.title !== 'Untitled Thought' ? activity.title : 'A new thought'}</span></div>
                       <div className="text-[11px] text-[#888888]">{activity.timeLabel}</div>
                    </div>
                 </Link>
               )) : (
                 <div className="text-[13px] text-[#888888] italic p-4 border border-dashed border-[#2D2D2D] rounded-xl flex items-center justify-center text-center">It's quiet. Start a discussion on the Open Forum!</div>
               )}
            </div>
            <Link href="/feed" className="mt-6 text-[10px] items-center w-fit font-semibold tracking-[0.2em] uppercase text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors flex gap-2">
               Open Forum <ChevronRight className="w-3 h-3" />
            </Link>
         </div>

         {/* Meaningful Recognition -> Transcript Status */}
         <div className="flex flex-col">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888] mb-5">Academic Record</h3>
            <div className="grid grid-cols-2 gap-4 opacity-70 hover:opacity-100 transition-opacity duration-500">
               <Link href="/portfolio" className="p-5 rounded-xl border border-[#2D2D2D] bg-transparent flex flex-col hover:bg-white/[0.02] hover:border-white/10 transition-colors cursor-pointer block">
                  <div className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF] mb-2.5">Milestone</div>
                  <div className="text-[13px] font-medium text-[#FFFFFF] mb-1">{milestone?.title || 'Week 2 Mastered'}</div>
                  <div className="text-[11px] text-[#888888]">{milestone?.subtitle || 'UX Systems Mastered'}</div>
               </Link>
               <Link href="/portfolio" className="p-5 rounded-xl border border-[#2D2D2D] bg-transparent flex flex-col hover:bg-white/[0.02] hover:border-white/10 transition-colors cursor-pointer block">
                  <div className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF] mb-2.5">Honor</div>
                  <div className="text-[13px] font-medium text-[#FFFFFF] mb-1">{honor?.title || 'Live Attendee'}</div>
                  <div className="text-[11px] text-[#888888]">{honor?.subtitle || '100% Session Presence'}</div>
               </Link>
            </div>
         </div>

      </section>

      {/* Row 5: AI Copilot Assistant */}
      <section className="mt-16 pb-20">
         <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888] mb-5 flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5" /> OpenSch Copilot
         </h3>
         <div className="w-full">
            <CurriculumCopilot />
         </div>
      </section>

    </div>
  );
}

"use client";

import { useState } from 'react';
import { Search, Filter, Mail, ShieldAlert, CheckCircle, Clock, X, Terminal, Maximize2, GitMerge, FileCode, PlayCircle, MessageSquare } from 'lucide-react';
import type { StudentTelemetryPayload } from '@/app/types/telemetry';
import Link from 'next/link';

// Detailed CRM Interface
export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  cohort: string;
  progress: number;
  risk: 'low' | 'medium' | 'high';
  lastActive: string;
  avatar: string;
  // Deep telemetry fetched on demand
  telemetry?: StudentTelemetryPayload['telemetry'];
  grades?: StudentTelemetryPayload['grades'];
  notes?: string;
}

export default function RosterClient({ 
  initialStudents,
  getStudentTelemetry
}: { 
  initialStudents: StudentRecord[],
  getStudentTelemetry: (studentId: string) => Promise<StudentTelemetryPayload>
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [isLoadingTelemetry, setIsLoadingTelemetry] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<string>('All Cohorts');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Derive unique cohorts from initial payload
  const availableCohorts = ['All Cohorts', ...new Set(initialStudents.map(s => s.cohort))];

  // Filter students based on search string and cohort
  const displayStudents = initialStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCohort = selectedCohort === 'All Cohorts' || s.cohort === selectedCohort;
    return matchesSearch && matchesCohort;
  });

  const handleSelectStudent = async (student: StudentRecord) => {
    setSelectedStudent(student);
    setIsLoadingTelemetry(true);
    
    // Instead of iterating arrays on page load, we fetch exclusively on select
    const data = await getStudentTelemetry(student.id);
    
    // Merge real data into selection if we aren't using hardcoded mock telemetry
    // For mock users (like "1", "2"), we will preserve their dummy data for visual testing
    if (student.telemetry && student.telemetry.length > 0) {
      setIsLoadingTelemetry(false);
      return; 
    }

    setSelectedStudent(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        telemetry: data.telemetry,
        grades: data.grades,
        notes: data.notes
      };
    });
    
    setIsLoadingTelemetry(false);
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] w-full">
      {/* LEFT PANE: Directory */}
      <div className="flex flex-col h-full bg-[#111111] w-[40%] min-w-[400px] max-w-lg border-r border-[#2D2D2D] transition-all duration-300">
        
        <div className="p-8 border-b border-white/5 bg-[#111111] z-10 sticky top-0">
           <div className="space-y-1 mb-6">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#FFFFFF]">Student CRM</h1>
            <p className="text-[#888888] text-sm md:w-3/4 leading-relaxed">Deep telemetry profiling. Monitor engagement, detect skipped content, and intervene before attrition.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <input 
                  type="text"
                  placeholder="Search roster..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1C1C1E] border border-white/5 text-[#FFFFFF] text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#B08D57]/50 focus:border-[#B08D57]/50 transition-all placeholder:text-[#525252] shadow-inner"
                />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 px-5 py-3 border rounded-xl text-sm font-medium transition-all w-full sm:w-auto justify-center shadow-lg shadow-black/20 ${
                    selectedCohort !== 'All Cohorts' 
                      ? 'bg-white/10 border-white/20 text-[#FFFFFF]' 
                      : 'bg-[#1C1C1E] border-white/5 text-[#FFFFFF] hover:bg-white/5'
                  }`}
                >
                    <Filter className={`w-4 h-4 ${selectedCohort !== 'All Cohorts' ? 'text-[#B08D57]' : 'text-[#888888]'}`} />
                    {selectedCohort}
                </button>
                
                {/* Inline Absolute Dropdown */}
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#1C1C1E] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                       {availableCohorts.map(cohort => (
                         <button
                           key={cohort}
                           onClick={() => {
                             setSelectedCohort(cohort);
                             setIsDropdownOpen(false);
                           }}
                           className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                             selectedCohort === cohort 
                               ? 'bg-white/10 text-[#FFFFFF] font-medium' 
                               : 'text-[#888888] hover:bg-white/5 hover:text-[#FFFFFF]'
                           }`}
                         >
                           {cohort}
                         </button>
                       ))}
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>

        {/* Directory List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {displayStudents.map((student) => (
            <button
              key={student.id}
              onClick={() => handleSelectStudent(student)}
              className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group flex items-start gap-4
                ${selectedStudent?.id === student.id 
                  ? 'bg-[#1C1C1E] border-white/10 shadow-xl shadow-black/40 scale-[1.01]' 
                  : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
              }`}
            >
               <div className="w-12 h-12 rounded-full bg-[#111111] border border-white/10 flex flex-col items-center justify-center shrink-0 shadow-inner">
                 <span className="text-sm font-bold text-[#FFFFFF] tracking-wider">{student.avatar}</span>
               </div>
               
               <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                     <span className={`font-semibold tracking-tight truncate transition-colors ${selectedStudent?.id === student.id ? 'text-[#FFFFFF]' : 'text-[#E5E5E5] group-hover:text-[#FFFFFF]'}`}>
                        {student.name}
                     </span>
                     {student.risk === 'high' && (
                       <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                     )}
                  </div>
                  <div className="text-xs text-[#888888] mb-3">{student.email}</div>
                  
                  {/* Miniature Progress Bar */}
                  <div className="flex flex-col gap-1.5 w-full">
                      <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-[#525252] uppercase tracking-[0.1em]">{student.cohort}</span>
                          <span className="text-[10px] font-medium text-[#888888]">{student.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#111111] rounded-full overflow-hidden shadow-inner">
                          <div 
                              className={`h-full rounded-full ${student.risk === 'high' ? 'bg-rose-500' : student.risk === 'medium' ? 'bg-amber-500' : 'bg-[#FFFFFF]'}`}
                              style={{ width: `${student.progress}%` }}
                          />
                      </div>
                  </div>
               </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT PANE: Telemetry CRM Canvas */}
      {selectedStudent ? (
        <div className="flex-1 bg-[#111111] h-full overflow-y-auto animate-in slide-in-from-right-8 fade-in duration-300 relative">
           
           {/* Background Mesh (Subtle) */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.02),transparent_50%)] pointer-events-none" />

           <div className="max-w-4xl mx-auto p-12 space-y-12 relative z-10">
              
              {/* 1. Identity Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-12 border-b border-white/5">
                 <div className="flex flex-col md:flex-row md:items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center shadow-lg shadow-black/40 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                      <span className="text-xl font-bold tracking-widest text-[#FFFFFF] relative z-10">{selectedStudent.avatar}</span>
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-1.5">
                         <h2 className="text-2xl font-semibold tracking-tight text-[#FFFFFF]">{selectedStudent.name}</h2>
                         <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-widest uppercase bg-[#1C1C1E] border border-white/5 text-[#B08D57] shadow-inner">{selectedStudent.cohort}</span>
                       </div>
                       <div className="flex items-center gap-3 text-xs text-[#888888]">
                          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#525252]"/> {selectedStudent.email}</span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <a href={`mailto:${selectedStudent.email}`} className="text-[#B08D57] hover:text-[#FFFFFF] transition-colors flex items-center gap-1.5 font-medium">
                            <MessageSquare className="w-3.5 h-3.5" /> Contact Student
                          </a>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          {/* Impersonation Bridge Output to Student Dashboard */}
                          <Link href={`/dashboard?studentId=${selectedStudent.id}`} className="text-[#888888] hover:text-[#FFFFFF] transition-colors flex items-center gap-1.5 font-medium underline underline-offset-4 pointer-events-auto">
                            View Dashboard Record <Maximize2 className="w-3.5 h-3.5" />
                          </Link>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedStudent(null)}
                      className="p-2 transition-colors rounded text-[#525252] hover:text-[#FFFFFF] hover:bg-white/5 active:scale-95"
                    >
                      <X className="w-4 h-4" />
                    </button>
                 </div>
              </div>

              {/* 2. Academic Summary Band */}
              <div className="bg-[#1C1C1E]/30 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5">
                 <div className="flex-1 px-8 first:pl-4 last:pr-4 py-4 md:py-0 flex flex-col justify-start">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#525252] mb-3">Academic Standing</span>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedStudent.risk === 'high' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : selectedStudent.risk === 'medium' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                      <span className="text-sm font-medium tracking-tight text-[#FFFFFF]">
                        {selectedStudent.risk === 'high' ? 'Critical' : selectedStudent.risk === 'medium' ? 'Warning' : 'Healthy'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#888888] mt-1 relative top-0.5">Based on velocity & scores</span>
                 </div>
                 
                 <div className="flex-1 px-8 first:pl-4 last:pr-4 py-4 md:py-0 flex flex-col justify-start">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#525252] mb-3">Learning Progress</span>
                    <div className="flex items-center gap-4">
                       <span className="text-sm font-medium tracking-tight text-[#FFFFFF] w-8">{selectedStudent.progress}%</span>
                       <div className="flex-1 h-[3px] bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${selectedStudent.progress > 80 ? 'bg-emerald-500' : selectedStudent.progress > 40 ? 'bg-amber-500' : 'bg-white/20'}`} style={{ width: `${selectedStudent.progress}%` }} />
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 px-8 first:pl-4 last:pr-4 py-4 md:py-0 flex flex-col justify-start">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#525252] mb-3">Recent Activity</span>
                    <div className="flex items-center gap-2.5">
                       <Clock className="w-3.5 h-3.5 text-[#525252]" />
                       <span className="text-sm font-medium tracking-tight text-[#FFFFFF]">{selectedStudent.lastActive}</span>
                    </div>
                    <span className="text-[11px] text-[#888888] mt-1.5">Active in `/feed`</span>
                 </div>
              </div>

              {/* 3. Record Modules */}
              {!isLoadingTelemetry && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-8 animate-in fade-in duration-300">
                   {/* Learning Activity */}
                   <div className="space-y-8">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#FFFFFF] flex items-center gap-2">
                         Learning Activity
                      </h3>
                      <div className="space-y-5">
                         {selectedStudent.telemetry && selectedStudent.telemetry.length > 0 ? selectedStudent.telemetry.map((log, i) => (
                            <div key={i} className="flex flex-col gap-2.5 group">
                               <div className="flex items-center justify-between">
                                  <span className="text-sm text-[#AAAAAA] group-hover:text-[#FFFFFF] transition-colors line-clamp-1 pr-4">{log.lesson}</span>
                                  {log.status === 'skipped' ? (
                                     <span className="text-[10px] font-medium tracking-wider uppercase text-[#525252] shrink-0">Skipped</span>
                                  ) : (
                                     <span className="text-[10px] font-medium tracking-wider uppercase text-emerald-500/80 shrink-0">Completed</span>
                                  )}
                               </div>
                               <div className="flex items-center gap-4">
                                  <div className="flex-1 h-[2px] bg-white/5 rounded-full overflow-hidden">
                                     <div className={`h-full ${log.status === 'skipped' ? 'bg-[#525252]' : 'bg-emerald-500/50'}`} style={{ width: `${Math.min((log.watched/log.total)*100, 100)}%` }} />
                                  </div>
                                  <span className="text-[11px] font-mono text-[#525252] w-8 text-right shrink-0">{Math.round((log.watched/60))}m</span>
                               </div>
                            </div>
                         )) : (
                            <div className="py-8 opacity-50 text-sm text-[#525252]">No activity recorded.</div>
                         )}
                      </div>
                   </div>

                   {/* Assessment Record */}
                   <div className="space-y-8">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#FFFFFF] flex items-center gap-2">
                         Assessment Record
                      </h3>
                      <div className="space-y-2">
                         {selectedStudent.grades && selectedStudent.grades.length > 0 ? selectedStudent.grades.map((grade, i) => (
                            <div key={i} className="py-3 flex items-start justify-between border-b border-white/5 last:border-0 group">
                               <div>
                                  <div className="text-sm text-[#AAAAAA] group-hover:text-[#FFFFFF] transition-colors mb-1 line-clamp-1 pr-4">{grade.sprint}</div>
                                  <div className="text-[11px] text-[#525252] break-normal">{grade.date}</div>
                               </div>
                               <div className="flex flex-col items-end gap-1 shrink-0">
                                  <span className="text-sm font-medium text-[#FFFFFF]">{grade.score}<span className="text-[#525252]">/100</span></span>
                                  <span className={`text-[10px] font-medium tracking-wider uppercase ${grade.arch === 'Pass' ? 'text-emerald-500/80' : 'text-amber-500/80'}`}>
                                    {grade.arch}
                                  </span>
                               </div>
                            </div>
                         )) : (
                            <div className="py-8 opacity-50 text-sm text-[#525252]">No graded submissions.</div>
                         )}
                      </div>
                   </div>
                </div>
              )}

              {isLoadingTelemetry && (
                <div className="flex items-center justify-center p-12">
                   <div className="w-5 h-5 border-2 border-[#B08D57]/30 border-t-[#B08D57] rounded-full animate-spin"></div>
                </div>
              )}

              {/* Faculty Notes (Private) */}
              <div className="space-y-4 pb-12 mt-12">
                 <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B08D57] flex items-center gap-2 px-1">
                    <FileCode className="w-3.5 h-3.5" /> Internal Faculty Notes
                 </h3>
                 <div className="relative group">
                    <textarea 
                       className="w-full h-36 bg-[#1C1C1E] border border-white/5 rounded-3xl p-6 text-sm text-[#FFFFFF] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#B08D57]/50 focus:border-[#B08D57]/50 resize-none shadow-inner placeholder:text-[#525252] transition-all"
                       placeholder="Add operational notes about this student's trajectory..."
                       defaultValue={selectedStudent.notes || ''}
                    />
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[10px] text-[#525252] font-medium tracking-wide">AUTOSAVED</span>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#111111] border-l border-white/5 relative z-0">
           {/* Background Graphic */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_60%)] pointer-events-none" />
           <div className="w-20 h-20 rounded-[2rem] bg-[#1C1C1E] border border-white/5 flex items-center justify-center mb-8 shadow-2xl shadow-black/50 relative z-10">
              <Search className="w-8 h-8 text-[#525252]" />
           </div>
           <h3 className="text-2xl font-medium text-[#FFFFFF] mb-3 tracking-tight relative z-10">Select a student record</h3>
           <p className="text-[#888888] text-sm text-center max-w-sm leading-relaxed relative z-10">
             Select a student from the directory to inspect their full semantic telemetry, video watch patterns, and AI-graded assessment history.
           </p>
        </div>
      )}

    </div>
  );
}

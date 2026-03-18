"use client";

import { useState } from 'react';
import { Search, Filter, Mail, ShieldAlert, CheckCircle, Clock, X, Terminal, Maximize2, GitMerge, FileCode, PlayCircle, MessageSquare, Users, ChevronLeft } from 'lucide-react';
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
  interventions?: any[];
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
  
  const [selectedRisk, setSelectedRisk] = useState<string>('All Risks');
  const [isRiskDropdownOpen, setIsRiskDropdownOpen] = useState(false);

  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [interventionReason, setInterventionReason] = useState('');
  const [interventionAction, setInterventionAction] = useState('');
  const [isSubmittingIntervention, setIsSubmittingIntervention] = useState(false);

  // Derive unique cohorts from initial payload
  const availableCohorts = ['All Cohorts', ...new Set(initialStudents.map(s => s.cohort))];

  // Filter students based on search string and cohort
  const displayStudents = initialStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCohort = selectedCohort === 'All Cohorts' || s.cohort === selectedCohort;
    const matchesRisk = selectedRisk === 'All Risks' || s.risk === selectedRisk.split(' ')[0].toLowerCase();
    return matchesSearch && matchesCohort && matchesRisk;
  });

  const handleSelectStudent = async (student: StudentRecord) => {
    setSelectedStudent(student);
    setIsLoadingTelemetry(true);
    
    // Instead of iterating arrays on page load, we fetch exclusively on select
    const data = await getStudentTelemetry(student.id);
    
    // Merge real data into selection if we aren't using hardcoded mock telemetry
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

  const handleLogIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setIsSubmittingIntervention(true);
    
    try {
      const { logIntervention } = await import('@/app/actions/interventions');
      const res = await logIntervention({
        studentId: selectedStudent.id,
        reason: interventionReason,
        actionTaken: interventionAction
      });

      if (res.success) {
        setIsInterventionModalOpen(false);
        setInterventionReason('');
        setInterventionAction('');
        
        // Optimistically update the UI
        setSelectedStudent({
          ...selectedStudent,
          interventions: [res.log, ...(selectedStudent.interventions || [])]
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingIntervention(false);
    }
  };

  const handleResolveIntervention = async (interventionId: string) => {
    if (!selectedStudent) return;
    try {
      const { resolveIntervention } = await import('@/app/actions/interventions');
      const res = await resolveIntervention(interventionId);
      if (res.success) {
        setSelectedStudent({
          ...selectedStudent,
          interventions: selectedStudent.interventions?.filter((i: any) => i.id !== interventionId)
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] w-full relative">
      {/* LEFT PANE: Directory */}
      <div className={`${selectedStudent ? 'hidden lg:flex' : 'flex'} flex-col h-full bg-ink w-full lg:w-[40%] lg:min-w-[400px] lg:max-w-lg border-r border-admin-border transition-all duration-300`}>
        
        <div className="p-8 border-b border-white/5 bg-ink z-10 sticky top-0">
           <div className="space-y-1 mb-6">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-surface">Student CRM</h1>
            <p className="text-admin-muted text-sm md:w-3/4 leading-relaxed">Deep telemetry profiling. Monitor engagement, detect skipped content, and intervene before attrition.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
                <input 
                  type="text"
                  placeholder="Search roster..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-admin-surface border border-white/5 text-surface text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-all placeholder:text-admin-muted-dark shadow-inner"
                />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 px-5 py-3 border rounded-xl text-sm font-medium transition-all w-full sm:w-auto justify-center shadow-lg shadow-black/20 ${
                    selectedCohort !== 'All Cohorts' 
                      ? 'bg-white/10 border-white/20 text-surface' 
                      : 'bg-admin-surface border-white/5 text-surface hover:bg-white/5'
                  }`}
                >
                    <Filter className={`w-4 h-4 ${selectedCohort !== 'All Cohorts' ? 'text-accent' : 'text-admin-muted'}`} />
                    {selectedCohort}
                </button>
                
                {/* Cohort Dropdown */}
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-admin-surface border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                       {availableCohorts.map(cohort => (
                         <button
                           key={cohort}
                           onClick={() => {
                             setSelectedCohort(cohort);
                             setIsDropdownOpen(false);
                           }}
                           className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-admin-muted hover:text-surface hover:bg-white/5 transition-colors flex items-center justify-between"
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
        <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
          {displayStudents.length === 0 ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-transparent to-ink/50">
                <div className="w-16 h-16 rounded-2xl bg-admin-surface border border-white/5 flex items-center justify-center mb-4 shadow-2xl shadow-black/80 relative overflow-hidden">
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                     <div className="w-[100px] h-[100px] bg-[#B08D57] blur-[50px] rounded-full"></div>
                   </div>
                   <Users className="w-6 h-6 text-admin-muted-dark relative z-10" />
                </div>
                <h3 className="text-[15px] font-semibold text-surface tracking-tight mb-2">No records found</h3>
                <p className="text-[13px] text-admin-muted leading-relaxed max-w-[200px]">
                  {searchQuery || selectedCohort !== 'All Cohorts' 
                    ? "Adjust your filters or search query to find students."
                    : "No students are currently enrolled in this platform."}
                </p>
                {(searchQuery || selectedCohort !== 'All Cohorts') && (
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCohort('All Cohorts'); }}
                    className="mt-6 px-4 py-2 rounded-lg text-xs font-semibold text-surface bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-mono tracking-widest uppercase"
                  >
                    Clear Filters
                  </button>
                )}
             </div>
          ) : (
            displayStudents.map((student) => (
              <button
                key={student.id}
                onClick={() => handleSelectStudent(student)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group flex items-start gap-4
                  ${selectedStudent?.id === student.id 
                    ? 'bg-admin-surface border-white/10 shadow-xl shadow-black/40 scale-[1.01] z-10 relative' 
                    : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                }`}
              >
                 <div className="w-12 h-12 rounded-full bg-ink border border-white/10 flex flex-col items-center justify-center shrink-0 shadow-inner">
                   <span className="text-sm font-bold text-surface tracking-wider">{student.avatar}</span>
                 </div>
                 
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                       <span className={`font-semibold tracking-tight truncate transition-colors ${selectedStudent?.id === student.id ? 'text-surface' : 'text-[#E5E5E5] group-hover:text-surface'}`}>
                          {student.name}
                       </span>
                       {student.risk === 'high' && (
                         <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                       )}
                    </div>
                    <div className="text-xs text-admin-muted mb-3">{student.email}</div>
                    
                    {/* Miniature Progress Bar */}
                    <div className="flex flex-col gap-1.5 w-full">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-admin-muted-dark uppercase tracking-[0.1em]">{student.cohort}</span>
                            <span className="text-[10px] font-medium text-admin-muted">{student.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-ink rounded-full overflow-hidden shadow-inner border border-white/5">
                            <div 
                                className={`h-full rounded-full ${student.risk === 'high' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : student.risk === 'medium' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-emerald-500/80'}`}
                                style={{ width: `${student.progress}%` }}
                            />
                        </div>
                    </div>
                 </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANE: Telemetry CRM Canvas */}
      {selectedStudent ? (
        <div className="flex-1 bg-ink h-full overflow-y-auto animate-in slide-in-from-right-8 fade-in duration-300 relative">
           
           {/* Background Mesh (Subtle) */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.02),transparent_50%)] pointer-events-none" />

           <div className="max-w-4xl mx-auto p-12 space-y-12 relative z-10">
              
              {/* 1. Identity Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-12 border-b border-white/5">
                 <div className="flex flex-col md:flex-row md:items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-admin-surface border border-white/10 flex items-center justify-center shadow-lg shadow-black/40 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                      <span className="text-xl font-bold tracking-widest text-surface relative z-10">{selectedStudent.avatar}</span>
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-1.5">
                         <button onClick={() => setSelectedStudent(null)} className="lg:hidden p-1.5 -ml-1.5 rounded text-admin-muted hover:text-surface">
                            <ChevronLeft className="w-5 h-5" />
                         </button>
                         <h2 className="text-2xl font-semibold tracking-tight text-surface">{selectedStudent.name}</h2>
                         <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-widest uppercase bg-admin-surface border border-white/5 text-accent shadow-inner">{selectedStudent.cohort}</span>
                       </div>
                       <div className="flex items-center gap-3 text-xs text-admin-muted">
                          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-admin-muted-dark"/> {selectedStudent.email}</span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <a href={`mailto:${selectedStudent.email}`} className="text-accent hover:text-surface transition-colors flex items-center gap-1.5 font-medium">
                            <MessageSquare className="w-3.5 h-3.5" /> Contact
                          </a>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <Link href={`/dashboard?studentId=${selectedStudent.id}`} className="text-admin-muted hover:text-surface transition-colors flex items-center gap-1.5 font-medium underline underline-offset-4 pointer-events-auto">
                            View Auth<Maximize2 className="w-3.5 h-3.5" />
                          </Link>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsInterventionModalOpen(true)}
                      className="px-4 py-2 transition-all rounded-lg font-medium text-sm tracking-wide bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-inner hover:bg-rose-500/20 active:scale-95 flex items-center gap-2"
                    >
                      <ShieldAlert className="w-4 h-4" /> Log Intervention
                    </button>
                    <button 
                      onClick={() => setSelectedStudent(null)}
                      className="p-2 transition-colors rounded text-admin-muted-dark hover:text-surface hover:bg-white/5 active:scale-95"
                    >
                      <X className="w-4 h-4" />
                    </button>
                 </div>
              </div>

              {/* Active Interventions Alert Block */}
              {selectedStudent.interventions && selectedStudent.interventions.length > 0 && (
                 <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6">
                    <h3 className="text-rose-500 text-sm font-semibold tracking-wide uppercase mb-4 flex items-center gap-2">
                       <ShieldAlert className="w-4 h-4" /> Open Interventions ({selectedStudent.interventions.length})
                    </h3>
                    <div className="space-y-3">
                       {selectedStudent.interventions.map((intervention: any) => (
                          <div key={intervention.id} className="bg-ink/50 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
                             <div>
                                <div className="text-surface font-medium mb-1">{intervention.reason}</div>
                                <div className="text-admin-muted text-sm border-l-2 border-white/10 pl-3 italic">
                                  Action: {intervention.actionTaken || "No action recorded yet"}
                                </div>
                             </div>
                             <button
                               onClick={() => handleResolveIntervention(intervention.id)}
                               className="px-3 py-1.5 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors shrink-0"
                             >
                               Mark Resolved
                             </button>
                          </div>
                       ))}
                    </div>
                 </div>
              )}

              {/* 2. Academic Summary Band */}
              <div className="bg-admin-surface/30 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5">
                 <div className="flex-1 px-8 first:pl-4 last:pr-4 py-4 md:py-0 flex flex-col justify-start">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-admin-muted-dark mb-3">Academic Standing</span>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedStudent.risk === 'high' ? 'bg-rose-500' : selectedStudent.risk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <span className="text-sm font-medium tracking-tight text-surface">
                        {selectedStudent.risk === 'high' ? 'Critical' : selectedStudent.risk === 'medium' ? 'Warning' : 'Healthy'}
                      </span>
                    </div>
                 </div>
                 
                 <div className="flex-1 px-8 first:pl-4 last:pr-4 py-4 md:py-0 flex flex-col justify-start">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-admin-muted-dark mb-3">Learning Progress</span>
                    <div className="flex items-center gap-4">
                       <span className="text-sm font-medium tracking-tight text-surface w-8">{selectedStudent.progress}%</span>
                       <div className="flex-1 h-[3px] bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${selectedStudent.progress > 80 ? 'bg-emerald-500' : selectedStudent.progress > 40 ? 'bg-amber-500' : 'bg-white/20'}`} style={{ width: `${selectedStudent.progress}%` }} />
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 px-8 first:pl-4 last:pr-4 py-4 md:py-0 flex flex-col justify-start">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-admin-muted-dark mb-3">Recent Activity</span>
                    <div className="flex items-center gap-2.5">
                       <Clock className="w-3.5 h-3.5 text-admin-muted-dark" />
                       <span className="text-sm font-medium tracking-tight text-surface">{selectedStudent.lastActive}</span>
                    </div>
                 </div>
              </div>

              {/* 3. Record Modules */}
              {!isLoadingTelemetry && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-8 animate-in fade-in duration-300">
                   {/* Learning Activity */}
                   <div className="space-y-8">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-surface flex items-center gap-2">
                         Learning Activity
                      </h3>
                      <div className="space-y-5">
                         {selectedStudent.telemetry && selectedStudent.telemetry.length > 0 ? selectedStudent.telemetry.map((log, i) => (
                            <div key={i} className="flex flex-col gap-2.5 group">
                               <div className="flex items-center justify-between">
                                  <span className="text-sm text-[#AAAAAA] group-hover:text-surface transition-colors line-clamp-1 pr-4">{log.lesson}</span>
                                  {log.status === 'skipped' ? (
                                     <span className="text-[10px] font-medium tracking-wider uppercase text-admin-muted-dark shrink-0">Skipped</span>
                                  ) : (
                                     <span className="text-[10px] font-medium tracking-wider uppercase text-emerald-500/80 shrink-0">Completed</span>
                                  )}
                               </div>
                               <div className="flex items-center gap-4">
                                  <div className="flex-1 h-[2px] bg-white/5 rounded-full overflow-hidden">
                                     <div className={`h-full ${log.status === 'skipped' ? 'bg-[#525252]' : 'bg-emerald-500/50'}`} style={{ width: `${Math.min((log.watched/log.total)*100, 100)}%` }} />
                                  </div>
                               </div>
                            </div>
                         )) : (
                            <div className="py-8 opacity-50 text-sm text-admin-muted-dark">No activity recorded.</div>
                         )}
                      </div>
                   </div>

                   {/* Assessment Record */}
                   <div className="space-y-8">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-surface flex items-center gap-2">
                         Assessment Record
                      </h3>
                      <div className="space-y-2">
                         {selectedStudent.grades && selectedStudent.grades.length > 0 ? selectedStudent.grades.map((grade, i) => (
                            <div key={i} className="py-3 flex items-start justify-between border-b border-white/5 last:border-0 group">
                               <div>
                                  <div className="text-sm text-[#AAAAAA] group-hover:text-surface transition-colors mb-1 line-clamp-1 pr-4">{grade.sprint}</div>
                                  <div className="text-[11px] text-admin-muted-dark break-normal">{grade.date}</div>
                               </div>
                               <div className="flex flex-col items-end gap-1 shrink-0">
                                  <span className="text-sm font-medium text-surface">{grade.score}<span className="text-admin-muted-dark">/100</span></span>
                                  <span className={`text-[10px] font-medium tracking-wider uppercase ${grade.arch === 'Pass' ? 'text-emerald-500/80' : 'text-amber-500/80'}`}>
                                    {grade.arch}
                                  </span>
                               </div>
                            </div>
                         )) : (
                            <div className="py-8 opacity-50 text-sm text-admin-muted-dark">No graded submissions.</div>
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
           </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center h-full bg-ink border-l border-white/5 relative z-0">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_60%)] pointer-events-none" />
           <div className="w-20 h-20 rounded-[2rem] bg-admin-surface border border-white/5 flex items-center justify-center mb-8 shadow-2xl shadow-black/50 relative z-10">
              <Search className="w-8 h-8 text-admin-muted-dark" />
           </div>
           <h3 className="text-2xl font-medium text-surface mb-3 tracking-tight relative z-10">Select a student record</h3>
           <p className="text-admin-muted text-sm text-center max-w-sm leading-relaxed relative z-10">
             Directory sync active. Select a simulated or live student profile to inspect their telemetry schema.
           </p>
        </div>
      )}

      {/* Intervention Modal Portal */}
      {isInterventionModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-admin-surface border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-200">
              <button onClick={() => setIsInterventionModalOpen(false)} className="absolute top-6 right-6 text-admin-muted-dark hover:text-surface">
                 <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-semibold text-surface mb-2">Log Student Intervention</h3>
              <p className="text-sm text-admin-muted mb-6">Flag {selectedStudent.name} for critical risk. This will appear on the Command Center Inbox for the ops team to monitor.</p>
              
              <form onSubmit={handleLogIntervention} className="space-y-5">
                 <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-admin-muted-dark mb-2">Reason for Intervention</label>
                    <textarea 
                       required
                       value={interventionReason}
                       onChange={(e) => setInterventionReason(e.target.value)}
                       className="w-full bg-ink border border-white/10 rounded-xl p-4 text-sm text-surface focus:outline-none focus:border-accent"
                       placeholder="e.g. Skipped multiple UI milestones and failed last 2 assessments."
                       rows={3}
                    />
                 </div>
                 <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-admin-muted-dark mb-2">Action Taken (Optional)</label>
                    <textarea 
                       value={interventionAction}
                       onChange={(e) => setInterventionAction(e.target.value)}
                       className="w-full bg-ink border border-white/10 rounded-xl p-4 text-sm text-surface focus:outline-none focus:border-accent"
                       placeholder="e.g. Emailed student scheduling a 1:1 on Thursday."
                       rows={2}
                    />
                 </div>
                 <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={isSubmittingIntervention}
                      className="w-full py-3 bg-rose-500 text-white rounded-xl font-medium tracking-wide shadow-lg hover:bg-rose-400 disabled:opacity-50 transition-colors"
                    >
                      {isSubmittingIntervention ? 'Logging...' : 'Open Official Intervention'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}

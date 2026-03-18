"use client";

import { useState } from 'react';
import { Bot, CheckCircle2, ChevronRight, FileCode, Search, AlertCircle, Maximize2, X, Terminal, GitMerge, FileJson, Loader2 } from 'lucide-react';
import { submitFinalGrade } from '@/app/actions/reviews';

export interface UI_Submission {
  id: string;
  studentName: string;
  cohort: string;
  sprint: string;
  status: string;
  submittedAt: string;
  repoUrl: string;
  aiScore: number | null;
  aiConfidenceScore: number | null;
  aiFlags?: number | null;
  aiArchQuality?: string | null;
  aiAnalysis: string | null;
  aiPrimaryEntrypoints?: { file: string, note: string, type: string }[] | null;
  aiFeedback?: string | null;
}

export default function ReviewQueueClient({ initialSubmissions }: { initialSubmissions: UI_Submission[] }) {
  const [submissions, setSubmissions] = useState<UI_Submission[]>(initialSubmissions);
  const [selectedSumissionId, setSelectedSubmissionId] = useState<string | null>(initialSubmissions.length > 0 ? initialSubmissions[0].id : null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Controlled fields for manual overrides
  const [manualScore, setManualScore] = useState<number | null>(null);
  const [manualFeedback, setManualFeedback] = useState<string | null>(null);

  const selectedSumission = submissions.find(s => s.id === selectedSumissionId);

  const runAIGrading = async () => {
    if (!selectedSumission) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: selectedSumission.repoUrl,
          sprintContext: selectedSumission.sprint,
          studentName: selectedSumission.studentName,
          submissionId: selectedSumission.id
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Backend Grading Error:", errorData);
        throw new Error(errorData.error || 'Failed to generate grading');
      }
      
      const data = await response.json();
      
      setSubmissions(prev => prev.map(sub => {
        if (sub.id === selectedSumission.id) {
          return {
            ...sub,
            status: 'draft_review',
            aiScore: data.totalScore,
            aiConfidenceScore: data.confidenceScore || data.totalScore,
            aiArchQuality: data.archQuality,
            aiFlags: data.securityFlags,
            aiAnalysis: data.analysis,
            aiPrimaryEntrypoints: data.primaryEntrypoints,
            aiFeedback: data.feedback
          };
        }
        return sub;
      }));
      
      setManualScore(data.totalScore);
      setManualFeedback(data.feedback);

    } catch (error) {
      console.error(error);
      alert('Failed to connect to OpenAI endpoint.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinalSubmit = async (status: 'PASSED' | 'REVISIONS_REQUESTED' | 'REJECTED') => {
    if (!selectedSumission) return;
    
    const finalScore = manualScore !== null ? manualScore : (selectedSumission.aiScore || 0);
    const finalFeedback = manualFeedback !== null ? manualFeedback : (selectedSumission.aiFeedback || '');

    setIsSubmitting(true);
    try {
      await submitFinalGrade(selectedSumission.id, finalScore, finalFeedback, status);
      // Remove from visual queue since it's processed
      setSubmissions(prev => prev.filter(s => s.id !== selectedSumission.id));
      setSelectedSubmissionId(null);
    } catch (e) {
      alert("Failed to save final grade. Ensure you are authorized.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingCount = submissions.filter(s => s.status === 'pending_ai').length;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full max-w-[1600px] mx-auto overflow-hidden text-surface">
      
      {/* LEFT PANE: QUEUE */}
      <div className="w-[380px] shrink-0 border-r border-admin-border bg-ink flex flex-col h-full z-10 relative">
        
        {/* Header */}
        <div className="p-6 border-b border-admin-border flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">Review Queue</h1>
            <div className="bg-white/5 border border-admin-border px-2.5 py-1 rounded text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
              {pendingCount} Pending
            </div>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
            <input 
              type="text" 
              placeholder="Search by student or sprint..."
              className="w-full bg-admin-surface border border-admin-border rounded-xl py-2.5 pl-9 pr-4 text-[13px] focus:outline-none focus:border-admin-border-hover transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {submissions.length === 0 ? (
             <div className="py-12 text-center text-admin-muted text-sm px-4">
                No active reviews in the queue.
             </div>
          ) : submissions.map((sub) => (
             <button 
               key={sub.id}
               onClick={() => setSelectedSubmissionId(sub.id)}
               className={`w-full text-left p-4 rounded-xl border transition-all ${
                 selectedSumissionId === sub.id 
                   ? 'bg-admin-surface border-admin-border-hover shadow-lg shadow-black/50' 
                   : 'bg-ink border-transparent hover:border-admin-border hover:bg-white/[0.02]'
               }`}
             >
               <div className="flex items-start justify-between mb-3">
                 <div className="flex flex-col gap-1">
                   <span className="text-[13px] font-medium text-surface leading-none">{sub.studentName}</span>
                   <span className="text-[11px] text-admin-muted">{sub.cohort}</span>
                 </div>
                 {sub.status === 'draft_review' && (
                   <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                     <Bot className="w-3 h-3 text-indigo-400" />
                   </div>
                 )}
                 {sub.status === 'pending_ai' && (
                   <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                     <AlertCircle className="w-3 h-3 text-amber-400" />
                   </div>
                 )}
                 {sub.status === 'graded' && (
                   <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                     <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                   </div>
                 )}
               </div>
               
               <div className="text-[12px] text-gray-300 font-medium mb-3 truncate">{sub.sprint}</div>
               
               <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-semibold text-admin-muted">
                 <span className={`${sub.submittedAt.includes('BREACHED') ? 'text-rose-400' : ''}`}>{sub.submittedAt}</span>
                 {sub.status !== 'pending_ai' && sub.aiScore !== null && <span className="text-accent">AI Score: {sub.aiScore}/100</span>}
                 {sub.status === 'pending_ai' && <span className="text-amber-500/80">Awaiting AI</span>}
               </div>
             </button>
           ))}
        </div>
      </div>

      {/* RIGHT PANE: AI ASSISTANT / GRADING WINDOW */}
      <div className="flex-1 bg-ink flex flex-col h-full relative overflow-hidden">
        {selectedSumission ? (
          <>
            {/* Top Toolbar */}
            <div className="h-[72px] shrink-0 border-b border-admin-border flex items-center justify-between px-8 bg-ink">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-admin-border flex items-center justify-center">
                   <FileCode className="w-5 h-5 text-admin-muted" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[14px] font-semibold text-surface flex items-center gap-2">
                    {selectedSumission.sprint}
                    <span className="text-[10px] text-admin-muted font-normal uppercase tracking-[0.2em] bg-white/5 px-2 py-0.5 rounded border border-admin-border">{selectedSumission.studentName}</span>
                  </h2>
                  <a href={selectedSumission.repoUrl.startsWith('http') ? selectedSumission.repoUrl : `https://${selectedSumission.repoUrl}`} target="_blank" rel="noreferrer" className="text-[12px] text-blue-400 hover:text-blue-300 font-mono transition-colors mt-1 flex items-center gap-1 w-fit">
                    {selectedSumission.repoUrl}
                    <Maximize2 className="w-3 h-3" />
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {selectedSumission.status !== 'pending_ai' && (
                  <>
                    <button 
                      onClick={() => handleFinalSubmit('REJECTED')}
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl border border-admin-border text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-muted hover:text-surface hover:bg-admin-surface transition-colors disabled:opacity-50"
                    >
                      Reject Submission
                    </button>
                    {(selectedSumission.aiConfidenceScore !== null && selectedSumission.aiConfidenceScore < 80) && manualScore === selectedSumission.aiScore ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-[10px] font-semibold tracking-[0.1em] uppercase">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Low AI Confidence: Modify Score Manually
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleFinalSubmit('PASSED')}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] text-[#0B0B0C] text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-white/90 transition-colors shadow-lg shadow-white/10 flex items-center gap-2 disabled:opacity-50"
                      >
                         {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                         Approve & Grade
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Split Content Area */}
            <div className="flex-1 flex overflow-hidden">
               
               {/* Code / Rubric Inspection pane */}
               <div className="flex-1 min-w-[500px] border-r border-admin-border p-8 overflow-y-auto space-y-8 flex flex-col relative">
                  
                  {selectedSumission.status === 'pending_ai' ? (
                     <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                        <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 relative">
                           {isGenerating && <div className="absolute inset-0 rounded-full border-2 border-indigo-500/50 border-t-transparent animate-spin"></div>}
                           <Bot className={`w-8 h-8 text-indigo-400 ${isGenerating ? 'animate-pulse' : ''}`} />
                        </div>
                        <h2 className="text-[18px] font-semibold tracking-tight text-surface mb-3">
                           {isGenerating ? 'Analyzing Repository...' : 'AI Grading Assistant Ready'}
                        </h2>
                        <p className="text-[14px] text-[#A1A1AA] leading-relaxed mb-8">
                           {isGenerating 
                              ? 'GPT-4o-mini is reading the codebase, executing static checks, and synthesizing against the OpenSch rubric. This usually takes 5-10 seconds.' 
                              : 'Run the grading assistant to generate a baseline rubric score, architectural analysis, and a personalized feedback draft for the student.'}
                        </p>
                        <button 
                           onClick={runAIGrading}
                           disabled={isGenerating}
                           className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-bold tracking-[0.2em] uppercase transition-colors shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {isGenerating ? (
                              <><Loader2 className="w-4 h-4 animate-spin" /> Deep Scanning...</>
                           ) : (
                              <><Bot className="w-4 h-4" /> Run AI Analysis</>
                           )}
                        </button>
                     </div>
                  ) : (
                    <>
                      {/* AI Status Banner */}
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 flex flex-col gap-3 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                         <div className="flex items-center gap-2 text-indigo-400 font-semibold tracking-[0.2em] text-[10px] uppercase">
                            <Bot className="w-4 h-4" />
                            AI Grading Analysis Complete
                         </div>
                         <p className="text-[13px] xl:text-[14px] text-gray-300 leading-relaxed relative z-10 max-w-2xl">
                            {selectedSumission.aiAnalysis || "Pending rationales..."} 
                         </p>
                         <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                            <div className="bg-black/40 border border-admin-border rounded-xl p-3 flex flex-col gap-1 items-center justify-center text-center">
                               <span className="text-[9px] uppercase tracking-[0.2em] text-admin-muted font-semibold">Total Score</span>
                               <span className="text-xl font-bold text-surface">{selectedSumission.aiScore || 0}/100</span>
                            </div>
                            <div className="bg-black/40 border border-admin-border rounded-xl p-3 flex flex-col gap-1 items-center justify-center text-center">
                               <span className="text-[9px] uppercase tracking-[0.2em] text-admin-muted font-semibold">AI Confidence</span>
                               <span className={`text-xl font-bold ${selectedSumission.aiConfidenceScore && selectedSumission.aiConfidenceScore >= 80 ? 'text-indigo-400' : 'text-amber-500'}`}>
                                  {selectedSumission.aiConfidenceScore || 0}%
                               </span>
                            </div>
                            <div className="bg-black/40 border border-admin-border rounded-xl p-3 flex flex-col gap-1 items-center justify-center text-center">
                               <span className="text-[9px] uppercase tracking-[0.2em] text-admin-muted font-semibold">Arch Quality</span>
                               <span className={`text-xl font-bold ${selectedSumission.aiArchQuality === 'Pass' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                 {selectedSumission.aiArchQuality || "Pass"}
                               </span>
                            </div>
                            <div className="bg-black/40 border border-amber-500/20 rounded-xl p-3 flex flex-col gap-1 items-center justify-center text-center col-span-2 lg:col-span-3">
                               <span className="text-[9px] uppercase tracking-[0.2em] text-admin-muted font-semibold">Security Flags</span>
                               <span className={`text-xl font-bold ${selectedSumission.aiFlags && selectedSumission.aiFlags > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                 {selectedSumission.aiFlags || 0}
                               </span>
                            </div>
                         </div>
                      </div>

                      {/* Pseudo Code Preview */}
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100 space-y-4">
                         <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-admin-muted">Repository Structure Highlights</h3>
                         <div className="bg-admin-surface rounded-2xl border border-admin-border overflow-hidden flex flex-col font-mono text-[13px]">
                            <div className="flex items-center gap-2 p-3 border-b border-admin-border bg-ink text-admin-muted">
                               <Terminal className="w-3.5 h-3.5" />
                               <span className="text-[11px]">Primary Entrypoints Found</span>
                            </div>
                            <div className="p-4 flex flex-col gap-2 text-gray-300">
                               {selectedSumission.aiPrimaryEntrypoints && selectedSumission.aiPrimaryEntrypoints.length > 0 
                                  ? selectedSumission.aiPrimaryEntrypoints.map((entry, idx) => (
                                     <div key={idx} className="flex items-center gap-2">
                                       {entry.type === 'config' ? <FileJson className="w-3.5 h-3.5 text-amber-400"/> : entry.type === 'code' ? <FileCode className="w-3.5 h-3.5 text-blue-400"/> : <Terminal className="w-3.5 h-3.5 text-gray-400" />}
                                       {entry.file} 
                                       <span className="text-admin-muted ml-auto text-[11px]">({entry.note})</span>
                                     </div>
                                  ))
                                  : <div className="opacity-50 text-sm">No specific entrypoints parsed.</div>
                               }
                            </div>
                         </div>
                      </div>
                    </>
                  )}

               </div>

               {/* Human Review Composition Pane */}
               <div className="w-[320px] lg:w-[400px] shrink-0 bg-ink border-l border-admin-border flex flex-col relative z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
                  <div className="p-6 border-b border-admin-border">
                     <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-admin-muted flex items-center gap-2">
                       Final Evaluation Notes
                     </h3>
                  </div>
                  <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
                     
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-muted">Final Score (0-100)</label>
                        <input 
                           type="number" 
                           key={`score-${selectedSumission.id}-${selectedSumission.aiScore}`} 
                           defaultValue={selectedSumission.aiScore || ''}
                           onChange={(e) => setManualScore(Number(e.target.value))}
                           disabled={selectedSumission.status === 'pending_ai' || isSubmitting}
                           placeholder="--"
                           className="w-24 bg-admin-surface border border-admin-border rounded-xl py-3 px-4 text-[16px] font-bold text-surface focus:outline-none focus:border-accent disabled:opacity-50"
                        />
                     </div>

                     <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center justify-between">
                           <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-muted">Feedback for Student</label>
                           {selectedSumission.status !== 'pending_ai' && (
                             <button 
                                onClick={runAIGrading}
                                disabled={isGenerating || isSubmitting}
                                className="text-[9px] text-indigo-400 hover:text-indigo-300 uppercase tracking-[0.2em] font-semibold flex items-center gap-1 disabled:opacity-50"
                             >
                                <Bot className="w-3 h-3" />
                                Regenerate Draft
                             </button>
                           )}
                        </div>
                        <textarea 
                           className="w-full flex-1 bg-admin-surface border border-admin-border rounded-xl p-4 text-[13px] text-surface leading-relaxed resize-none focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                           key={`feedback-${selectedSumission.id}-${selectedSumission.aiFeedback?.length}`}
                           defaultValue={selectedSumission.aiFeedback || ''}
                           onChange={(e) => setManualFeedback(e.target.value)}
                           disabled={selectedSumission.status === 'pending_ai' || isGenerating || isSubmitting}
                           placeholder={selectedSumission.status === 'pending_ai' ? "Run the AI Grading Assistant first, or enter manual feedback." : "Enter feedback here..."}
                        />
                     </div>
                  </div>
               </div>

            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-admin-border flex items-center justify-center mb-6">
               <CheckCircle2 className="w-6 h-6 text-admin-muted" />
            </div>
            <h2 className="text-[16px] font-semibold text-surface mb-2">Queue Zero</h2>
            <p className="text-[13px] text-admin-muted max-w-[280px]">
              Select a submission from the pending queue to begin grading. All caught up for now.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

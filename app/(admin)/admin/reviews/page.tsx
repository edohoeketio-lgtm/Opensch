"use client";

import { useState } from 'react';
import { Bot, CheckCircle2, ChevronRight, FileCode, Search, AlertCircle, Maximize2, X, Terminal, GitMerge, FileJson, Loader2 } from 'lucide-react';

// --- MOCK DATA FOR UI DEVELOPMENT ---
interface Submission {
  id: string;
  studentName: string;
  cohort: string;
  sprint: string;
  status: 'pending_ai' | 'draft_review' | 'graded';
  submittedAt: string;
  repoUrl: string;
  // Generated AI Data
  aiScore?: number;
  aiFlags?: number;
  aiArchQuality?: string;
  aiAnalysis?: string;
  aiPrimaryEntrypoints?: { file: string, note: string, type: string }[];
  aiFeedback?: string;
}

const initialSubmissions: Submission[] = [
  { 
    id: 'sub_1', 
    studentName: 'Alexander Chi', 
    cohort: 'Cohort 4', 
    sprint: 'Sprint 3: AI Tool Creation', 
    status: 'draft_review', 
    submittedAt: '10 mins ago', 
    repoUrl: 'github.com/alexchi/opensch-tool', 
    aiScore: 92, 
    aiFlags: 1,
    aiArchQuality: 'Pass',
    aiAnalysis: 'The codebase successfully implements the required LangChain agent architecture. Authentication boundaries are secure, but the prompt injection mitigation in agent/executor.ts could be tighter.',
    aiPrimaryEntrypoints: [
      { file: 'agent/executor.ts', note: '142 lines', type: 'code' },
      { file: 'package.json', note: 'Dependencies check pass', type: 'config' },
      { file: 'lib/tools/search.ts', note: 'Custom Tool Impl', type: 'code' }
    ],
    aiFeedback: `Alexander, fantastic work on this implementation. Your agent orchestration logic in \`executor.ts\` is incredibly clean and follows the declarative patterns we discussed in Module 2.\n\nOne area of improvement (and the reason for the minor deduction): check out line 42 in your parsing logic. You are blindly trusting the LLM output without a Zod validation schema. Always establish a strict type boundary when crossing the LLM threshold.\n\nI've linked a resource in the syllabus on structured output validation. Review that, but otherwise, this is a phenomenal submission.`
  },
  { id: 'sub_2', studentName: 'Sarah Jenkins', cohort: 'Cohort 4', sprint: 'Sprint 3: AI Tool Creation', status: 'pending_ai', submittedAt: '1 hour ago', repoUrl: 'github.com/sjenkins/agent-node' },
  { id: 'sub_3', studentName: 'David K.', cohort: 'Cohort 3', sprint: 'Capstone: Fullstack App', status: 'graded', submittedAt: '2 days ago', repoUrl: 'github.com/dk/final-project', aiScore: 88, aiFlags: 0, aiArchQuality: 'Pass', aiAnalysis: 'Solid fullstack implementation using Next.js and Prisma. Good use of server actions.', aiPrimaryEntrypoints: [{file: 'app/layout.tsx', note: 'Root provider setup', type: 'config'}], aiFeedback: 'David, this capstone is robust.' },
  { id: 'sub_4', studentName: 'Akpan Mummy', cohort: 'Cohort 5', sprint: 'Capstone: OpenSch LMS architecture', status: 'pending_ai', submittedAt: 'Just now', repoUrl: 'github.com/edohoeketio-lgtm/Opensch' },
];

export default function AIReviewQueue() {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [selectedSumissionId, setSelectedSubmissionId] = useState<string | null>(initialSubmissions[0].id);
  const [isGenerating, setIsGenerating] = useState(false);

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
          studentName: selectedSumission.studentName
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate grading');
      }
      
      const data = await response.json();
      
      // Update local state to transition to drafted and show AI generated info
      setSubmissions(prev => prev.map(sub => {
        if (sub.id === selectedSumission.id) {
          return {
            ...sub,
            status: 'draft_review',
            aiScore: data.totalScore,
            aiArchQuality: data.archQuality,
            aiFlags: data.securityFlags,
            aiAnalysis: data.analysis,
            aiPrimaryEntrypoints: data.primaryEntrypoints,
            aiFeedback: data.feedback
          };
        }
        return sub;
      }));

    } catch (error) {
      console.error(error);
      alert('Failed to connect to OpenAI endpoint.');
    } finally {
      setIsGenerating(false);
    }
  };

  const pendingCount = submissions.filter(s => s.status === 'pending_ai').length;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full max-w-[1600px] mx-auto overflow-hidden text-[#FFFFFF]">
      
      {/* LEFT PANE: QUEUE */}
      <div className="w-[380px] shrink-0 border-r border-[#2D2D2D] bg-[#111111] flex flex-col h-full z-10 relative">
        
        {/* Header */}
        <div className="p-6 border-b border-[#2D2D2D] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">Review Queue</h1>
            <div className="bg-white/5 border border-[#2D2D2D] px-2.5 py-1 rounded text-[10px] uppercase tracking-[0.2em] text-[#B08D57] font-semibold">
              {pendingCount} Pending
            </div>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
            <input 
              type="text" 
              placeholder="Search by student or sprint..."
              className="w-full bg-[#1C1C1E] border border-[#2D2D2D] rounded-xl py-2.5 pl-9 pr-4 text-[13px] focus:outline-none focus:border-[#4A4A5C] transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {submissions.map((sub) => (
            <button 
              key={sub.id}
              onClick={() => setSelectedSubmissionId(sub.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedSumissionId === sub.id 
                  ? 'bg-[#1C1C1E] border-[#4A4A5C] shadow-lg shadow-black/50' 
                  : 'bg-[#111111] border-transparent hover:border-[#2D2D2D] hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-medium text-[#FFFFFF] leading-none">{sub.studentName}</span>
                  <span className="text-[11px] text-[#888888]">{sub.cohort}</span>
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
              
              <div className="text-[12px] text-[#D1D5DB] font-medium mb-3 truncate">{sub.sprint}</div>
              
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-semibold text-[#888888]">
                <span>{sub.submittedAt}</span>
                {sub.status !== 'pending_ai' && sub.aiScore && <span className="text-[#B08D57]">AI Score: {sub.aiScore}/100</span>}
                {sub.status === 'pending_ai' && <span className="text-amber-500/80">Awaiting AI</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT PANE: AI ASSISTANT / GRADING WINDOW */}
      <div className="flex-1 bg-[#111111] flex flex-col h-full relative overflow-hidden">
        {selectedSumission ? (
          <>
            {/* Top Toolbar */}
            <div className="h-[72px] shrink-0 border-b border-[#2D2D2D] flex items-center justify-between px-8 bg-[#111111]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-[#2D2D2D] flex items-center justify-center">
                   <FileCode className="w-5 h-5 text-[#888888]" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[14px] font-semibold text-[#FFFFFF] flex items-center gap-2">
                    {selectedSumission.sprint}
                    <span className="text-[10px] text-[#888888] font-normal uppercase tracking-[0.2em] bg-white/5 px-2 py-0.5 rounded border border-[#2D2D2D]">{selectedSumission.studentName}</span>
                  </h2>
                  <a href={`https://${selectedSumission.repoUrl}`} target="_blank" rel="noreferrer" className="text-[12px] text-blue-400 hover:text-blue-300 font-mono transition-colors mt-1 flex items-center gap-1 w-fit">
                    {selectedSumission.repoUrl}
                    <Maximize2 className="w-3 h-3" />
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {selectedSumission.status !== 'pending_ai' && (
                  <>
                    <button className="px-5 py-2.5 rounded-xl border border-[#2D2D2D] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888] hover:text-[#FFFFFF] hover:bg-[#1C1C1E] transition-colors">
                      Reject Submission
                    </button>
                    <button className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] text-[#0B0B0C] text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-white/90 transition-colors shadow-lg shadow-white/10 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve & Grade
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Split Content Area */}
            <div className="flex-1 flex overflow-hidden">
               
               {/* Code / Rubric Inspection pane */}
               <div className="flex-1 min-w-[500px] border-r border-[#2D2D2D] p-8 overflow-y-auto space-y-8 flex flex-col relative">
                  
                  {selectedSumission.status === 'pending_ai' ? (
                     <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                        <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 relative">
                           {isGenerating && <div className="absolute inset-0 rounded-full border-2 border-indigo-500/50 border-t-transparent animate-spin"></div>}
                           <Bot className={`w-8 h-8 text-indigo-400 ${isGenerating ? 'animate-pulse' : ''}`} />
                        </div>
                        <h2 className="text-[18px] font-semibold tracking-tight text-[#FFFFFF] mb-3">
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
                         <p className="text-[13px] xl:text-[14px] text-[#D1D5DB] leading-relaxed relative z-10 max-w-2xl">
                            {selectedSumission.aiAnalysis} 
                         </p>
                         <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                            <div className="bg-black/40 border border-[#2D2D2D] rounded-xl p-3 flex flex-col gap-1 items-center justify-center text-center">
                               <span className="text-[9px] uppercase tracking-[0.2em] text-[#888888] font-semibold">Total Score</span>
                               <span className="text-xl font-bold text-[#FFFFFF]">{selectedSumission.aiScore}/100</span>
                            </div>
                            <div className="bg-black/40 border border-[#2D2D2D] rounded-xl p-3 flex flex-col gap-1 items-center justify-center text-center">
                               <span className="text-[9px] uppercase tracking-[0.2em] text-[#888888] font-semibold">Arch Quality</span>
                               <span className={`text-xl font-bold ${selectedSumission.aiArchQuality === 'Pass' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                 {selectedSumission.aiArchQuality}
                               </span>
                            </div>
                            <div className="bg-black/40 border border-amber-500/20 rounded-xl p-3 flex flex-col gap-1 items-center justify-center text-center col-span-2 lg:col-span-1">
                               <span className="text-[9px] uppercase tracking-[0.2em] text-[#888888] font-semibold">Security Flags</span>
                               <span className={`text-xl font-bold ${selectedSumission.aiFlags && selectedSumission.aiFlags > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                 {selectedSumission.aiFlags}
                               </span>
                            </div>
                         </div>
                      </div>

                      {/* Pseudo Code Preview */}
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100 space-y-4">
                         <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#888888]">Repository Structure Highlights</h3>
                         <div className="bg-[#1C1C1E] rounded-2xl border border-[#2D2D2D] overflow-hidden flex flex-col font-mono text-[13px]">
                            <div className="flex items-center gap-2 p-3 border-b border-[#2D2D2D] bg-[#111111] text-[#888888]">
                               <Terminal className="w-3.5 h-3.5" />
                               <span className="text-[11px]">Primary Entrypoints Found</span>
                            </div>
                            <div className="p-4 flex flex-col gap-2 text-[#D1D5DB]">
                               {selectedSumission.aiPrimaryEntrypoints?.map((entry, idx) => (
                                 <div key={idx} className="flex items-center gap-2">
                                   {entry.type === 'config' ? <FileJson className="w-3.5 h-3.5 text-amber-400"/> : entry.type === 'code' ? <FileCode className="w-3.5 h-3.5 text-blue-400"/> : <Terminal className="w-3.5 h-3.5 text-gray-400" />}
                                   {entry.file} 
                                   <span className="text-[#888888] ml-auto text-[11px]">({entry.note})</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                    </>
                  )}

               </div>

               {/* Human Review Composition Pane */}
               <div className="w-[320px] lg:w-[400px] shrink-0 bg-[#111111] border-l border-[#2D2D2D] flex flex-col relative z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
                  <div className="p-6 border-b border-[#2D2D2D]">
                     <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#888888] flex items-center gap-2">
                      Final Evaluation Notes
                     </h3>
                  </div>
                  <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
                     
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888]">Final Score (0-100)</label>
                        <input 
                           type="number" 
                           key={`score-${selectedSumission.id}-${selectedSumission.aiScore}`} 
                           defaultValue={selectedSumission.aiScore || ''}
                           disabled={selectedSumission.status === 'pending_ai'}
                           placeholder="--"
                           className="w-24 bg-[#1C1C1E] border border-[#2D2D2D] rounded-xl py-3 px-4 text-[16px] font-bold text-[#FFFFFF] focus:outline-none focus:border-[#B08D57] disabled:opacity-50"
                        />
                     </div>

                     <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center justify-between">
                           <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888]">Feedback for Student</label>
                           {selectedSumission.status !== 'pending_ai' && (
                             <button className="text-[9px] text-indigo-400 hover:text-indigo-300 uppercase tracking-[0.2em] font-semibold flex items-center gap-1">
                                <Bot className="w-3 h-3" />
                                Regenerate Draft
                             </button>
                           )}
                        </div>
                        <textarea 
                           className="w-full flex-1 bg-[#1C1C1E] border border-[#2D2D2D] rounded-xl p-4 text-[13px] text-[#FFFFFF] leading-relaxed resize-none focus:outline-none focus:border-[#B08D57] transition-colors disabled:opacity-50"
                           key={`feedback-${selectedSumission.id}-${selectedSumission.aiFeedback?.length}`}
                           defaultValue={selectedSumission.aiFeedback || ''}
                           disabled={selectedSumission.status === 'pending_ai' || isGenerating}
                           placeholder={selectedSumission.status === 'pending_ai' ? "Run the AI Grading Assistant first, or enter manual feedback." : "Enter feedback here..."}
                        />
                     </div>
                  </div>
               </div>

            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-[#2D2D2D] flex items-center justify-center mb-6">
               <CheckCircle2 className="w-6 h-6 text-[#888888]" />
            </div>
            <h2 className="text-[16px] font-semibold text-[#FFFFFF] mb-2">Queue Zero</h2>
            <p className="text-[13px] text-[#888888] max-w-[280px]">
              Select a submission from the pending queue to begin grading. All caught up for now.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

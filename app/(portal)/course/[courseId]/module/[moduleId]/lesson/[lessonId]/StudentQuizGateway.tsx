"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle, ArrowRight, PlayCircle, Loader2 } from 'lucide-react';
import { markLessonComplete } from '@/app/actions/progress';
import { toast } from 'sonner';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  videoTimestamp: number;
}

interface StudentQuizGatewayProps {
  lessonId: string;
  quizData: QuizQuestion[];
  onSeek: (timeSeconds: number) => void;
  onPassed: () => void;
  isOpen: boolean;
  isReadOnly?: boolean;
  isCompleted?: boolean;
  onClose?: () => void;
}

export function StudentQuizGateway({ lessonId, quizData, onSeek, onPassed, isOpen, isReadOnly, isCompleted = false, onClose }: StudentQuizGatewayProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [state, setState] = useState<'IDLE' | 'GRADING' | 'RETRY' | 'REMEDIATION' | 'PASSED'>(
    isCompleted ? 'PASSED' : 'IDLE'
  );
  const [failedQuestionIds, setFailedQuestionIds] = useState<Set<string>>(new Set());

  // Show only failed questions during a retry, otherwise show all
  const activeQuestions = state === 'RETRY' 
    ? quizData.filter(q => failedQuestionIds.has(q.id))
    : quizData;

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (state === 'GRADING' || state === 'PASSED') return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < activeQuestions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    setState('GRADING');

    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));

    const newlyFailed = new Set<string>();
    
    // Check answers for currently active questions
    activeQuestions.forEach(q => {
       if (selectedAnswers[q.id] !== q.correctIndex) {
          newlyFailed.add(q.id);
       }
    });

    if (newlyFailed.size === 0) {
      // Passed!
      if (!isReadOnly) {
        try {
          await markLessonComplete(lessonId);
          toast.success("Session mastery verified. Next tier unlocked.", { icon: "🔥", duration: 4000 });
          setState('PASSED');
        } catch (e) {
          toast.error("Error saving progress.");
          setState('IDLE');
        }
      } else {
        toast.success("Session mastery verified (Read-Only).");
        setState('PASSED');
      }
    } else {
      // Failed some questions
      if (state === 'IDLE') {
         // First failed attempt -> Go to RETRY
         setFailedQuestionIds(newlyFailed);
         setSelectedAnswers({}); // Clear answers for retry
         setState('RETRY');
         toast.error(`You missed ${newlyFailed.size} questions. Try those again.`);
      } else if (state === 'RETRY') {
         // Second failed attempt -> Go to REMEDIATION
         setFailedQuestionIds(newlyFailed);
         setState('REMEDIATION');
         toast.error("Mastery required. Review the material and try again.");
      }
    }
  };

  const resetToRetry = () => {
    setSelectedAnswers({});
    setState('RETRY');
  };

  // If no quiz data, don't render anything interceptive
  if (!quizData || quizData.length === 0) return null;


  return (
    <div className="absolute inset-0 z-50 bg-[#111111]/95 backdrop-blur-xl overflow-y-auto w-full p-4 md:p-12 scrollbar-hide">
       <div className="w-full max-w-2xl bg-[#1C1C1E] border border-[#2D2D2D] rounded-2xl shadow-2xl p-8 mx-auto mt-10 md:mt-16 mb-20 relative">
          
          <div className="flex items-center justify-between mb-8">
             <div>
                <h2 className="text-xl font-semibold text-white tracking-tight mb-1">Session Comprehension Check</h2>
                <p className="text-[#9CA3AF] text-sm">Verify your mastery to unlock the next active session.</p>
             </div>
             <div className="px-3 py-1 bg-accent/20 border border-accent/30 text-accent rounded-full text-[10px] font-bold uppercase tracking-widest">
                Assessment
             </div>
          </div>

          {state === 'PASSED' ? (
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Mastery Verified</h2>
                <p className="text-[#9CA3AF] mb-8 leading-relaxed">You have successfully grasped the core concepts of this session. You are ready to proceed.</p>
                
                <div className="flex flex-col gap-3">
                   <button 
                      onClick={onPassed}
                      className="w-full py-4 bg-white text-black text-[13px] font-bold tracking-widest uppercase rounded-xl hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                   >
                      Proceed to Next Session <ArrowRight className="w-4 h-4 ml-1" />
                   </button>
                   {onClose && (
                      <button 
                         onClick={onClose}
                         className="w-full py-4 bg-transparent border border-[#2D2D2D] text-[#9CA3AF] text-[13px] font-bold tracking-widest uppercase rounded-xl hover:text-white hover:border-[#888888] transition-all flex items-center justify-center gap-2"
                      >
                         Re-watch Session Video
                      </button>
                   )}
                </div>
             </motion.div>
          ) : state === 'REMEDIATION' ? (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                   <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                   <div>
                      <h3 className="text-sm font-medium text-red-200 mb-1">Remediation Required</h3>
                      <p className="text-[13px] text-red-300/80 leading-relaxed">
                         You've missed concepts for a second time. Before retrying, click the timestamps below to instantly jump to the exact moment in the session where the concept was taught.
                      </p>
                   </div>
                </div>

                <div className="space-y-3">
                   {quizData.filter(q => failedQuestionIds.has(q.id)).map((q) => (
                      <div key={q.id} className="p-4 rounded-xl bg-[#111111] border border-[#2D2D2D] flex items-center justify-between group">
                         <div className="flex-1 pr-4">
                            <p className="text-[13px] text-[#9CA3AF] line-clamp-2">{q.question}</p>
                         </div>
                         <button 
                            onClick={() => onSeek(q.videoTimestamp)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-ink transition-colors group/btn"
                         >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold tracking-wider">
                               {Math.floor(q.videoTimestamp / 60)}:{(q.videoTimestamp % 60).toString().padStart(2, '0')}
                            </span>
                         </button>
                      </div>
                   ))}
                </div>

                <button 
                   onClick={resetToRetry}
                   className="w-full py-3 bg-white text-black text-[13px] font-bold tracking-wide uppercase rounded-xl hover:bg-gray-200 transition-colors mt-4"
                >
                   Close & Retake Quiz
                </button>
             </motion.div>
          ) : (
             <div className="space-y-8">
                {activeQuestions.map((q, index) => (
                   <div key={q.id} className="space-y-3">
                      <p className="text-[14px] text-white font-medium leading-relaxed">
                         <span className="text-accent font-mono mr-2">{index + 1}.</span> 
                         {q.question}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                         {q.options.map((opt, optIndex) => (
                            <button
                               key={optIndex}
                               onClick={() => handleSelect(q.id, optIndex)}
                               disabled={state === 'GRADING'}
                               className={`text-left px-4 py-3 rounded-xl border text-[13px] transition-all
                                  ${selectedAnswers[q.id] === optIndex 
                                     ? 'bg-accent/10 border-accent text-white' 
                                     : 'bg-[#111111] border-[#2D2D2D] text-[#9CA3AF] hover:border-[#888888] hover:text-white'
                                  }`}
                            >
                               {opt}
                            </button>
                         ))}
                      </div>
                   </div>
                ))}
                
                <div className="pt-4 border-t border-[#2D2D2D]">
                   <button 
                      onClick={handleSubmit} 
                      disabled={state === 'GRADING'}
                      className="w-full py-3.5 bg-white text-black text-[13px] font-bold tracking-widest uppercase rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                   >
                      {state === 'GRADING' ? (
                         <><Loader2 className="w-4 h-4 animate-spin text-black" /> Evaluating Mastery...</>
                      ) : (
                         <>{state === 'RETRY' ? 'Submit Corrections' : 'Submit Answers'} <ArrowRight className="w-4 h-4 ml-1" /></>
                      )}
                   </button>
                </div>
             </div>
          )}
       </div>
    </div>
  );
}

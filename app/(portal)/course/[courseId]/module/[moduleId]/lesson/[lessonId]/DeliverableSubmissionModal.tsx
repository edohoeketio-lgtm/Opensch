"use client";

import { useState } from 'react';
import { X, ExternalLink, FileCode, CheckCircle2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeliverableSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprintTitle: string;
}

export function DeliverableSubmissionModal({ isOpen, onClose, sprintTitle }: DeliverableSubmissionModalProps) {
  const [submissionType, setSubmissionType] = useState<'url' | 'files'>('url');
  const [githubUrl, setGithubUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submissionType === 'url' && !githubUrl) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        setIsSuccess(false);
        setGithubUrl('');
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#111111]/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#111111] border border-[#2D2D2D] rounded-2xl shadow-2xl z-[100] overflow-hidden"
          >
            {isSuccess ? (
               <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                     <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#FFFFFF] mb-2">Deliverable Received</h3>
                  <p className="text-[#D1D5DB] text-sm leading-relaxed max-w-[280px]">
                     Your submission for "{sprintTitle}" has been securely logged to your academic record.
                  </p>
               </div>
            ) : (
               <>
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-[#2D2D2D]">
                     <div>
                        <h2 className="text-lg font-semibold text-[#FFFFFF] tracking-[-0.01em]">Submit Deliverable</h2>
                        <p className="text-[12px] text-[#9CA3AF] mt-1">Sprint Requirement: {sprintTitle}</p>
                     </div>
                     <button 
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-[#888888] hover:text-[#FFFFFF] transition-colors"
                     >
                        <X className="w-4 h-4" />
                     </button>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                     {/* Type Selector */}
                     <div className="flex p-1 bg-[#1C1C1E] rounded-xl border border-[#2D2D2D] mb-6">
                        <button
                           type="button"
                           onClick={() => setSubmissionType('url')}
                           className={`flex-1 py-2 text-xs font-semibold uppercase tracking-[0.15em] rounded-lg transition-all ${
                              submissionType === 'url' ? 'bg-[#252529] text-[#FFFFFF] shadow-sm' : 'text-[#888888] hover:text-[#9CA3AF]'
                           }`}
                        >
                           Repository Link
                        </button>
                        <button
                           type="button"
                           onClick={() => setSubmissionType('files')}
                           className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold uppercase tracking-[0.15em] rounded-lg transition-all ${
                              submissionType === 'files' ? 'bg-[#252529] text-[#FFFFFF] shadow-sm' : 'text-[#888888] hover:text-[#9CA3AF]'
                           }`}
                        >
                           Upload Files
                           <Lock className="w-3 h-3 text-[#B08D57]" />
                        </button>
                     </div>

                     <form onSubmit={handleSubmit}>
                        {submissionType === 'url' ? (
                           <div className="space-y-4">
                              <div>
                                 <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9CA3AF] mb-2 pl-1">
                                    GitHub/Live URL
                                 </label>
                                 <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                       <ExternalLink className="w-4 h-4 text-[#888888]" />
                                    </div>
                                    <input
                                       type="url"
                                       required
                                       placeholder="https://github.com/your-username/project"
                                       value={githubUrl}
                                       onChange={(e) => setGithubUrl(e.target.value)}
                                       className="w-full bg-[#111111] border border-[#2D2D2D] rounded-xl py-3 pl-11 pr-4 text-[14px] text-[#FFFFFF] placeholder:text-[#3A3A40] focus:outline-none focus:border-[#2D2D2D] focus:ring-1 focus:ring-white/20 transition-all"
                                    />
                                 </div>
                              </div>
                              <p className="text-[12px] text-[#888888] pl-1 max-w-[400px]">
                                 Ensure your repository is public or you have granted access to the OpenSch organization.
                              </p>
                           </div>
                        ) : (
                           <div className="py-8 flex flex-col items-center justify-center border border-dashed border-[#2D2D2D] bg-[#111111] rounded-xl relative overflow-hidden">
                              {/* Premium Lock Overlay */}
                              <div className="absolute inset-0 bg-[#111111]/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                                 <div className="w-10 h-10 rounded-full bg-[#1A1A1E] border border-[#2D2D2D] flex items-center justify-center mb-3">
                                    <Lock className="w-4 h-4 text-[#B08D57]" />
                                 </div>
                                 <p className="text-[13px] font-medium text-[#FFFFFF]">Direct Upload is a Premium Feature</p>
                                 <p className="text-[11px] text-[#888888] mt-1">Requires Premium Tier</p>
                              </div>
                              <FileCode className="w-8 h-8 text-[#3A3A40] mb-3" />
                              <p className="text-[13px] text-[#D1D5DB]">Drag and drop your project ZIP</p>
                           </div>
                        )}

                    <div className="mt-8 flex justify-end">
                           <button
                              type="submit"
                              disabled={isSubmitting || (submissionType === 'url' && !githubUrl) || submissionType === 'files'}
                              className="px-6 py-3 rounded-xl bg-[#F5F2EB] text-[#0B0B0C] text-[13px] font-semibold hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                           >
                              {isSubmitting ? 'Verifying...' : 'Submit to Record'}
                           </button>
                        </div>
                     </form>
                  </div>
               </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

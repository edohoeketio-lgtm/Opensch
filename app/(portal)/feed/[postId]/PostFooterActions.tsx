'use client';

import { ChevronUp, ChevronDown, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { ReportModal } from './ReportModal';
import { useToast } from '../../components/ToastContext';

export function PostFooterActions({ upvotes, hasVoted }: { upvotes: number, hasVoted: boolean }) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { toast } = useToast();

  return (
    <div className="flex items-center gap-4 border-t border-[#2D2D2D] pt-5">
      <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/5 border border-[#2D2D2D]">
        <button className="p-1 rounded hover:bg-white/10 text-[#888888] hover:text-blue-500 transition-colors">
          <ChevronUp className="w-4 h-4" />
        </button>
        <span className={`text-xs font-bold w-4 text-center ${hasVoted ? 'text-blue-500' : 'text-[#FFFFFF]'}`}>
          {upvotes}
        </span>
        <button className="p-1 rounded hover:bg-white/10 text-[#888888] hover:text-rose-500 transition-colors">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <button 
        onClick={() => document.getElementById('replies')?.scrollIntoView({ behavior: 'smooth' })}
        className="flex items-center gap-2 text-sm font-semibold text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors group px-3 py-1.5 rounded-lg hover:bg-white/5"
      >
        <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
        3 Replies
      </button>
      <button className="flex items-center gap-2 text-sm font-semibold text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors group px-3 py-1.5 rounded-lg hover:bg-white/5">
        <ArrowUpRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
        Share
      </button>
      <button 
        onClick={() => setIsReportModalOpen(true)}
        className="flex items-center gap-2 text-sm font-semibold text-[#9CA3AF] hover:text-rose-400 transition-colors group ml-auto px-3 py-1.5 rounded-lg hover:bg-white/5"
      >
        Report
      </button>

      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        onSubmit={(reason) => {
          setIsReportModalOpen(false);
          toast({
            message: `Thank you. Your report for '${reason}' has been submitted to the moderation team.`,
            type: 'success'
          });
        }} 
      />
    </div>
  );
}

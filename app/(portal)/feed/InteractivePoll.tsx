"use client";

import { useState, useTransition } from 'react';
import { BarChart2 } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { submitPollVote } from '@/app/actions/threads';

interface PollProps {
  question: string;
  options: { text: string; votes?: number }[];
  isFeedView?: boolean;
  threadId?: string;
}

export function InteractivePoll({ question, options, isFeedView = false, threadId }: PollProps) {
  const { toast } = useToast();
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalVotes = options.reduce((sum, opt) => sum + (opt.votes || 0), 0) + (hasVoted ? 1 : 0);

  const handleVote = (e: React.MouseEvent, idx: number) => {
    if (isFeedView) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (hasVoted || isPending) return;

    // Optimistic update
    setHasVoted(true);
    setSelectedIdx(idx);
    
    if (threadId) {
       startTransition(async () => {
         const res = await submitPollVote(threadId, idx);
         if (!res.success) {
           toast({ message: res.error || "Failed to submit vote.", type: "error" });
           // Revert state on failure
           setHasVoted(false);
           setSelectedIdx(null);
         } else {
           toast({ message: "Vote recorded!", type: "success" });
         }
       });
    } else {
       toast({ message: "Vote recorded locally (Preview)", type: "success" });
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-[#2D2D2D] bg-[#111111] p-5 relative z-10">
      <h4 className="text-[15px] font-bold text-[#FFFFFF] mb-5 flex items-start gap-2.5 leading-snug">
        <BarChart2 className="w-[18px] h-[18px] text-[#2E8B6C] shrink-0 translate-y-[2px]" />
        {question}
      </h4>
      <div className="space-y-2.5">
        {options.map((opt, idx) => {
          const optVotes = (opt.votes || 0) + (selectedIdx === idx ? 1 : 0);
          const percent = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
          const isSelected = selectedIdx === idx;

          return (
            <div 
              key={idx} 
              onClick={(e) => handleVote(e, idx)}
              className={`relative w-full border ${isSelected ? 'border-[#2E8B6C]' : 'border-[#2D2D2D]'} bg-white/[0.02] rounded-lg overflow-hidden flex items-center justify-between px-4 py-3 ${!hasVoted ? 'hover:bg-white/[0.06] hover:border-white/[0.1] cursor-pointer' : ''} transition-all group`}
            >
              <div className="flex items-center gap-3 relative z-10 flex-1">
                <span className={`text-[14px] font-medium ${isSelected ? 'text-[#2E8B6C]' : 'text-[#FFFFFF]'}`}>{opt.text}</span>
              </div>
              
              {hasVoted && (
                <span className="text-xs font-bold text-[#FFFFFF] relative z-10">{percent}%</span>
              )}

              {/* Progress bar */}
              <div 
                className={`absolute top-0 left-0 bottom-0 ${isSelected ? 'bg-[#2E8B6C]/20' : 'bg-white/[0.06]'} transition-all duration-700 ease-out rounded-r-none`}
                style={{ width: hasVoted ? `${percent}%` : '0%' }}
              ></div>
              
              {/* Hover preview if not voted */}
              {!hasVoted && (
                <div className="absolute top-0 left-0 bottom-0 bg-[#2E8B6C]/10 w-0 group-hover:w-[15%] transition-all duration-500 rounded-r-none"></div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[11px] font-semibold text-[#525252] mt-4 uppercase tracking-wider">
        {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} · {hasVoted ? 'Voted' : 'Poll Open'}
      </p>
    </div>
  );
}

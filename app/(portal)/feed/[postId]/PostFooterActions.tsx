'use client';

import { ChevronUp, ChevronDown, MessageSquare, ArrowUpRight, Trash2, Link as LinkIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { ReportModal } from './ReportModal';
import { DeleteModal } from './DeleteModal';
import { useToast } from '../../components/ToastContext';
import { incrementThreadUpvote, reportThread, deleteThread } from '@/app/actions/threads';

export function PostFooterActions({ threadId, upvotes: initialUpvotes, hasVoted: initialHasVoted, repliesCount = 0, canDelete = false }: { threadId?: string, upvotes: number, hasVoted: boolean, repliesCount?: number, canDelete?: boolean }) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!threadId) return;
    setIsDeleteModalOpen(false);
    
    startTransition(async () => {
      const res = await deleteThread(threadId);
      if (res.success) {
        toast({ message: "Thread deleted successfully", type: "success" });
        window.location.href = '/feed'; // redirect to feed
      } else {
        toast({ message: res.error || "Failed to delete thread", type: "error" });
      }
    });
  };

  const handleUpvote = () => {
    if (hasVoted || isPending || !threadId) return;
    
    // Optimistic update
    setHasVoted(true);
    setUpvotes(prev => prev + 1);
    
    startTransition(async () => {
      const res = await incrementThreadUpvote(threadId);
      if (!res.success) {
        setHasVoted(false);
        setUpvotes(prev => prev - 1);
        toast({ message: res.error || "Failed to upvote", type: "error" });
      }
    });
  };

  const handleReport = async (reason: string) => {
    setIsReportModalOpen(false);
    if (!threadId) {
      toast({ message: "Cannot report this thread", type: "error" });
      return;
    }

    const res = await reportThread(threadId, reason);
    if (res.success) {
      toast({
        message: `Thank you. Your report for '${reason}' has been submitted to the moderation team.`,
        type: 'success'
      });
    } else {
      toast({
        message: res.error || "Failed to submit report. Please try again.",
        type: 'error'
      });
    }
  };

  return (
    <div className="flex items-center gap-4 border-t border-[#2D2D2D] pt-5">
      <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/5 border border-[#2D2D2D]">
        <button 
          onClick={handleUpvote}
          disabled={hasVoted || isPending}
          className={`p-1 rounded transition-colors ${hasVoted ? 'text-blue-500' : 'text-[#888888] hover:bg-white/10 hover:text-blue-500'} disabled:cursor-not-allowed`}
        >
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
        Reply
      </button>
      <button 
        onClick={() => {
          navigator.clipboard.writeText(`${window.location.origin}/feed/${threadId}`);
          toast({ message: "Link copied to clipboard", type: "success" });
        }}
        className="flex items-center gap-2 text-sm font-semibold text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors group px-3 py-1.5 rounded-lg hover:bg-white/5"
      >
        <LinkIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
        Copy Link
      </button>
      <button 
        onClick={() => setIsReportModalOpen(true)}
        className="flex items-center gap-2 text-sm font-semibold text-[#9CA3AF] hover:text-rose-400 transition-colors group ml-auto px-3 py-1.5 rounded-lg hover:bg-white/5"
      >
        Report
      </button>

      {canDelete && (
        <button 
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isPending}
          className="flex items-center gap-2 text-sm font-semibold text-rose-500 hover:text-rose-400 transition-colors group px-3 py-1.5 rounded-lg hover:bg-rose-500/10"
        >
          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Delete
        </button>
      )}

      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        onSubmit={handleReport} 
      />

      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDelete} 
      />
    </div>
  );
}

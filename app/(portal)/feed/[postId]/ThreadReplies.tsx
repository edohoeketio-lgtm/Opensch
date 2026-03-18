"use client";

import { useState } from 'react';
import { ChevronUp, ChevronDown, MessageSquare, BookOpen, Link as LinkIcon, Loader2 } from 'lucide-react';
import { getAvatarColor } from '@/lib/utils';
import { replyToThread } from '@/app/actions/threads';

export type CommentType = {
  id: string;
  author: string;
  role: string;
  avatarChar: string;
  color: string;
  bg: string;
  time: string;
  content: string;
  upvotes: number;
  hasVoted: boolean;
};

interface ThreadRepliesProps {
  initialComments: CommentType[];
  threadId: string;
}

export function ThreadReplies({ initialComments, threadId }: ThreadRepliesProps) {
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [globalReplyText, setGlobalReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGlobalReply = async () => {
    if (!globalReplyText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await replyToThread({
        threadId,
        content: globalReplyText
      });

      if (!response.success) {
        console.error("Failed to reply:", response.error);
        setIsSubmitting(false);
        return;
      }

      const newComment: CommentType = {
        id: Date.now().toString(),
        author: "You",
        role: "Student",
        avatarChar: "Y",
        color: "text-[#9CA3AF]",
        bg: "bg-white/5",
        time: "Just now",
        content: globalReplyText,
        upvotes: 0,
        hasVoted: false,
      };

      setComments([...comments, newComment]);
      setGlobalReplyText("");
    } catch (error) {
       console.error(error);
    } finally {
       setIsSubmitting(false);
    }
  };

  const toggleVote = (commentId: string, direction: 'up' | 'down') => {
    setComments(comments.map(node => {
      if (node.id === commentId) {
        let newUpvotes = node.upvotes;
        let newHasVoted = node.hasVoted;

        if (direction === 'up') {
          if (node.hasVoted) {
            newUpvotes -= 1; // Remove upvote
            newHasVoted = false;
          } else {
            newUpvotes += 1; // Add upvote
            newHasVoted = true;
          }
        } else if (direction === 'down') {
          if (node.hasVoted) {
            newUpvotes -= 1; // Remove upvote
            newHasVoted = false;
          }
        }

        return { ...node, upvotes: Math.max(0, newUpvotes), hasVoted: newHasVoted };
      }
      return node;
    }));
  };

  const renderComment = (comment: CommentType) => {
    return (
      <div key={comment.id} className="relative group/comment pb-8 border-b border-[#2D2D2D] mb-8 last:border-0 last:mb-0 last:pb-0">
         <div className="flex gap-4">

            {/* Avatar Gutter */}
            <div className="shrink-0 flex flex-col items-center relative z-10">
               <div 
                 className="w-10 h-10 text-sm rounded-full border border-[#2D2D2D] flex items-center justify-center overflow-hidden"
                 style={{ backgroundColor: getAvatarColor(comment.avatarChar) }}
               >
                  <span className="font-bold text-[#FFFFFF]">{comment.avatarChar}</span>
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
               <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                     <span className="text-[15px] font-bold text-[#FFFFFF] tracking-tight">{comment.author}</span>
                     <span className={`px-1.5 py-[2px] rounded ${comment.bg} border border-[#2D2D2D] text-[9px] font-bold uppercase tracking-widest ${comment.color}`}>{comment.role}</span>
                  </div>
                  <span className="text-xs text-[#888888] font-medium">{comment.time}</span>
               </div>
               
               <div className="prose prose-invert max-w-none text-[15px] mb-4 leading-relaxed [&>p]:text-[#D1D5DB]">
                 {comment.content.split('\\n').map((para, i) => (
                   <p key={i}>{para}</p>
                 ))}
               </div>

               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/5 border border-[#2D2D2D]">
                     <button onClick={() => toggleVote(comment.id, 'up')} className={`hover:text-blue-500 transition-colors ${comment.hasVoted && 'text-blue-500'} p-1 rounded hover:bg-white/5`}>
                        <ChevronUp className="w-4 h-4" />
                     </button>
                     <span className="text-xs w-4 text-center font-bold text-[#FFFFFF]">{comment.upvotes}</span>
                     <button onClick={() => toggleVote(comment.id, 'down')} className="hover:text-rose-500 transition-colors p-1 rounded hover:bg-white/5">
                        <ChevronDown className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-2 mb-10">
         <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-widest border-b border-[#2D2D2D] pb-4 mb-8">
            {comments.length} {comments.length === 1 ? 'Reply' : 'Replies'}
         </h3>
         
         {comments.map(comment => renderComment(comment))}
      </div>

      {/* Global Reply Input */}
      <div className="mt-8 border-t border-[#2D2D2D] pt-8">
        <div className="p-5 rounded-2xl border border-[#2D2D2D] bg-[#1C1C1E] relative focus-within:border-white/[0.18] transition-colors shadow-sm">
          <textarea 
            value={globalReplyText}
            onChange={(e) => setGlobalReplyText(e.target.value)}
            placeholder="Add your reply to this thread..." 
            className="w-full bg-transparent text-[#FFFFFF] placeholder:text-[#504C46] resize-none outline-none text-[15px] min-h-[80px]"
          />
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1">
              <button disabled className="p-2 mr-1 rounded-lg hover:bg-white/[0.06] hover:text-[#FFFFFF] text-[#8A8A8A] transition-colors opacity-50 cursor-not-allowed"><BookOpen className="w-4 h-4" /></button>
              <button disabled className="p-2 mr-1 rounded-lg hover:bg-white/[0.06] hover:text-[#FFFFFF] text-[#8A8A8A] transition-colors opacity-50 cursor-not-allowed"><LinkIcon className="w-4 h-4" /></button>
            </div>
            <button 
              onClick={handleGlobalReply} 
              disabled={isSubmitting || !globalReplyText.trim()}
              className="px-6 py-2.5 rounded-xl bg-[#F5F2EB] text-[#050505] font-bold text-xs uppercase tracking-[0.1em] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center min-w-[120px]"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : "Post Reply"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


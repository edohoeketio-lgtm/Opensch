"use client";

import { useState } from 'react';
import { ChevronUp, ChevronDown, MessageSquare, BookOpen, Link as LinkIcon } from 'lucide-react';

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
  replies: CommentType[];
};

interface ThreadRepliesProps {
  initialComments: CommentType[];
}

export function ThreadReplies({ initialComments }: ThreadRepliesProps) {
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [globalReplyText, setGlobalReplyText] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleGlobalReply = () => {
    if (!globalReplyText.trim()) return;
    
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
      replies: []
    };

    setComments([...comments, newComment]);
    setGlobalReplyText("");
  };

  const handleNestedReply = (parentId: string) => {
    if (!replyText.trim()) return;

    const newReply: CommentType = {
      id: Date.now().toString(),
      author: "You",
      role: "Student",
      avatarChar: "Y",
      color: "text-[#9CA3AF]",
      bg: "bg-white/5",
      time: "Just now",
      content: replyText,
      upvotes: 0,
      hasVoted: false,
      replies: []
    };

    const addReplyDeep = (nodes: CommentType[]): CommentType[] => {
      return nodes.map(node => {
        if (node.id === parentId) {
          return { ...node, replies: [...node.replies, newReply] };
        }
        if (node.replies && node.replies.length > 0) {
          return { ...node, replies: addReplyDeep(node.replies) };
        }
        return node;
      });
    };

    setComments(addReplyDeep(comments));
    setReplyText("");
    setReplyingToId(null);
  };

  const toggleVote = (commentId: string, direction: 'up' | 'down') => {
    const updateVoteDeep = (nodes: CommentType[]): CommentType[] => {
      return nodes.map(node => {
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
        if (node.replies && node.replies.length > 0) {
          return { ...node, replies: updateVoteDeep(node.replies) };
        }
        return node;
      });
    };
    setComments(updateVoteDeep(comments));
  };

  const countTotalRepliesDeep = (nodes: CommentType[]): number => {
    let count = 0;
    nodes.forEach(node => {
      count += 1; // Count node itself
      if (node.replies && node.replies.length > 0) {
        count += countTotalRepliesDeep(node.replies);
      }
    });
    return count;
  };

  const renderComment = (comment: CommentType, depth: number = 0) => {
    const isRoot = depth === 0;

    return (
      <div key={comment.id} className={`relative group/comment ${isRoot ? 'pb-8 border-b border-[#2D2D2D] mb-8' : 'mt-5'}`}>
         <div className="flex gap-4">
            {/* Thread Guide Line */}
            {comment.replies && comment.replies.length > 0 && (
              <div className={`absolute ${isRoot ? 'left-[19px]' : 'left-[15px]'} top-12 bottom-[-32px] w-[2px] bg-white/[0.03] group-hover/comment:bg-white/10 transition-colors rounded-full z-0`}></div>
            )}

            {/* Avatar Gutter */}
            <div className={`shrink-0 flex flex-col items-center relative z-10 ${!isRoot && 'pt-1'}`}>
               <div className={`${isRoot ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-xs'} rounded-full border border-[#2D2D2D] bg-[#1C1C1E] flex items-center justify-center`}>
                  <span className="font-bold text-[#FFFFFF]">{comment.avatarChar}</span>
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
               <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                     <span className={`${isRoot ? 'text-[14px]' : 'text-[13px]'} font-bold text-[#FFFFFF] tracking-tight`}>{comment.author}</span>
                     <span className={`px-1.5 py-[2px] rounded ${comment.bg} border border-[#2D2D2D] ${isRoot ? 'text-[9px]' : 'text-[8px]'} font-bold uppercase tracking-widest ${comment.color}`}>{comment.role}</span>
                  </div>
                  <span className={`${isRoot ? 'text-xs' : 'text-[11px]'} text-[#888888] font-medium`}>{comment.time}</span>
               </div>
               
               <div className={`prose prose-invert max-w-none ${isRoot ? 'text-[14px] mb-3' : 'text-[13px] mb-2.5'} leading-relaxed [&>p]:text-[#D1D5DB]`}>
                  <p>{comment.content}</p>
               </div>

               <div className="flex items-center gap-4">
                  <div className={`flex items-center ${isRoot ? 'gap-1.5 p-1 rounded-lg bg-white/5 border border-[#2D2D2D]' : 'gap-1 text-[#888888]'}`}>
                     <button onClick={() => toggleVote(comment.id, 'up')} className={`hover:text-blue-500 transition-colors ${comment.hasVoted && 'text-blue-500'} ${isRoot ? 'p-1 rounded hover:bg-white/5' : 'p-0.5 rounded'}`}>
                        <ChevronUp className="w-4 h-4" />
                     </button>
                     <span className={`${isRoot ? 'text-xs w-4 text-center' : 'text-[11px]'} font-bold text-[#FFFFFF]`}>{comment.upvotes}</span>
                     <button onClick={() => toggleVote(comment.id, 'down')} className={`hover:text-rose-500 transition-colors ${isRoot ? 'p-1 rounded hover:bg-white/5' : 'p-0.5 rounded'}`}>
                        <ChevronDown className="w-4 h-4" />
                     </button>
                  </div>
                  <button onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)} className={`flex items-center ${isRoot ? 'gap-1.5 text-xs' : 'gap-1.5 text-[11px]'} font-semibold text-[#888888] hover:text-[#FFFFFF] transition-colors`}>
                     <MessageSquare className={`${isRoot ? 'w-3.5 h-3.5' : 'w-3 h-3'}`}/> Reply
                  </button>
               </div>

               {/* Inline Reply Input targeted to this comment */}
               {replyingToId === comment.id && (
                  <div className="mt-4 mb-4">
                     <div className="p-3 rounded-xl bg-[#1C1C1E] border border-[#2D2D2D] relative focus-within:border-white/[0.18] transition-colors">
                        <textarea 
                           autoFocus
                           value={replyText}
                           onChange={(e) => setReplyText(e.target.value)}
                           placeholder={`Reply to ${comment.author}...`} 
                           className="w-full bg-transparent text-[#FFFFFF] placeholder:text-[#504C46] resize-none outline-none text-[13px] min-h-[60px]"
                        />
                        <div className="flex items-center justify-end mt-2 gap-2">
                           <button onClick={() => setReplyingToId(null)} className="px-3 py-1.5 rounded-lg text-[#9CA3AF] hover:text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider transition-colors">
                              Cancel
                           </button>
                           <button onClick={() => handleNestedReply(comment.id)} className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FFFFFF] font-bold text-xs uppercase tracking-[0.1em] transition-all">
                              Reply
                           </button>
                        </div>
                     </div>
                  </div>
               )}

               {/* Recursively Render Replies */}
               {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-2 relative">
                     {comment.replies.map(r => renderComment(r, depth + 1))}
                  </div>
               )}
            </div>
         </div>
      </div>
    );
  };

  return (
    <>
      {/* Global Reply Input */}
      <div className="mb-12">
        <div className="p-5 rounded-2xl border border-[#2D2D2D] relative focus-within:border-white/[0.18] transition-colors">
          <textarea 
            value={globalReplyText}
            onChange={(e) => setGlobalReplyText(e.target.value)}
            placeholder="Draft a reply to Marcus..." 
            className="w-full bg-transparent text-[#FFFFFF] placeholder:text-[#504C46] resize-none outline-none text-[15px] min-h-[80px]"
          />
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1">
              <button className="p-2 mr-1 rounded-lg hover:bg-white/[0.06] hover:text-[#FFFFFF] text-[#8A8A8A] transition-colors"><BookOpen className="w-4 h-4" /></button>
              <button className="p-2 mr-1 rounded-lg hover:bg-white/[0.06] hover:text-[#FFFFFF] text-[#8A8A8A] transition-colors"><LinkIcon className="w-4 h-4" /></button>
            </div>
            <button onClick={handleGlobalReply} className="px-5 py-2 rounded-xl bg-[#F5F2EB] text-[#050505] font-bold text-xs uppercase tracking-[0.1em] hover:bg-white transition-all shadow-sm">
              Post Reply
            </button>
          </div>
        </div>
      </div>

      {/* Recursive Comment Tree */}
      <div className="space-y-8">
         <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-widest border-b border-[#2D2D2D] pb-4 mb-6">
            {countTotalRepliesDeep(comments)} Replies
         </h3>
         
         {comments.map(comment => renderComment(comment, 0))}
      </div>
    </>
  );
}

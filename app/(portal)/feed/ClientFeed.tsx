"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronUp, ChevronDown, MessageSquare, Video, Link as LinkIcon, BookOpen, Target, Award, CheckCircle2, HelpCircle, Image as ImageIcon, MoreHorizontal, Code, Github, BarChart2, X, Loader2 } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { createFeedPost } from '@/app/actions/threads';
import { getAvatarColor } from '@/lib/utils';
import { InteractivePoll } from './InteractivePoll';

export type UserType = {
  name: string;
  initial: string;
  role: string;
};

export type FeedItemType = {
  id: string;
  type: string;
  user: UserType;
  time: string;
  title: string;
  content: string;
  iconName: string;
  color: string;
  bg: string;
  endorsements: number;
  hasEndorsed: boolean;
  repliesCount: number;
  sprintContext?: string;
  image?: string;
  video?: string;
  codeSnippet?: string;
  repoUrl?: string;
  poll?: { question: string; options: { text: string; votes: number }[] };
};

const iconMap: Record<string, any> = {
  'Target': Target,
  'Award': Award,
  'CheckCircle2': CheckCircle2,
  'HelpCircle': HelpCircle,
  'BookOpen': BookOpen,
  'Video': Video,
  'LinkIcon': LinkIcon,
};

interface ClientFeedProps {
  initialItems: FeedItemType[];
}

export function ClientFeed({ initialItems }: ClientFeedProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<FeedItemType[]>(initialItems);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [postImage, setPostImage] = useState<string | null>(null);
  const [postVideo, setPostVideo] = useState<string | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);
  
  // Extra specific composer states
  const [isAddingCode, setIsAddingCode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [isAddingRepo, setIsAddingRepo] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [isAddingPoll, setIsAddingPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPostImage(url);
      setPostVideo(null); // Clear video if image is selected
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPostVideo(url);
      setPostImage(null); // Clear image if video is selected
    }
  };

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [postType, setPostType] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState('All Activity');
  
  const TABS = ['All Activity', 'Questions', 'Deliverables', 'Announcements', 'Peer Review', 'Wins'];

  const toggleEndorse = (itemId: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return { 
          ...item, 
          endorsements: item.hasEndorsed ? item.endorsements - 1 : item.endorsements + 1, 
          hasEndorsed: !item.hasEndorsed 
        };
      }
      return item;
    }));
  };

  const filteredItems = items.filter(item => {
    if (activeTab === 'All Activity') return true;
    if (activeTab === 'Questions') return item.type === 'Question';
    if (activeTab === 'Deliverables') return item.type === 'Deliverable';
    if (activeTab === 'Announcements') return item.type === 'Announcement';
    if (activeTab === 'Peer Review') return item.type === 'Feedback' || item.type === 'Peer Review';
    if (activeTab === 'Wins') return item.type === 'Win';
    return true;
  });

  const handlePostThread = async () => {
    if (!newPostContent.trim()) return;
    
    setIsSubmitting(true);
    
    // Provide a fallback title or derive it from the content if we eliminated the explicit title input
    const finalTitle = newPostTitle.trim() ? newPostTitle : `${newPostContent.substring(0, 30)}...`;

    // Implicitly derive the type based on the active tab
    let derivedType = 'Discussion';
    if (activeTab === 'Questions') derivedType = 'Question';
    else if (activeTab === 'Deliverables') derivedType = 'Deliverable';
    else if (activeTab === 'Announcements') derivedType = 'Announcement';
    else if (activeTab === 'Peer Review') derivedType = 'Feedback';
    else if (activeTab === 'Wins') derivedType = 'Win';

    // If an explicit postType was selected (future-proofing) use that, otherwise use derived
    const finalType = postType || derivedType;



    const payload: any = {
      image: postImage || undefined,
      video: postVideo || undefined,
      codeSnippet: isAddingCode && codeSnippet.trim() ? codeSnippet : undefined,
      repoUrl: isAddingRepo && repoUrl.trim() ? repoUrl : undefined,
      poll: isAddingPoll && pollQuestion.trim() && pollOptions.some(opt => opt.trim())
        ? { question: pollQuestion, options: pollOptions.filter(opt => opt.trim()).map(opt => ({ text: opt, votes: 0 })) }
        : undefined
    };

    const hasPayload = Object.values(payload).some(val => val !== undefined);

    const res = await createFeedPost({
      title: finalTitle,
      category: finalType,
      content: newPostContent,
      payload: hasPayload ? payload : undefined
    });

    setIsSubmitting(false);

    if (!res.success) {
      if (res.errors) {
        const firstErrorKey = Object.keys(res.errors)[0];
        toast({
          message: `Validation Error: ${res.errors[firstErrorKey][0]}`,
          type: "error"
        });
      } else {
        toast({
          message: res.error || "Failed to post: Something went wrong",
          type: "error"
        });
      }
      return;
    }

    toast({
      message: "Your thought has been shared with the campus.",
      type: "success"
    });
    setNewPostTitle("");
    setNewPostContent("");
    setPostType(null);
    setPostImage(null);
    setPostVideo(null);
    setIsAddingCode(false);
    setCodeSnippet("");
    setIsAddingRepo(false);
    setRepoUrl("");
    setIsAddingPoll(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setShowMoreMenu(false);
    setIsComposing(false);
  };

  return (
    <div className="lg:col-span-2 space-y-8">
      {/* Activity Filter Tabs */}
      <div className="flex items-center overflow-x-auto scrollbar-hide relative z-10 translate-y-[1px]">
         {TABS.map((tab) => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-5 py-2.5 text-[14px] font-semibold transition-all relative ${
               activeTab === tab 
                 ? 'rounded-t-xl bg-[#1C1C1E] text-[#FFFFFF] border border-[#2D2D2D] border-b-0 after:absolute after:-bottom-[2px] after:left-0 after:right-0 after:h-[3px] after:bg-[#1C1C1E]' 
                 : 'rounded-xl text-[#8A8A8A] hover:text-[#FFFFFF] hover:bg-white/5 border border-transparent mb-[1px]'
             }`}
           >
             {tab}
           </button>
         ))}
      </div>

      {/* Sleek Composer */}
      <div className={`p-4 rounded-2xl ${activeTab === TABS[0] ? 'rounded-tl-none' : ''} bg-[#1C1C1E] border border-[#2D2D2D] relative focus-within:border-white/[0.18] transition-all duration-300 shadow-sm z-10 ${isComposing ? 'pb-4' : ''}`}>
        
        {/* Collapsed State */}
        {(!isComposing && newPostContent.length === 0) && (
          <div 
            className="flex items-center gap-3 cursor-text"
            onClick={() => setIsComposing(true)}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#2D2D2D] bg-[#1C1C1E] flex items-center justify-center">
              <span className="text-[#FFFFFF] font-bold text-sm">M</span>
            </div>
            <span className="text-[#525252] text-[18px] sm:text-[20px]">What's on your mind?</span>
          </div>
        )}

        {/* Expanded State */}
        {(isComposing || newPostContent.length > 0) && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#2D2D2D] bg-[#1C1C1E] flex items-center justify-center">
                  <span className="text-[#FFFFFF] font-bold text-xs">M</span>
                </div>
                <span className="text-[#FFFFFF] font-medium text-[15px]">Maurice Edohoeket</span>
              </div>
              <button className="text-[14px] font-semibold text-[#8A8A8A] hover:text-[#FFFFFF] transition-colors">
                Drafts
              </button>
            </div>

            {/* Input Area */}
            <div className="pl-12">
              <textarea 
                autoFocus
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-transparent text-[#FFFFFF] placeholder:text-[#525252] text-[18px] sm:text-[20px] resize-none !outline-none !border-none !ring-0 focus:!ring-0 focus:!border-transparent focus:!outline-none p-0 min-h-[100px] leading-relaxed"
              />
              {postImage && (
                <div className="mt-3 relative inline-block">
                  <div className="relative rounded-xl overflow-hidden border border-[#2D2D2D] max-w-sm">
                    <img src={postImage} alt="Upload preview" className="w-full h-auto object-cover max-h-[300px]" />
                    <button 
                      onClick={() => setPostImage(null)} 
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black transition-colors border border-white/20"
                    >
                      <span className="text-[10px] font-bold">✕</span>
                    </button>
                  </div>
                </div>
              )}
              {postVideo && (
                <div className="mt-3 relative inline-block">
                  <div className="relative rounded-xl overflow-hidden border border-[#2D2D2D] max-w-sm bg-black">
                    <video src={postVideo} controls className="w-full h-auto max-h-[300px]" />
                    <button 
                      onClick={() => setPostVideo(null)} 
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black transition-colors border border-white/20 z-10"
                    >
                      <span className="text-[10px] font-bold">✕</span>
                    </button>
                  </div>
                </div>
              )}
              {isAddingCode && (
                 <div className="mt-4 relative bg-[#111111] rounded-xl border border-[#2D2D2D] p-1">
                    <button onClick={() => {setIsAddingCode(false); setCodeSnippet("");}} className="absolute top-2 right-2 p-1.5 text-[#888888] hover:text-white bg-black/40 backdrop-blur-md rounded-md"><X className="w-4 h-4" /></button>
                    <textarea 
                       placeholder="// Paste your code snippet here..."
                       value={codeSnippet}
                       onChange={(e) => setCodeSnippet(e.target.value)}
                       className="w-full bg-transparent text-[#E5E7EB] font-mono text-sm p-4 resize-none !outline-none !border-none !ring-0 focus:!ring-0 min-h-[120px]"
                    />
                 </div>
              )}
              {isAddingRepo && (
                 <div className="mt-4 relative bg-[#111111] border border-[#2D2D2D] rounded-xl flex items-center p-3.5 gap-3">
                    <Github className="w-5 h-5 text-[#888888]" />
                    <input 
                       type="url"
                       placeholder="https://github.com/username/repo"
                       value={repoUrl}
                       onChange={(e) => setRepoUrl(e.target.value)}
                       className="flex-1 bg-transparent text-[#FFFFFF] text-[15px] !outline-none !border-none !ring-0 focus:!ring-0 placeholder:text-[#525252]"
                    />
                    <button onClick={() => {setIsAddingRepo(false); setRepoUrl("");}} className="p-1 text-[#888888] hover:text-white"><X className="w-4 h-4" /></button>
                 </div>
              )}
              {isAddingPoll && (
                 <div className="mt-4 bg-[#111111] border border-[#2D2D2D] rounded-xl p-5 relative">
                    <button onClick={() => {setIsAddingPoll(false); setPollQuestion(""); setPollOptions(["", ""]);}} className="absolute top-3 right-3 p-1.5 text-[#888888] hover:text-white bg-white/5 rounded-md"><X className="w-4 h-4" /></button>
                    <input 
                       type="text"
                       placeholder="Ask a question..."
                       value={pollQuestion}
                       onChange={(e) => setPollQuestion(e.target.value)}
                       className="w-full bg-transparent text-[#FFFFFF] font-bold text-[16px] mb-5 pr-8 !outline-none !border-none !ring-0 focus:!ring-0 placeholder:text-[#525252]"
                    />
                    <div className="space-y-2.5">
                       {pollOptions.map((opt, idx) => (
                         <div key={idx} className="flex items-center gap-2">
                            <input 
                              type="text"
                              placeholder={`Option ${idx + 1}`}
                              value={opt}
                              onChange={(e) => {
                                 const newOpts = [...pollOptions];
                                 newOpts[idx] = e.target.value;
                                 setPollOptions(newOpts);
                              }}
                              className="flex-1 bg-white/[0.04] border border-[#2D2D2D] rounded-lg px-4 py-3 text-sm font-medium text-[#FFFFFF] placeholder:text-[#525252] focus:border-white/20 outline-none transition-colors"
                            />
                            {pollOptions.length > 2 && (
                               <button onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))} className="p-2 text-[#525252] hover:text-[#FFFFFF]"><X className="w-4 h-4" /></button>
                            )}
                         </div>
                       ))}
                       {pollOptions.length < 5 && (
                         <button 
                           onClick={() => setPollOptions([...pollOptions, ""])}
                           className="text-[13px] font-semibold text-[#888888] hover:text-white flex items-center gap-1 mt-3 transition-colors px-1"
                         >
                           + Add Option
                         </button>
                       )}
                    </div>
                 </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {(isComposing || newPostContent.length > 0) && (
          <div className="flex items-center justify-between mt-2 pl-12 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-1.5 text-[#8A8A8A] relative">
              <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={handleVideoUpload} />
              <button onClick={() => imageInputRef.current?.click()} className="p-2 -ml-2 rounded-lg hover:bg-white/[0.06] hover:text-[#FFFFFF] transition-colors"><ImageIcon className="w-[18px] h-[18px]" /></button>
              <button onClick={() => videoInputRef.current?.click()} className="p-2 rounded-lg hover:bg-white/[0.06] hover:text-[#FFFFFF] transition-colors"><Video className="w-[18px] h-[18px]" /></button>
              
              <div className="relative">
                <button 
                   onClick={() => setShowMoreMenu(!showMoreMenu)} 
                   className={`p-2 rounded-lg hover:bg-white/[0.06] hover:text-[#FFFFFF] transition-colors relative z-20 ${showMoreMenu ? 'bg-white/[0.06] text-[#FFFFFF]' : ''}`}
                >
                  <MoreHorizontal className="w-[18px] h-[18px]" />
                </button>
                {showMoreMenu && (
                  <div className="absolute top-full left-0 mt-2 w-48 rounded-xl bg-[#111111] border border-[#2D2D2D] shadow-2xl overflow-hidden z-[100] py-1">
                     <button onClick={() => { setShowMoreMenu(false); setIsAddingCode(true); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[#9CA3AF] hover:text-[#FFFFFF] hover:bg-white/[0.06] transition-colors">
                        <Code className="w-4 h-4" /> Add Code Snippet
                     </button>
                     <button onClick={() => { setShowMoreMenu(false); setIsAddingRepo(true); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[#9CA3AF] hover:text-[#FFFFFF] hover:bg-white/[0.06] transition-colors">
                        <Github className="w-4 h-4" /> Link GitHub Repo
                     </button>
                     <button onClick={() => { setShowMoreMenu(false); setIsAddingPoll(true); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[#9CA3AF] hover:text-[#FFFFFF] hover:bg-white/[0.06] transition-colors">
                        <BarChart2 className="w-4 h-4" /> Create Poll
                     </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setNewPostContent(""); setIsComposing(false); }} 
                className="px-4 py-2 rounded-xl text-[14px] font-semibold text-[#FFFFFF] bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                   setNewPostTitle("Untitled Thought");
                   handlePostThread();
                }}
                disabled={(!newPostContent.trim() && !postImage && !postVideo && !isAddingCode) || isSubmitting}
                className="px-5 py-2 rounded-xl text-[14px] font-semibold text-[#050505] bg-[#F5F2EB] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 min-w-[80px]"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-[#050505]" /> : "Post"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feed Items */}
      <div className="flex flex-col">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const Icon = iconMap[item.iconName] || MessageSquare;
            return (
              <div key={item.id} className="py-6 border-b border-[#2D2D2D] transition-all duration-300 group relative">
                
                {/* Post Header: Type & Context */}
                <div className="flex items-center justify-between mb-5">
                   <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-md flex items-center gap-1.5 ${item.bg === 'bg-rose-500/10' || item.color === 'text-rose-500' ? 'bg-[#1C1C1E] border border-[#2D2D2D]' : item.bg === 'bg-emerald-500/10' || item.color === 'text-emerald-500' ? 'bg-[#2E8B6C]/10 text-[#2E8B6C]' : item.bg === 'bg-blue-500/10' || item.color === 'text-blue-500' ? 'bg-[#1C1C1E] border border-[#2D2D2D]' : item.bg === 'bg-[#B08D57]/10' ? 'bg-[#B08D57]/10' : 'bg-white/[0.04]'}`}>
                         <Icon className={`w-3 h-3 ${item.color === 'text-rose-500' ? 'text-[#FFFFFF]' : item.color === 'text-emerald-500' ? 'text-[#2E8B6C]' : item.color === 'text-blue-500' ? 'text-[#FFFFFF]' : item.color}`} />
                         <span className={`text-[10px] font-bold uppercase tracking-wider ${item.color === 'text-rose-500' ? 'text-[#FFFFFF]' : item.color === 'text-emerald-500' ? 'text-[#2E8B6C]' : item.color === 'text-blue-500' ? 'text-[#FFFFFF]' : item.color}`}>{item.type}</span>
                      </div>
                      {item.sprintContext && (
                         <>
                            <span className="w-1 h-1 rounded-full bg-white/[0.08]"></span>
                            <span className="text-[11px] font-medium text-[#888888] hover:text-[#A6A197] transition-colors cursor-pointer">{item.sprintContext}</span>
                         </>
                      )}
                   </div>
                </div>

                {/* Main Content Area */}
                <div className="flex gap-4">
                   {/* Author Avatar */}
                   <div className="flex-shrink-0">
                     <div 
                       className="w-10 h-10 rounded-full border border-[#2D2D2D] flex items-center justify-center overflow-hidden"
                       style={{ backgroundColor: getAvatarColor(item.user.initial) }}
                     >
                       <span className="text-[#FFFFFF] font-bold text-sm">{item.user.initial}</span>
                     </div>
                   </div>

                   {/* Content block */}
                   <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                       <span className="text-[15px] font-semibold text-[#FFFFFF] tracking-tight">{item.user.name}</span>
                       <span className="text-xs font-medium text-[#888888]">•</span>
                       <span className="text-xs font-medium text-[#888888]">{item.time}</span>
                       {item.user.role === 'Instructor' && (
                          <>
                            <span className="text-xs font-medium text-[#888888]">•</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-[0.1em] border border-[#B08D57]/20 text-[#B08D57] bg-[#B08D57]/10">Instructor</span>
                          </>
                       )}
                     </div>

                     <Link href={`/feed/${item.id}`} className="group/post-link block mt-1">
                       {!(item.title === "Untitled Thought" || item.content.startsWith(item.title.replace("...", ""))) && (
                         <h3 className="text-[17px] font-semibold text-[#FFFFFF] group-hover/post-link:text-[#B08D57] transition-colors tracking-tight mb-2 leading-snug">{item.title}</h3>
                       )}
                       <p className="text-[14px] text-[#D1D5DB] leading-relaxed line-clamp-3">
                         {item.content}
                       </p>
                       {item.image && (
                         <div className="mt-4 rounded-xl overflow-hidden border border-[#2D2D2D]">
                           <img src={item.image} alt="Attached" className="w-full max-h-[400px] object-cover" />
                         </div>
                       )}
                       {item.video && (
                         <div className="mt-4 rounded-xl overflow-hidden border border-[#2D2D2D] bg-black">
                           <video src={item.video} controls className="w-full max-h-[400px]" />
                         </div>
                       )}
                       {item.codeSnippet && (
                         <div className="mt-4 rounded-xl overflow-hidden border border-[#2D2D2D] bg-[#111111]">
                           <div className="flex items-center px-4 py-2 border-b border-[#2D2D2D] bg-white/[0.02]">
                             <Code className="w-3.5 h-3.5 text-[#888888] mr-2" />
                             <span className="text-xs font-semibold uppercase tracking-wider text-[#888888]">code snippet</span>
                           </div>
                           <div className="p-4 overflow-x-auto">
                             <pre className="text-[13px] text-[#E5E7EB] font-mono leading-relaxed">
                               <code>{item.codeSnippet}</code>
                             </pre>
                           </div>
                         </div>
                       )}
                       {item.repoUrl && (
                         <div className="mt-4 rounded-xl overflow-hidden border border-[#2D2D2D] bg-[#111111] flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors group">
                           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-white/10 transition-colors">
                             <Github className="w-5 h-5 text-[#FFFFFF]" />
                           </div>
                           <div className="flex-1 min-w-0">
                             <h4 className="text-[15px] font-semibold text-[#FFFFFF] truncate">{item.repoUrl.replace('https://github.com/', '')}</h4>
                             <p className="text-xs text-[#888888] truncate mt-0.5">{item.repoUrl}</p>
                           </div>
                           <LinkIcon className="w-4 h-4 text-[#525252] group-hover:text-[#FFFFFF] transition-colors" />
                         </div>
                       )}
                       {item.poll && (
                         <InteractivePoll question={item.poll.question} options={item.poll.options} isFeedView={true} />
                       )}
                     </Link>

                     {/* Post Footer Actions */}
                     <div className="mt-5 flex items-center gap-6">
                        <button 
                          onClick={() => toggleEndorse(item.id)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 -ml-2.5 rounded-lg transition-colors ${item.hasEndorsed ? 'text-[#B08D57] bg-[#B08D57]/10' : 'text-[#888888] hover:text-[#FFFFFF] hover:bg-white/[0.04]'}`}
                        >
                           <ChevronUp className={`w-4 h-4 ${item.hasEndorsed ? 'text-[#B08D57]' : ''}`} />
                           {item.endorsements} {item.endorsements === 1 ? 'Helpful' : 'Helpful'}
                        </button>
                        <Link href={`/feed/${item.id}`} className="flex items-center gap-1.5 text-xs font-semibold text-[#888888] hover:text-[#FFFFFF] transition-colors">
                           <MessageSquare className="w-4 h-4" />
                           {item.repliesCount} {item.repliesCount === 1 ? 'Reply' : 'Replies'}
                        </Link>
                     </div>
                   </div>
                </div>
                
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center border-t border-[#2D2D2D] relative overflow-hidden">
            {/* Subtle background glow for empty state */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-[300px] h-[300px] bg-white/10 blur-[100px] rounded-full"></div>
            </div>
            
            <div className="w-20 h-20 mb-6 rounded-2xl bg-[#1C1C1E] border border-[#2D2D2D] flex items-center justify-center shadow-xl shadow-black/50 relative z-10">
               <MessageSquare className="w-8 h-8 text-[#555555]" />
            </div>
            <h3 className="text-[20px] font-bold text-[#FFFFFF] mb-3 tracking-tight relative z-10">It's quiet here...</h3>
            <p className="text-[15px] text-[#A6A197] max-w-md mb-8 leading-relaxed relative z-10">
              {activeTab === 'All Activity' 
                ? "The Campus Feed is where top engineers share their wins, ask hard architectural questions, and review peer code. Be the first to spark an engineering discussion today."
                : `There are currently no engineering posts filed under ${activeTab}. Break the ice and share something valuable with your peers.`}
            </p>
            
            <div className="flex items-center gap-3 relative z-10">
              {activeTab !== 'All Activity' ? (
                <button 
                  onClick={() => setActiveTab('All Activity')}
                  className="px-6 py-3 rounded-xl text-[14px] font-bold text-[#FFFFFF] bg-white/[0.04] border border-[#2D2D2D] hover:bg-white/[0.08] hover:border-white/20 transition-all shadow-sm flex items-center gap-2"
                >
                  <X className="w-4 h-4 text-[#888888]" /> Clear Filters
                </button>
              ) : (
                <button 
                  onClick={() => setIsComposing(true)}
                  className="px-6 py-3 rounded-xl text-[14px] font-bold text-black bg-[#F5F2EB] hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Start a Discussion
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Play, Maximize2, X, FileText, Bot, MessageSquare, Loader2, User, ChevronLeft, Video, Settings } from 'lucide-react';
import { DeliverableSubmissionFeature } from './DeliverableSubmissionFeature';
import { StudentQuizGateway } from './StudentQuizGateway';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface InteractiveVideoPlayerProps {
  sprintTitle: string;
  lessonId: string;
  lessonOrder?: number;
  videoUrl?: string | null;
  isLastLesson?: boolean;
  isReadOnly?: boolean;
  quizData?: any[];
  transcriptSegments?: any[];
  transcriptCleanText?: string;
  description?: string | null;
  nextLessonUrl?: string | null;
  isCompleted?: boolean;
}

export function InteractiveVideoPlayer({ sprintTitle, lessonId, lessonOrder, videoUrl, isLastLesson = false, isReadOnly = false, quizData = [], transcriptSegments = [], transcriptCleanText = '', description, nextLessonUrl, isCompleted = false }: InteractiveVideoPlayerProps) {
  const router = useRouter();
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'transcript' | 'copilot'>('transcript');
  const [mounted, setMounted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(isCompleted);
  const [hasVideoEnded, setHasVideoEnded] = useState(false);

  // Video State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState<'1080p'|'720p'|'360p'|'Auto'>('Auto');

  // Copilot Chat State
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isCopilotTyping, setIsCopilotTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [segments, setSegments] = useState<any[]>(transcriptSegments || []);
  const [transcriptText, setTranscriptText] = useState<string>(transcriptCleanText || '');

  // Auto-pause video when quiz opens
  useEffect(() => {
    if (showQuiz && videoRef.current) {
      videoRef.current.pause();
    }
  }, [showQuiz]);

  useEffect(() => {
    setMounted(true);
    if (!transcriptSegments || transcriptSegments.length === 0) {
      fetch('/latest-transcript.json')
        .then(res => res.json())
        .then(data => {
           if (data && data.segments) {
              setSegments(data.segments);
              setTranscriptText(data.cleanedText || data.rawText || '');
           }
        })
        .catch(err => console.log('No local transcript found.'));
    }
  }, []);

  // Sync scroll for chat
  useEffect(() => {
    if (chatEndRef.current && activeTab === 'copilot') {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isCopilotTyping, activeTab]);

  // Telemetry: Passive Max Watched Tracking
  const maxWatchedRef = useRef(0);
  const dispatchTelemetry = async (maxWatchedSeconds: number) => {
    if (isReadOnly || maxWatchedSeconds <= 0) return;
    try {
      await fetch('/api/metrics/video', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json'
        },
        body: JSON.stringify({
           videoId: lessonId,
           maxWatchedSeconds: Math.floor(maxWatchedSeconds)
        })
      });
    } catch (e) {
      console.error("Telemetry error", e);
    }
  };

  useEffect(() => {
    // Dispatch telemetry when the user leaves the lesson page (unmounts)
    return () => {
      dispatchTelemetry(maxWatchedRef.current);
    };
  }, [lessonId]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.currentTime > maxWatchedRef.current) {
         maxWatchedRef.current = videoRef.current.currentTime;
      }
    }
  };

  const handlePause = () => {
    // Opportunistic save on explicit pause events
    dispatchTelemetry(maxWatchedRef.current);
  };

  const jumpToTime = (time: number) => {
    setShowQuiz(false); // Close quiz when hopping back to video
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleQualityChange = (q: '1080p' | '720p' | '360p' | 'Auto') => {
    if (q === quality) return;
    setQuality(q);
    
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      const isPaused = videoRef.current.paused;
      
      // In production, we'd swap the src URL based on the selected quality before loading
      // const videoSrcMap = { '1080p': '...1080p.mp4', '720p': '...720p.mp4', '360p': '...360p.mp4', 'Auto': '...1080p.mp4' };
      // videoRef.current.src = videoSrcMap[q];
      
      const onLoaded = () => {
        if (videoRef.current) {
          videoRef.current.currentTime = time;
          videoRef.current.playbackRate = playbackRate;
          if (!isPaused) {
            videoRef.current.play().catch(e => console.error("Playback interrupted", e));
          }
          videoRef.current.removeEventListener('loadedmetadata', onLoaded);
        }
      };
      
      videoRef.current.addEventListener('loadedmetadata', onLoaded);
      videoRef.current.load(); // Forces reload of the video element to mock the swap
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || !inputValue.trim() || isCopilotTyping) return;

    const newMessages = [...messages, { role: 'user' as const, content: inputValue }];
    setMessages(newMessages);
    setInputValue('');
    setIsCopilotTyping(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          transcript: transcriptText
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        assistantMessage += chunk;
        
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: assistantMessage };
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error communicating with the Curriculum Engine. Please try again." }]);
    } finally {
      setIsCopilotTyping(false);
    }
  };

  const fallbackDescription = "Pay close attention to this session. After mastering these principles, you'll be able to execute the concepts directly inside your own local workspace.";
  const displayDescription = description || fallbackDescription;

  return (
    <div className="flex absolute inset-0 bg-[#111111] text-[#FFFFFF] font-sans overflow-hidden w-full">
      
      {/* Sidebar - Context & Navigation */}
      <motion.div 
         initial={false}
         animate={{ width: isIntelligenceOpen ? 80 : 320 }}
         transition={{ type: 'spring', damping: 25, stiffness: 200 }}
         className="border-r border-[#2D2D2D] bg-[#111111] flex flex-col shrink-0 z-30 overflow-hidden"
      >
         {/* Navigation Top */}
         <div className={`h-16 flex items-center border-b border-[#2D2D2D] shrink-0 ${isIntelligenceOpen ? 'justify-center px-0' : 'px-6'}`}>
            <Link href="/dashboard" className="text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors flex items-center gap-2 group" title={isIntelligenceOpen ? "Exit to Dashboard" : ""}>
              <div className="w-8 h-8 rounded-full bg-[#1C1C1E] border border-[#2D2D2D] flex items-center justify-center group-hover:bg-[#1D1D21] transition-colors shadow-inner shrink-0">
                <ChevronLeft className="w-4 h-4 ml-[-2px]" />
              </div>
              {!isIntelligenceOpen && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] whitespace-nowrap">Exit to Dashboard</span>
              )}
            </Link>
         </div>

         {/* Sprint Context Area */}
         <div className="flex-1 overflow-y-auto min-h-0">
            <AnimatePresence initial={false}>
              {!isIntelligenceOpen && (
                <motion.div
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.2 }}
                  className="p-6 whitespace-nowrap"
                >
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B08D57]">
                        {typeof lessonOrder === 'number' ? `Session ${lessonOrder + 1}` : 'Active Session'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-[#2D2D2D] text-[9px] font-semibold uppercase tracking-[0.15em] text-[#9CA3AF] flex items-center gap-1.5 shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span> Active</span>
                   </div>
                   
                   <h1 className="text-xl font-semibold tracking-[-0.01em] text-[#FFFFFF] mb-3 leading-tight whitespace-normal">
                      {sprintTitle}
                   </h1>
                   
                   {/* Description with Truncation & Continue Reading link */}
                   <div className="mb-8 whitespace-normal">
                      <p className="text-[13px] leading-relaxed text-[#9CA3AF] inline">
                        {displayDescription.length > 200 
                           ? displayDescription.substring(0, 200).trim() + "... " 
                           : displayDescription + " "}
                      </p>
                      {displayDescription.length > 200 && (
                        <button 
                          onClick={() => {
                             setActiveTab('transcript');
                             setIsIntelligenceOpen(true);
                          }}
                          className="pt-1 text-[#FFFFFF] text-[12px] font-semibold tracking-wide hover:text-[#B08D57] transition-colors inline-block cursor-pointer"
                        >
                          Continue reading →
                        </button>
                      )}
                   </div>

                   {/* Sprint Deliverables & Notes */}
                   <div className="space-y-3">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888] mb-4">Sprint Agenda</h3>
                      
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-[#1C1C1E] border border-[#2D2D2D] whitespace-normal">
                         <Video className="w-4 h-4 text-[#9CA3AF] shrink-0 mt-0.5" />
                         <div>
                            <div className="text-[13px] font-medium text-[#FFFFFF] mb-1">1. Video Session</div>
                            <div className="text-[11px] text-[#9CA3AF] leading-relaxed">34 minutes of high-density instruction on architecture logic.</div>
                         </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-xl bg-transparent border border-[#2D2D2D] opacity-50 whitespace-normal">
                         <FileText className="w-4 h-4 text-[#9CA3AF] shrink-0 mt-0.5" />
                         <div>
                            <div className="text-[13px] font-medium text-[#FFFFFF] mb-1">2. Implementation</div>
                            <div className="text-[11px] text-[#9CA3AF] leading-relaxed">Apply the learned concepts to your local workspace.</div>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>

         {/* AI TA Toggle (Footer) */}
         <div className={`p-4 border-t border-[#2D2D2D] shrink-0 bg-[#111111] ${isIntelligenceOpen ? 'flex justify-center px-0' : ''}`}>
            <button 
               onClick={() => setIsIntelligenceOpen(!isIntelligenceOpen)}
               className={`py-3.5 rounded-xl border transition-colors flex items-center justify-between group cursor-pointer ${
                 isIntelligenceOpen 
                    ? 'w-12 h-12 justify-center bg-[#1D1D21] border-[#2D2D2D] hover:bg-[#252529] px-0' 
                    : 'w-full px-3 bg-[#1C1C1E] border-[#2D2D2D] hover:bg-[#1D1D21]'
               }`}
               title={isIntelligenceOpen ? "Close Intelligence" : "Open Intelligence"}
            >
               <div className={`flex items-center overflow-hidden ${isIntelligenceOpen ? 'justify-center w-full' : 'gap-3'}`}>
                  <div className={`rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                     isIntelligenceOpen 
                        ? 'w-6 h-6 border-transparent bg-transparent' // In collapsed state, just show the icon without the circle border
                        : 'w-6 h-6 bg-[#1D1D21] border-[#2D2D2D] group-hover:bg-[#252529]'
                  }`}>
                     <MessageSquare className={`transition-colors ${
                        isIntelligenceOpen 
                           ? 'w-5 h-5 text-[#FFFFFF]' // Larger icon when fully collapsed
                           : 'w-3 h-3 text-[#9CA3AF] group-hover:text-[#FFFFFF]'
                     }`} />
                  </div>
                  {!isIntelligenceOpen && (
                    <span className="text-sm font-medium transition-colors whitespace-nowrap text-[#9CA3AF] group-hover:text-[#FFFFFF]">
                       OpenSch Intelligence
                    </span>
                  )}
               </div>
               {!isIntelligenceOpen && (
                 <span className="text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors text-[#888888] group-hover:text-[#9CA3AF] shrink-0 ml-2">
                    Open
                 </span>
               )}
            </button>
         </div>
      </motion.div>

      {/* Main Video Area & Intelligence Sidebar (75%) */}
      <div className="flex-1 flex flex-col relative min-w-0 bg-transparent">
        
        {/* Top bar (Floating/Subtle) - Only shown on the final lesson of the module */}
        <AnimatePresence>
          {isLastLesson && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, paddingRight: isIntelligenceOpen ? 432 : 32 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 w-full h-16 flex items-center bg-gradient-to-b from-[#0B0B0C]/80 to-transparent justify-end shrink-0 z-50 pointer-events-none pl-8"
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="pointer-events-auto">
                <DeliverableSubmissionFeature sprintTitle={sprintTitle} isReadOnly={isReadOnly} />
              </div>
            </motion.div>
          )}

          {quizData && quizData.length > 0 && !showQuiz && hasVideoEnded && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
            >
               <button 
                  onClick={() => setShowQuiz(true)}
                  className="px-6 py-3 bg-white text-black text-[13px] font-bold tracking-widest uppercase rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-all"
               >
                  VERIFY KNOWLEDGE TO CONTINUE
               </button>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Cinematic Video Player Space */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden group p-8">
          
          <StudentQuizGateway 
              isOpen={showQuiz}
              lessonId={lessonId}
              quizData={quizData}
              isCompleted={isCompleted}
              onSeek={jumpToTime}
              onPassed={() => {
                 setShowQuiz(false);
                 if (nextLessonUrl && !isReadOnly) {
                    router.push(nextLessonUrl);
                 }
              }}
              onClose={() => setShowQuiz(false)}
              isReadOnly={isReadOnly}
           />

          {/* Custom Speed Controls (Floating Top Right) */}
          <motion.div 
            layout
            className="relative w-full aspect-video bg-[#111111] border border-[#2D2D2D] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden group/video"
            style={{ maxWidth: isIntelligenceOpen ? 'calc(100% - 400px)' : '1024px', marginRight: isIntelligenceOpen ? '420px' : '0' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <video 
              ref={videoRef}
              onTimeUpdate={handleTimeUpdate}
              onPause={handlePause}
              onEnded={() => {
                setHasVideoEnded(true);
                if (quizData && quizData.length > 0) {
                  setShowQuiz(true);
                }
              }}
              controls 
              controlsList="nodownload"
              className="w-full h-full outline-none bg-black"
              preload="metadata"
            >
              <source src={videoUrl || `/Lesson Video/${sprintTitle}.mp4`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Floating Control Panels */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              
              {/* Quality Control Panel (Inactive) */}
              <div className="group/quality relative flex items-center justify-end cursor-not-allowed" title="Manual quality selection coming soon">
                <div className="w-10 h-10 rounded-xl bg-[#111111]/90 backdrop-blur-xl border border-[#2D2D2D]/60 flex items-center justify-center shadow-lg text-[#FFFFFF] opacity-0 group-hover/video:opacity-50 transition-opacity duration-300 z-10">
                   <span className="text-[10px] font-bold text-[#9CA3AF]">Auto</span>
                   <span className="absolute -bottom-1 -right-1 bg-[#2D2D2D] text-[#888888] text-[8px] font-bold px-1 rounded-sm shadow-sm leading-tight">HD</span>
                </div>
              </div>

              {/* Speed Control Panel */}
              <div className="group/speed relative flex items-center justify-end">
                {/* Invisible hover bridge container */}
                <div className="absolute right-full pr-2 top-1/2 -translate-y-1/2 flex items-center opacity-0 -translate-x-2 group-hover/speed:opacity-100 group-hover/speed:translate-x-0 transition-all duration-300 pointer-events-none group-hover/speed:pointer-events-auto z-20">
                  <div className="flex items-center gap-1 bg-[#111111]/90 backdrop-blur-xl border border-[#2D2D2D]/60 p-1.5 rounded-xl shadow-2xl shadow-black/50">
                    {[1, 1.25, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.playbackRate = speed;
                            setPlaybackRate(speed);
                          }
                        }}
                        className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap ${
                          playbackRate === speed 
                            ? 'bg-white text-black shadow-sm' 
                            : 'text-[#9CA3AF] hover:bg-white/10 hover:text-white'
                        }`}
                        title={`Set speed to ${speed}x`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="w-10 h-10 rounded-xl bg-[#111111]/90 backdrop-blur-xl border border-[#2D2D2D]/60 flex items-center justify-center cursor-default shadow-lg text-[#FFFFFF] opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 z-10">
                   <Settings className="w-4 h-4 text-[#9CA3AF] group-hover/speed:text-white transition-colors group-hover/speed:rotate-90 duration-500" />
                   <span className="absolute -bottom-1 -right-1 bg-[#B08D57] text-black text-[9px] font-bold px-1 rounded-sm shadow-sm leading-tight">{playbackRate}x</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sliding AI Sidebar */}
          <AnimatePresence>
            {isIntelligenceOpen && (
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 h-full w-[400px] bg-[#111111]/90 backdrop-blur-2xl border-l border-[#2D2D2D] flex flex-col z-40 shadow-2xl"
              >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-[#2D2D2D] shrink-0">
                  <div className="flex bg-[#1C1C1E] p-1 rounded-lg border border-[#2D2D2D]">
                    <button 
                      onClick={() => setActiveTab('transcript')}
                      className={`px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-md transition-all flex items-center gap-2 ${activeTab === 'transcript' ? 'bg-[#252529] text-[#FFFFFF] shadow-sm' : 'text-[#888888] hover:text-[#9CA3AF]'}`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Transcript
                    </button>
                    <button 
                      onClick={() => setActiveTab('copilot')}
                      className={`px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-md transition-all flex items-center gap-2 ${activeTab === 'copilot' ? 'bg-[#252529] text-[#FFFFFF] shadow-sm' : 'text-[#888888] hover:text-[#9CA3AF]'}`}
                    >
                      <Bot className="w-3.5 h-3.5" />
                      OpenSch Intelligence
                    </button>
                  </div>
                  <button 
                    onClick={() => setIsIntelligenceOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-[#888888] hover:text-[#FFFFFF] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                  {activeTab === 'transcript' ? (
                    <div className="space-y-6">
                      {segments.map((segment: any, index: number) => {
                        const isActive = currentTime >= segment.start && currentTime < segment.end;
                        
                        return (
                          <div 
                            key={segment.id || index}
                            onClick={() => jumpToTime(segment.start)}
                            className="flex gap-4 group/line cursor-pointer"
                          >
                             <span className={`text-[10px] font-mono tracking-wider mt-1 transition-colors ${isActive ? 'text-[#B08D57]' : 'text-[#9CA3AF] group-hover/line:text-[#FFFFFF]'}`}>
                               {formatTime(segment.start)}
                             </span>
                             <p className={`text-[14px] leading-relaxed transition-colors ${isActive ? 'text-[#FFFFFF] font-medium' : 'text-[#9CA3AF] group-hover/line:text-[#FFFFFF]'}`}>
                               {segment.text}
                             </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                       <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                          {/* Initial Greeting */}
                          <div className="flex gap-3">
                             <div className="w-6 h-6 rounded-full bg-[#1C1C1E] border border-[#2D2D2D] flex items-center justify-center shrink-0 mt-1">
                                <Bot className="w-3.5 h-3.5 text-[#B08D57]" />
                             </div>
                             <div className="text-[13px] leading-relaxed text-[#9CA3AF] bg-[#1C1C1E] border border-[#2D2D2D] p-4 rounded-2xl rounded-tl-none">
                                I have complete context on Sprint 3: {sprintTitle}. What do you need help with?
                             </div>
                          </div>

                          {/* Message History */}
                          {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                               <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-[#1D1D21] border-[#2D2D2D]' : 'bg-[#1C1C1E] border-[#2D2D2D]'}`}>
                                  {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-[#9CA3AF]" /> : <Bot className="w-3.5 h-3.5 text-[#B08D57]" />}
                               </div>
                               <div className={`text-[13px] leading-relaxed p-4 rounded-2xl ${
                                  msg.role === 'user' 
                                    ? 'bg-[#1D1D21] border border-[#2D2D2D] text-[#FFFFFF] rounded-tr-none' 
                                    : 'bg-[#1C1C1E] border border-[#2D2D2D] text-[#9CA3AF] rounded-tl-none'
                               }`}>
                                  {msg.content}
                               </div>
                            </div>
                          ))}
                          
                          {/* Loading Indicator */}
                          {isCopilotTyping && (
                            <div className="flex gap-3">
                               <div className="w-6 h-6 rounded-full bg-[#1C1C1E] border border-[#2D2D2D] flex items-center justify-center shrink-0 mt-1">
                                  <Bot className="w-3.5 h-3.5 text-[#B08D57]" />
                               </div>
                               <div className="text-[13px] leading-relaxed text-[#9CA3AF] bg-[#1C1C1E] border border-[#2D2D2D] p-4 rounded-2xl rounded-tl-none">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                               </div>
                            </div>
                          )}
                          <div ref={chatEndRef} />
                       </div>
                       
                       <div className="shrink-0 mt-auto">
                          <form onSubmit={handleChatSubmit} className="relative">
                             <input 
                               type="text" 
                               value={inputValue}
                               onChange={(e) => setInputValue(e.target.value)}
                               disabled={isCopilotTyping}
                               placeholder="Ask OpenSch Intelligence about this lesson..." 
                               className="w-full bg-[#1C1C1E] border border-[#2D2D2D] rounded-xl py-3 pl-4 pr-12 text-[13px] text-[#FFFFFF] focus:outline-none focus:border-[#2D2D2D] transition-all placeholder:text-[#3A3A40] disabled:opacity-50" 
                             />
                             <button 
                               type="submit"
                               disabled={!inputValue.trim() || isCopilotTyping}
                               className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                                <MessageSquare className="w-4 h-4 text-[#9CA3AF]" />
                             </button>
                          </form>
                          <p className="text-[10px] text-center text-[#3A3A40] mt-3">OpenSch Intelligence answers are grounded in the active lesson transcript.</p>
                       </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

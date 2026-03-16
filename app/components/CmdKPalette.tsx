'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MonitorPlay, MessageSquare, Zap, BookOpen, ChevronRight, Play, Settings, Bell, LayoutDashboard, Target, Users, BookMarked, Code, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

import { MOCK_FEED_ITEMS } from '@/lib/mock-data';

// Indexed Search Data
const BASE_SEARCH_INDEX = [
  { id: '1', category: 'Quick Actions', title: 'Resume Program', subtitle: 'Implementing OAuth Providers', icon: Play, href: '/dashboard', action: 'route' },
  { id: '2', category: 'Quick Actions', title: 'Ask OpenSch Intelligence', subtitle: 'Get help with code, concepts, or debugging', icon: MessageSquare, action: 'copilot' },
  
  { id: '3', category: 'Navigation', title: 'Dashboard', subtitle: 'Your daily progress and cohort activity', icon: LayoutDashboard, href: '/dashboard', action: 'route' },
  { id: '4', category: 'Navigation', title: 'Curriculum', subtitle: 'Access modules, lessons, and assignments', icon: BookOpen, href: '/curriculum', action: 'route' },
  { id: '5', category: 'Navigation', title: 'Campus Feed', subtitle: 'Discussions, questions, and peer reviews', icon: Users, href: '/feed', action: 'route' },
  { id: '6', category: 'Navigation', title: 'Portfolio', subtitle: 'Your public academic record and proof of work', icon: Target, href: '/portfolio', action: 'route' },
  { id: '7', category: 'Navigation', title: 'Code Snippets', subtitle: 'Your saved solutions and patterns', icon: Code, href: '/portfolio', action: 'route' },
  { id: '8', category: 'Navigation', title: 'Achievements', subtitle: 'Badges and honors earned', icon: Award, href: '/portfolio', action: 'route' },
  
  { id: '9', category: 'Settings', title: 'Account Settings', subtitle: 'Manage profile and preferences', icon: Settings, href: '/settings', action: 'route' },
  { id: '10', category: 'Settings', title: 'Notification Preferences', subtitle: 'Configure email and platform alerts', icon: Bell, href: '/settings', action: 'route' },
];

const SEARCH_INDEX = [
  ...BASE_SEARCH_INDEX,
  ...MOCK_FEED_ITEMS.map((post) => ({
    id: `post-${post.id}`,
    category: 'Campus Discussions',
    title: post.title,
    subtitle: `${post.type} by ${post.user.name} • ${post.content.substring(0, 60)}...`,
    icon: MessageSquare,
    href: `/feed/${post.id}`,
    action: 'route'
  }))
];

export function CmdKPalette() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'search' | 'copilot'>('search');
  const [entryMode, setEntryMode] = useState<'search' | 'copilot'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Copilot State
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isCopilotTyping, setIsCopilotTyping] = useState(false);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter items based on search query
  const filteredItems = SEARCH_INDEX.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered items by category for rendering
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof SEARCH_INDEX>);

  // Global Event Listeners
  useEffect(() => {
    const handleCustomOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode?: 'search' | 'copilot' }>;
      const newMode = customEvent.detail?.mode || 'search';
      setOpen(true);
      setMode(newMode);
      setEntryMode(newMode);
      setSearchQuery('');
      setSelectedIndex(0);
    };

    const down = (e: KeyboardEvent) => {
      // Toggle CmdK
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => {
          if (!open) {
            setSearchQuery('');
            setSelectedIndex(0);
            setMode('search');
            setEntryMode('search');
          }
          return !open;
        });
      }
      
      if (!open) return;

      // Navigation & Selection Logic
      if (e.key === 'Escape') {
        e.preventDefault();
        if (mode === 'copilot' && entryMode === 'search') {
           setMode('search');
           setSearchQuery('');
        } else {
           setOpen(false);
        }
      } else if (e.key === 'ArrowDown' && mode === 'search') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp' && mode === 'search') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
    };

    document.addEventListener('keydown', down);
    document.addEventListener('open-cmdk', handleCustomOpen);
    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('open-cmdk', handleCustomOpen);
    };
  }, [open, filteredItems, selectedIndex, mode]);

  // Handle Form Submission for Search and Chat
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
     if (e.key === 'Enter') {
        e.preventDefault();
        if (mode === 'search') {
           if (filteredItems.length > 0) {
              handleSelect(filteredItems[selectedIndex]);
           }
        } else if (mode === 'copilot') {
           await handleChatSubmit();
        }
     }
  };

  const handleChatSubmit = async () => {
    if (!searchQuery.trim() || isCopilotTyping) return;
    
    const inputValue = searchQuery;
    const newMessages = [...messages, { role: 'user' as const, content: inputValue }];
    setMessages(newMessages);
    setSearchQuery('');
    setIsCopilotTyping(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, transcript: "OpenSch Intelligence Request" }),
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
        
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered an error connecting to the intelligence layer. Please try again." }]);
    } finally {
      setIsCopilotTyping(false);
    }
  };

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Scroll active search item or latest chat message into view
  useEffect(() => {
    if (listRef.current && open) {
      if (mode === 'search') {
         const activeElement = listRef.current.querySelector('[data-active="true"]');
         if (activeElement) {
           activeElement.scrollIntoView({ block: 'nearest' });
         }
      } else if (mode === 'copilot') {
         listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }
  }, [selectedIndex, open, mode, messages]);

  const handleSelect = (item: typeof SEARCH_INDEX[0]) => {
    if (item.action === 'copilot') {
      setMode('copilot');
      setSearchQuery('');
      return;
    }
    setOpen(false);
    if (item.action === 'route' && item.href) {
      router.push(item.href);
    }
  };

  if (!open) return null;

  let globalIndexCounter = 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => setOpen(false)} 
      />
      
      {/* Palette Container */}
      <div className={`relative w-full ${mode === 'copilot' ? 'max-w-3xl' : 'max-w-2xl'} bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-all`}>
        <div className="flex items-center px-4 py-4 border-b border-[#1a1a1a]">
          {mode === 'copilot' ? (
             <Zap className="w-5 h-5 text-[#B08D57] mr-3 shrink-0" />
          ) : (
             <Search className="w-5 h-5 text-[#8e8e93] mr-3 shrink-0" />
          )}
          <input
            ref={inputRef}
            autoFocus
            type="text"
            className="flex-1 bg-transparent !border-0 !outline-none !ring-0 focus:!ring-0 focus:!outline-none focus:!border-transparent active:outline-none text-white text-[15px] placeholder-[#3c3c3e]"
            placeholder={mode === 'copilot' ? "Ask OpenSch Intelligence anything..." : "Type a command or search..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isCopilotTyping}
          />
          {mode === 'copilot' && (
             <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-semibold tracking-wider text-[#8e8e93] uppercase shrink-0">OpenSch Intelligence</div>
          )}
        </div>
        
        <div ref={listRef} className={`overflow-y-auto p-2 ${mode === 'copilot' ? 'max-h-[65vh] min-h-[40vh] p-4 flex flex-col gap-5' : 'max-h-[60vh]'}`}>
          
          {mode === 'copilot' ? (
             messages.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center h-full my-auto">
                   <div className="w-14 h-14 rounded-full bg-[#111111] border border-[#2D2D2D] flex items-center justify-center mb-5">
                      <Zap className="w-6 h-6 text-[#B08D57]" />
                   </div>
                   <h3 className="text-lg font-semibold text-[#FFFFFF] tracking-tight mb-2">OpenSch Intelligence</h3>
                   <p className="text-[14px] text-[#8e8e93] max-w-sm leading-relaxed">Ask me anything about the curriculum, debug an issue, or request code examples directly from here.</p>
                </div>
             ) : (
                <>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-md flex items-center justify-center bg-[#B08D57]/10 border border-[#B08D57]/20 text-[#B08D57] shrink-0 mt-0.5">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className={`text-[14px] leading-relaxed ${msg.role === 'user' ? 'px-4 py-2.5 rounded-2xl bg-[#2D2D2D] text-[#FFFFFF]' : 'bg-transparent text-[#D1D5DB] pt-1.5'} max-w-[85%]`}>
                      {msg.role === 'user' ? (
                         msg.content
                      ) : (
                         <div className="prose prose-invert prose-p:leading-relaxed max-w-none text-[14px]">
                            {!msg.content && isCopilotTyping && idx === messages.length - 1 ? (
                               <span className="animate-pulse flex items-center gap-1 mt-1"><span className="w-1.5 h-1.5 bg-[#B08D57] rounded-full"></span><span className="w-1.5 h-1.5 bg-[#B08D57] rounded-full animation-delay-150"></span><span className="w-1.5 h-1.5 bg-[#B08D57] rounded-full animation-delay-300"></span></span>
                            ) : (
                               <ReactMarkdown>{msg.content}</ReactMarkdown>
                            )}
                         </div>
                      )}
                    </div>
                  </div>
                ))}
                </>
             )
          ) : (
            filteredItems.length === 0 ? (
               <div className="py-14 text-center text-[#8e8e93] text-[14px]">
                  No results found for "<span className="text-white">{searchQuery}</span>"
               </div>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="px-2 py-2">
                  <h3 className="text-xs font-semibold text-[#8e8e93] uppercase tracking-widest mb-2 px-2">{category}</h3>
                  
                  {items.map((item) => {
                    const currentIndex = globalIndexCounter++;
                    const isActive = currentIndex === selectedIndex;
                    
                    return (
                      <button 
                        key={item.id}
                        data-active={isActive}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-colors group text-left mt-1 ${isActive ? 'bg-[#1a1a1a]' : 'hover:bg-[#111111]'}`}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${isActive ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 group-hover:bg-white/10'}`}>
                            <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8e8e93] group-hover:text-white'}`} fill={category === 'Quick Actions' && item.title === 'Resume Program' ? 'currentColor' : 'none'} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium text-[14px] truncate ${isActive ? 'text-white' : 'text-[#e5e5e5]'}`}>{item.title}</div>
                            <div className="text-[13px] text-[#8e8e93] truncate">{item.subtitle}</div>
                          </div>
                          {category === 'Quick Actions' ? (
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${isActive ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/5 text-[#8e8e93] group-hover:text-white transition-colors'}`}>
                              {item.action === 'copilot' ? 'Chat' : 'Go'}
                            </span>
                          ) : (
                            <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#3c3c3e] group-hover:text-white'}`} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))
            )
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-[#050505] border-t border-[#1a1a1a] p-3 flex items-center justify-between px-5 text-xs text-[#8e8e93]">
           <span className="flex items-center gap-3">
             {mode === 'search' ? (
                <>
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-[#111111] border border-[#2c2c2e] font-sans">↑</kbd><kbd className="px-1.5 py-0.5 rounded bg-[#111111] border border-[#2c2c2e] font-sans">↓</kbd> navigate</span>
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-[#111111] border border-[#2c2c2e] font-sans">↵</kbd> select</span>
                </>
             ) : (
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-[#111111] border border-[#2c2c2e] font-sans">↵</kbd> send message</span>
             )}
             <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-[#111111] border border-[#2c2c2e] font-sans">esc</kbd> {mode === 'copilot' && entryMode === 'search' ? 'back to search' : 'close'}</span>
           </span>
           {mode === 'search' && (
              <span><span className="text-white font-medium">{filteredItems.length}</span> results</span>
           )}
        </div>
      </div>
    </div>
  );
}

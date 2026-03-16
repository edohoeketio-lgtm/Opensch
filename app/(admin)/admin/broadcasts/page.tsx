"use client";

import { useState } from 'react';
import { Megaphone, Send, Users, Sparkles, Clock, CalendarDays } from 'lucide-react';

export default function BroadcastsPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all'); // all, spring25, fall24

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#FFFFFF]">Broadcasts</h1>
          <p className="text-[#888888] text-sm">Deploy overarching announcements to active cohorts or the entire campus.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Compose Area */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-[#1C1C1E] border border-white/5 shadow-2xl shadow-black/50 rounded-2xl p-6">
             
             <div className="space-y-6">
                {/* Target Selection */}
                <div className="space-y-3">
                   <label className="text-xs font-semibold text-[#888888] uppercase tracking-[0.1em]">Target Audience</label>
                   <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={() => setTarget('all')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                          target === 'all' 
                            ? 'bg-[#B08D57]/10 border-[#B08D57]/30 text-[#B08D57]' 
                            : 'bg-[#111111] border-[#2D2D2D] text-[#888888] hover:bg-white/5 hover:text-[#FFFFFF]'
                        }`}
                      >
                         <Users className="w-5 h-5 mb-2" />
                         <span className="text-sm font-medium">Entire Campus</span>
                      </button>
                      <button 
                        onClick={() => setTarget('spring25')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                          target === 'spring25' 
                            ? 'bg-[#B08D57]/10 border-[#B08D57]/30 text-[#B08D57]' 
                            : 'bg-[#111111] border-[#2D2D2D] text-[#888888] hover:bg-white/5 hover:text-[#FFFFFF]'
                        }`}
                      >
                         <Clock className="w-5 h-5 mb-2" />
                         <span className="text-sm font-medium">Spring 25</span>
                      </button>
                      <button 
                        onClick={() => setTarget('fall24')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                          target === 'fall24' 
                            ? 'bg-[#B08D57]/10 border-[#B08D57]/30 text-[#B08D57]' 
                            : 'bg-[#111111] border-[#2D2D2D] text-[#888888] hover:bg-white/5 hover:text-[#FFFFFF]'
                        }`}
                      >
                         <CalendarDays className="w-5 h-5 mb-2" />
                         <span className="text-sm font-medium">Fall 24</span>
                      </button>
                   </div>
                </div>

                {/* Subject Line */}
                <div className="space-y-2">
                   <label className="text-xs font-semibold text-[#888888] uppercase tracking-[0.1em]">Subject Line</label>
                   <input
                      type="text"
                      placeholder="e.g. Critical Update: Week 4 Curriculum Released"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#111111] border border-[#2D2D2D] rounded-xl px-4 py-3 text-[#FFFFFF] text-sm focus:outline-none focus:border-[#B08D57] transition-colors placeholder:text-[#525252]"
                   />
                </div>

                {/* Message Body */}
                <div className="space-y-2 relative">
                   <div className="flex items-center justify-between">
                     <label className="text-xs font-semibold text-[#888888] uppercase tracking-[0.1em]">Message Body</label>
                     <button className="flex items-center gap-1.5 text-xs font-medium text-[#B08D57] hover:text-[#FFFFFF] transition-colors">
                        <Sparkles className="w-3.5 h-3.5" />
                        Enhance Tone
                     </button>
                   </div>
                   <textarea
                      placeholder="Write your announcement here. Markdown is supported."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full h-64 bg-[#111111] border border-[#2D2D2D] rounded-xl px-4 py-3 text-[#FFFFFF] text-sm focus:outline-none focus:border-[#B08D57] transition-colors resize-none placeholder:text-[#525252] leading-relaxed"
                   />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2D2D2D]/50">
                    <button className="px-6 py-2.5 rounded-xl border border-[#2D2D2D] text-[#888888] text-sm font-medium hover:text-[#FFFFFF] hover:bg-white/5 transition-all">
                        Save as Draft
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-[#FFFFFF] text-[#0B0B0C] rounded-xl text-sm font-semibold hover:bg-[#F5F2EB] hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-white/5">
                        <Send className="w-4 h-4" />
                        Deploy Broadcast
                    </button>
                </div>

             </div>
           </div>
        </div>

        {/* Info / Sidebar Panel */}
        <div className="space-y-6 hidden lg:block">
           <div className="bg-[#1C1C1E] border border-white/5 shadow-2xl shadow-black/50 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-[#111111] border border-[#2D2D2D] flex items-center justify-center mb-4">
                 <Megaphone className="w-5 h-5 text-[#B08D57]" />
              </div>
              <h3 className="text-[#FFFFFF] font-medium mb-2">Broadcast Protocol</h3>
              <p className="text-sm text-[#888888] leading-relaxed mb-4">
                 Broadcasts are simultaneously deployed to the Campus Feed and pushed directly to students via email depending on their notification preferences.
              </p>
              <div className="bg-[#111111] border border-[#2D2D2D] rounded-xl p-4">
                 <h4 className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider mb-2">Markdown Supported</h4>
                 <ul className="text-xs text-[#525252] space-y-1.5 font-mono">
                    <li>**Bold text**</li>
                    <li>*Italic text*</li>
                    <li>[Link](url)</li>
                    <li># Heading 1</li>
                 </ul>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

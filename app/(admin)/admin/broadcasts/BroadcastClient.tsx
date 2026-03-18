"use client";

import { useState } from 'react';
import { Megaphone, Send, Users, Sparkles, Clock, CalendarDays, Archive, FileEdit, Calendar, Trash2 } from 'lucide-react';
import { deployBroadcast, updateBroadcast, deleteBroadcast } from '@/app/actions/broadcasts';
import { useToast } from '@/app/(portal)/components/ToastContext';

export interface UI_Broadcast {
  id: string;
  title: string;
  content: string;
  status: string;
  scheduledFor: Date | null;
  createdAt: Date;
  author: {
    email: string;
    profile: { fullName: string | null } | null;
  };
  targetAudience: string;
}

export default function BroadcastClient({ initialBroadcasts }: { initialBroadcasts: UI_Broadcast[] }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all'); // all, spring25, fall24
  const [scheduledFor, setScheduledFor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeploy = async (status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED') => {
    if (!subject.trim() || !message.trim()) {
       toast({ message: 'Subject and message are required.', type: 'error' });
       return;
    }
    if (status === 'SCHEDULED' && !scheduledFor) {
       toast({ message: 'Please select a date and time for scheduling.', type: 'error' });
       return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('message', message);
      formData.append('target', target);
      if (scheduledFor) {
        // format expected by Date parsing
        formData.append('scheduledFor', scheduledFor);
      }
      
      let result;
      if (editingId) {
        result = await updateBroadcast(editingId, formData);
      } else {
        result = await deployBroadcast(formData, status);
      }
      
      if (result.success) {
        toast({ 
          message: status === 'PUBLISHED' ? 'Broadcast deployed to campus.' : 
                   status === 'DRAFT' ? 'Draft saved successfully.' : 
                   'Broadcast scheduled.', 
          type: 'success' 
        });
        setSubject('');
        setMessage('');
        setScheduledFor('');
        setEditingId(null);
      } else {
        toast({ message: result.error || 'Unknown error occurred.', type: 'error' });
      }
    } catch (error) {
      toast({ message: 'Failed to process broadcast.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (b: UI_Broadcast) => {
    setSubject(b.title);
    setMessage(b.content);
    setTarget(b.targetAudience);
    if (b.scheduledFor) {
       // local datetime-local format: YYYY-MM-DDThh:mm
       const d = new Date(b.scheduledFor);
       setScheduledFor(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
    } else {
       setScheduledFor('');
    }
    setEditingId(b.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this broadcast?")) return;
    try {
      const res = await deleteBroadcast(id);
      if (res.success) {
        toast({ message: "Broadcast deleted successfully.", type: "success" });
        if (editingId === id) setEditingId(null);
      }
    } catch (e) {
      toast({ message: "Failed to delete broadcast.", type: "error" });
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-surface">Broadcasts</h1>
          <p className="text-admin-muted text-sm">Deploy overarching announcements to active cohorts or the entire campus.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Compose Area */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-admin-surface border border-white/5 shadow-2xl shadow-black/50 rounded-2xl p-6">
             <div className="space-y-6">
                
                {/* Target Selection */}
                <div className="space-y-3">
                   <label className="text-xs font-semibold text-admin-muted uppercase tracking-[0.1em]">Target Audience</label>
                   <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={() => setTarget('all')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                          target === 'all' 
                            ? 'bg-[#B08D57]/10 border-[#B08D57]/30 text-accent' 
                            : 'bg-ink border-admin-border text-admin-muted hover:bg-white/5 hover:text-surface'
                        }`}
                      >
                         <Users className="w-5 h-5 mb-2" />
                         <span className="text-sm font-medium">Entire Campus</span>
                      </button>
                      <button 
                        onClick={() => setTarget('spring25')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                          target === 'spring25' 
                            ? 'bg-[#B08D57]/10 border-[#B08D57]/30 text-accent' 
                            : 'bg-ink border-admin-border text-admin-muted hover:bg-white/5 hover:text-surface'
                        }`}
                      >
                         <Clock className="w-5 h-5 mb-2" />
                         <span className="text-sm font-medium">Spring 25</span>
                      </button>
                      <button 
                        onClick={() => setTarget('fall24')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                          target === 'fall24' 
                            ? 'bg-[#B08D57]/10 border-[#B08D57]/30 text-accent' 
                            : 'bg-ink border-admin-border text-admin-muted hover:bg-white/5 hover:text-surface'
                        }`}
                      >
                         <CalendarDays className="w-5 h-5 mb-2" />
                         <span className="text-sm font-medium">Fall 24</span>
                      </button>
                   </div>
                </div>

                {/* Subject Line & Scheduling */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                     <label className="text-xs font-semibold text-admin-muted uppercase tracking-[0.1em]">Subject Line</label>
                     <input
                        type="text"
                        placeholder="e.g. Critical Update: Week 4 Curriculum..."
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-ink border border-admin-border rounded-xl px-4 py-3 text-surface text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-admin-muted-dark"
                     />
                  </div>
                  <div className="space-y-2 relative">
                     <label className="text-xs font-semibold text-admin-muted uppercase tracking-[0.1em] flex items-center justify-between">
                       <span>{editingId ? "Update Schedule" : "Schedule"}</span>
                       {scheduledFor && (
                         <button onClick={() => setScheduledFor('')} className="text-[9px] text-red-400 hover:text-red-300">CLEAR</button>
                       )}
                     </label>
                     <input
                        type="datetime-local"
                        value={scheduledFor}
                        onChange={(e) => setScheduledFor(e.target.value)}
                        className="w-full bg-ink border border-admin-border rounded-xl px-4 py-3 text-surface text-sm focus:outline-none focus:border-accent transition-colors [&::-webkit-calendar-picker-indicator]:invert"
                     />
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-2 relative">
                   <div className="flex items-center justify-between">
                     <label className="text-xs font-semibold text-admin-muted uppercase tracking-[0.1em]">Message Body</label>
                     <button className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-surface transition-colors">
                        <Sparkles className="w-3.5 h-3.5" />
                        Enhance Tone
                     </button>
                   </div>
                   <textarea
                      placeholder="Write your announcement here. Markdown is supported."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full h-64 bg-ink border border-admin-border rounded-xl px-4 py-3 text-surface text-sm focus:outline-none focus:border-accent transition-colors resize-none placeholder:text-admin-muted-dark leading-relaxed"
                   />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-admin-border/50">
                    <div>
                      {editingId && (
                        <button 
                          onClick={() => { setEditingId(null); setSubject(''); setMessage(''); setScheduledFor(''); }}
                          className="text-[10px] uppercase font-semibold text-admin-muted hover:text-surface transition-colors"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleDeploy('DRAFT')}
                        disabled={isSubmitting || (!subject.trim() && !message.trim())}
                        className="px-6 py-2.5 rounded-xl border border-admin-border text-admin-muted text-sm font-medium hover:text-surface hover:bg-white/5 transition-all disabled:opacity-50"
                      >
                          Save as Draft
                      </button>
                      {scheduledFor ? (
                        <button 
                          onClick={() => handleDeploy('SCHEDULED')}
                          disabled={isSubmitting || !subject.trim() || !message.trim()}
                          className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-blue-500/10 disabled:opacity-50"
                        >
                            <Calendar className="w-4 h-4" />
                            {isSubmitting ? (editingId ? 'Updating...' : 'Scheduling...') : (editingId ? 'Update Schedule' : 'Schedule Broadcast')}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleDeploy('PUBLISHED')}
                          disabled={isSubmitting || !subject.trim() || !message.trim()}
                          className="flex items-center gap-2 px-6 py-2.5 bg-[#FFFFFF] text-[#0B0B0C] rounded-xl text-sm font-semibold hover:bg-[#F5F2EB] hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-white/5 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                            {isSubmitting ? (editingId ? 'Updating...' : 'Deploying...') : (editingId ? 'Update Broadcast' : 'Deploy Broadcast')}
                        </button>
                      )}
                    </div>
                </div>

             </div>
           </div>
        </div>

        {/* Info / Sidebar Panel */}
        <div className="space-y-6">
           {/* Guidance Panel */}
           <div className="bg-admin-surface border border-white/5 shadow-2xl shadow-black/50 rounded-2xl p-6 hidden lg:block">
              <div className="w-10 h-10 rounded-xl bg-ink border border-admin-border flex items-center justify-center mb-4">
                 <Megaphone className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-surface font-medium mb-2">Broadcast Protocol</h3>
              <p className="text-sm text-admin-muted leading-relaxed mb-4">
                 Broadcasts are simultaneously deployed to the Campus Feed and pushed directly to students via email depending on their notification preferences.
              </p>
              <div className="bg-ink border border-admin-border rounded-xl p-4">
                 <h4 className="text-xs font-semibold text-surface uppercase tracking-wider mb-2">Markdown Supported</h4>
                 <ul className="text-xs text-admin-muted-dark space-y-1.5 font-mono">
                    <li>**Bold text**</li>
                    <li>*Italic text*</li>
                    <li>[Link](url)</li>
                    <li># Heading 1</li>
                 </ul>
              </div>
           </div>

           {/* Switchboard (Recent Broadcasts) */}
           <div className="bg-admin-surface border border-white/5 shadow-2xl shadow-black/50 rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-surface font-semibold text-base leading-none">Broadcast Switchboard</h3>
              <div className="flex flex-col gap-3">
                 {initialBroadcasts.length === 0 && (
                   <p className="text-xs text-admin-muted py-8 text-center border border-dashed border-admin-border rounded-xl">No active broadcasts found.</p>
                 )}
                 {initialBroadcasts.slice(0, 10).map((b) => (
                    <div key={b.id} className="p-3 bg-ink border border-admin-border rounded-xl hover:border-admin-border-hover transition-colors flex flex-col gap-2 group cursor-pointer group">
                       <div className="flex items-start justify-between gap-3">
                          <span className="text-[13px] font-medium text-surface leading-tight line-clamp-2 pr-4">{b.title}</span>
                          <span className={`shrink-0 text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded ${
                             b.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400' :
                             b.status === 'DRAFT' ? 'bg-amber-500/10 text-amber-500' :
                             b.status === 'SCHEDULED' ? 'bg-blue-500/10 text-blue-400' :
                             'bg-admin-surface border border-admin-border text-admin-muted'
                          }`}>
                            {b.status}
                          </span>
                       </div>
                         <div className="flex items-center justify-between mt-1">
                           <span className="text-[10px] text-admin-muted">
                             {b.status === 'SCHEDULED' && b.scheduledFor ? `Scheduled: ${new Date(b.scheduledFor).toLocaleDateString()}` : new Date(b.createdAt).toLocaleDateString()}
                             {' • '}{b.author.profile?.fullName || b.author.email}
                           </span>
                           
                           <div className="flex gap-2">
                             <button 
                               onClick={() => handleEdit(b)}
                               className="w-6 h-6 rounded bg-admin-surface hover:bg-white/5 flex items-center justify-center text-admin-muted hover:text-surface transition-colors opacity-0 group-hover:opacity-100"
                              >
                               <FileEdit className="w-3 h-3" />
                             </button>
                             <button 
                               onClick={() => handleDelete(b.id)}
                               className="w-6 h-6 rounded bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                              >
                               <Trash2 className="w-3 h-3" />
                             </button>
                           </div>
                         </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

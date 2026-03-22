"use client";

import { useState } from 'react';
import { Users, Mail, Loader2, Link2, Copy, CheckCircle2, TrendingUp, Inbox, CircleDot } from 'lucide-react';
import { toast } from 'sonner';

export interface UI_Instructor {
  id: string;
  name: string;
  email: string;
  role: string;
  cohort: string | null;
  workload: {
    pending: number;
    inReview: number;
    passed: number;
  };
}

export default function InstructorsClient({ faculty }: { faculty: UI_Instructor[] }) {
  const [email, setEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [emailed, setEmailed] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsInviting(true);
    setEmailed(false);

    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to invite instructor');

      toast.success(data.message.includes('resent') ? 'Invite Resent!' : 'Instructor invited!', {
        description: data.message
      });
      setEmailed(true);
      setEmail('');
      
      // Reset emailed state after a few seconds
      setTimeout(() => setEmailed(false), 5000);
    } catch (error: any) {
      toast.error('Invitation failed', { description: error.message });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="p-8 md:p-14 max-w-[1400px] mx-auto text-surface space-y-8 pb-32">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-[22px] font-semibold tracking-[-0.02em] text-surface">Faculty Management</h1>
        <p className="text-gray-300 text-[13px] leading-relaxed">View instructor workloads, cohort assignments, and invite new faculty.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Faculty Load Balancing */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-muted">Active Instructors & Load Map</h2>
          </div>
          
          <div className="bg-admin-surface rounded-2xl border border-admin-border overflow-hidden">
             {faculty.length === 0 ? (
                <div className="p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 mb-4 rounded-full bg-white/5 flex items-center justify-center border border-admin-border">
                    <Users className="w-5 h-5 text-admin-muted" />
                  </div>
                  <h3 className="text-[14px] font-semibold text-surface mb-1">No Faculty Yet</h3>
                  <p className="text-[13px] text-admin-muted max-w-[300px] leading-relaxed">
                    You haven't invited any instructors. Use the invitation panel to generate a secure magic link for a new faculty member.
                  </p>
                </div>
             ) : (
                <div className="divide-y divide-admin-border">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 p-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-admin-muted bg-ink items-center">
                    <div className="col-span-4">Instructor</div>
                    <div className="col-span-3">Cohort Map</div>
                    <div className="col-span-5 text-right flex justify-end gap-6 pr-4">
                       <span className="flex items-center gap-1.5"><Inbox className="w-3.5 h-3.5" /> Pending Queue</span>
                       <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Reviews Done</span>
                    </div>
                  </div>
                  
                  {/* Table Rows */}
                  {faculty.map(f => (
                    <div key={f.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-white/[0.02] transition-colors items-center">
                       <div className="col-span-4 flex flex-col">
                          <span className="text-[14px] font-medium text-surface">{f.name}</span>
                          <span className="text-[12px] text-admin-muted">{f.email}</span>
                       </div>
                       <div className="col-span-3">
                          {f.cohort ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold">
                              <CircleDot className="w-3 h-3" />
                              {f.cohort}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-admin-border text-admin-muted text-[11px] font-semibold">
                              Campus Wide
                            </span>
                          )}
                       </div>
                       <div className="col-span-5 text-right flex justify-end gap-12 pr-6">
                          <div className="flex flex-col items-center">
                            <span className={`text-[15px] font-bold ${f.workload.pending > 10 ? 'text-rose-400' : 'text-amber-400'}`}>{f.workload.pending}</span>
                            <span className="text-[9px] uppercase tracking-wider text-admin-muted">Draft/Wait</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[15px] font-bold text-emerald-400">{f.workload.passed}</span>
                            <span className="text-[9px] uppercase tracking-wider text-admin-muted">Cleared</span>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
             )}
          </div>
        </div>

        {/* Invite Panel */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-muted">Invite Instructor</h2>
          
          <div className="bg-admin-surface rounded-2xl border border-admin-border p-6 space-y-5">
             <form onSubmit={handleInvite} className="space-y-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-admin-muted">Email Address</label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
                   <input 
                     type="email" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="instructor@example.com"
                     required
                     className="w-full bg-ink border border-admin-border rounded-xl pl-10 pr-4 py-2.5 text-[13px] font-medium text-surface focus:outline-none focus:border-accent/50 transition-colors placeholder:text-[#4A4A5C]"
                   />
                 </div>
               </div>
               
               <button 
                 type="submit"
                 disabled={isInviting || !email}
                 className="w-full py-2.5 rounded-xl bg-[#FFFFFF] text-[#0B0B0C] text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2"
               >
                 {isInviting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Generate Magic Link'}
               </button>
             </form>

             {/* Result Panel */}
             {emailed && (
               <div className="pt-4 border-t border-admin-border space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                   <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-1">
                     <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                   </div>
                   <span className="text-[13px] font-semibold text-emerald-400">Secure Dispatch Successful</span>
                   <p className="text-[11px] text-emerald-400/80 leading-relaxed max-w-[200px]">
                     The faculty member will receive an authenticated Magic Link directly from Supabase to complete their profile setup.
                   </p>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}

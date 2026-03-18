import { Users, Inbox, AlertCircle, Clock, ShieldAlert, Megaphone, CheckCircle, GraduationCap } from 'lucide-react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { getAuthenticatedUser } from '@/lib/auth';
import AdminHeader from './components/AdminHeader';
// Helper to calculate 48 hours ago for SLAs
const getSlaThreshold = () => {
  const d = new Date();
  d.setHours(d.getHours() - 48);
  return d;
};

export default async function AdminCommandCenter() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const slaThreshold = getSlaThreshold();

  // 1. Fetch Today's Priorities
  const overdueReviewsCount = await prisma.submission.count({
    where: {
      status: 'PENDING',
      submittedAt: { lt: slaThreshold }
    }
  });

  const criticalRiskCount = await prisma.interventionLog.count({
    where: { status: 'OPEN' }
  });

  const draftedBroadcastsCount = await prisma.broadcast.count({
    where: { status: 'DRAFT' } // We can count scheduled too
  });

  // 2. Fetch Active Cohorts
  const activeCohorts = await prisma.cohort.findMany({
    where: { status: 'ACTIVE' },
    include: {
      _count: {
        select: { users: true }
      }
    },
    orderBy: { startDate: 'desc' }
  });

  // 3. Fetch Review Operations Stats
  const totalPendingReviews = await prisma.submission.count({
    where: { status: 'PENDING' }
  });

  const aiDraftedAwaitingHuman = await prisma.submission.count({
    where: { status: 'AI_DRAFTED' }
  });

  const revisionsRequested = await prisma.submission.count({
    where: { status: 'REVISIONS_REQUESTED' }
  });

  return (
    <div className="p-8 md:p-14 max-w-[1400px] mx-auto text-surface space-y-10 pb-32">
      
      {/* Header */}
      <AdminHeader fullName={user.profile?.fullName || null} email={user.email} />

      {/* Section 1: Today's Priorities (Inbox) */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-muted">Today's Priorities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Overdue Reviews Alert */}
          <div className={`rounded-2xl p-6 border transition-all ${overdueReviewsCount > 0 ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.05)]' : 'bg-admin-surface border-admin-border'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl ${overdueReviewsCount > 0 ? 'bg-amber-500/20 text-amber-500' : 'bg-white/5 text-admin-muted'}`}>
                <Clock className="w-5 h-5" />
              </div>
              {overdueReviewsCount > 0 && <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>}
            </div>
            <div className="flex flex-col gap-1 z-10">
              <span className={`text-3xl font-bold tracking-tight ${overdueReviewsCount > 0 ? 'text-amber-50' : 'text-surface'}`}>{overdueReviewsCount}</span>
              <span className="text-[11px] font-semibold tracking-wide text-admin-muted">Submissions Past 48h SLA</span>
            </div>
            <div className="mt-5">
              <Link href="/admin/reviews" className={`text-[11px] font-bold uppercase tracking-wider ${overdueReviewsCount > 0 ? 'text-amber-400 hover:text-amber-300' : 'text-admin-muted hover:text-surface'} transition-colors`}>
                Triage Queue →
              </Link>
            </div>
          </div>

          {/* Critical Risk Alert */}
          <div className={`rounded-2xl p-6 border transition-all ${criticalRiskCount > 0 ? 'bg-rose-500/10 border-rose-500/30 shadow-[0_0_30px_rgba(243,24,59,0.05)]' : 'bg-admin-surface border-admin-border'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl ${criticalRiskCount > 0 ? 'bg-rose-500/20 text-rose-500' : 'bg-white/5 text-admin-muted'}`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              {criticalRiskCount > 0 && <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>}
            </div>
            <div className="flex flex-col gap-1 z-10">
              <span className={`text-3xl font-bold tracking-tight ${criticalRiskCount > 0 ? 'text-rose-50' : 'text-surface'}`}>{criticalRiskCount}</span>
              <span className="text-[11px] font-semibold tracking-wide text-admin-muted">Open Student Interventions</span>
            </div>
            <div className="mt-5">
              <Link href="/admin/roster" className={`text-[11px] font-bold uppercase tracking-wider ${criticalRiskCount > 0 ? 'text-rose-400 hover:text-rose-300' : 'text-admin-muted hover:text-surface'} transition-colors`}>
                Resolve Risk Flags →
              </Link>
            </div>
          </div>

          {/* Pending Broadcasts Alert */}
          <div className={`rounded-2xl p-6 border transition-all ${draftedBroadcastsCount > 0 ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-admin-surface border-admin-border'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl ${draftedBroadcastsCount > 0 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-admin-muted'}`}>
                <Megaphone className="w-5 h-5" />
              </div>
            </div>
            <div className="flex flex-col gap-1 z-10">
              <span className={`text-3xl font-bold tracking-tight ${draftedBroadcastsCount > 0 ? 'text-indigo-50' : 'text-surface'}`}>{draftedBroadcastsCount}</span>
              <span className="text-[11px] font-semibold tracking-wide text-admin-muted">Draft Broadcasts Awaiting Approval</span>
            </div>
            <div className="mt-5">
              <Link href="/admin/broadcasts" className={`text-[11px] font-bold uppercase tracking-wider ${draftedBroadcastsCount > 0 ? 'text-indigo-400 hover:text-indigo-300' : 'text-admin-muted hover:text-surface'} transition-colors`}>
                Review Drafts →
              </Link>
            </div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Section 2: Active Cohorts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-muted">Active Cohorts</h2>
          </div>
          
          <div className="bg-admin-surface rounded-2xl border border-admin-border overflow-hidden">
            {activeCohorts.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-ink text-admin-muted text-[10px] uppercase tracking-[0.2em] border-b border-admin-border font-semibold">
                  <tr>
                    <th className="px-6 py-4 font-semibold uppercase tracking-widest">Cohort</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-widest">Students</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-widest">Start Date</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D2D2D]">
                  {activeCohorts.map((cohort) => (
                    <tr key={cohort.id} className="hover:bg-admin-surface-hover transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-surface">{cohort.name}</span>
                          <span className="text-[10px] tracking-[0.2em] uppercase text-accent px-2 py-0.5 rounded bg-white/5 border border-admin-border w-fit">{cohort.id.split('-')[0]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-admin-muted">{cohort._count.users} Enrolled</td>
                      <td className="px-6 py-4 text-[13px] text-admin-muted">
                        {new Date(cohort.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-1.5 text-emerald-400">
                           <CheckCircle className="w-4 h-4" />
                           <span className="font-semibold text-[12px] uppercase">Live</span>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                 <div className="w-12 h-12 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-admin-muted" />
                 </div>
                 <h3 className="text-[14px] font-semibold text-surface mb-1">No Active Cohorts</h3>
                 <p className="text-[13px] text-admin-muted max-w-[250px] leading-relaxed">
                    Student cohorts will appear here once they are enrolled and tracking begins.
                 </p>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Review Operations Pulse */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-muted">Review Pipeline</h2>
          </div>
          
          <div className="bg-admin-surface rounded-2xl border border-admin-border p-7">
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-admin-border">
                         <Inbox className="w-4 h-4 text-admin-muted" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-300">Total Pending</span>
                   </div>
                   <span className="text-lg font-bold text-surface">{totalPendingReviews}</span>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                         <div className="w-4 h-4 text-emerald-400 font-bold text-[10px] flex items-center justify-center">AI</div>
                      </div>
                      <span className="text-[13px] font-medium text-gray-300">AI Drafted (Waiting)</span>
                   </div>
                   <span className="text-lg font-bold text-surface">{aiDraftedAwaitingHuman}</span>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                         <AlertCircle className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-300">Revisions Requested</span>
                   </div>
                   <span className="text-lg font-bold text-surface">{revisionsRequested}</span>
                </div>
             </div>
             
             <button className="w-full mt-8 py-2.5 rounded-xl border border-admin-border bg-ink text-[10px] font-semibold text-admin-muted hover:text-surface hover:bg-admin-surface-hover transition-all uppercase tracking-[0.2em]">
               Open Review Queue
             </button>
          </div>
        </div>

      </div>
    </div>
  )
}

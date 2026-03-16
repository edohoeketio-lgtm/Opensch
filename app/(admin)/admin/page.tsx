import { Users, DollarSign, Inbox, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminCommandCenter() {
  const metrics = [
    { label: "Monthly Recurring Revenue", value: "$12,400", trend: "+14%", icon: DollarSign, color: "text-emerald-400" },
    { label: "Active Students", value: "248", trend: "+12", icon: Users, color: "text-indigo-400" },
    { label: "Pending Reviews", value: "15", trend: "-3", icon: Inbox, color: "text-amber-400" },
    { label: "Avg. Completion Rate", value: "68%", trend: "+2%", icon: TrendingUp, color: "text-blue-400" }
  ];

  const cohorts = [
    { id: "C4", name: "Fullstack Engineering - Cohort 4", progress: 85, students: 42, atRisk: 2, status: "Active" },
    { id: "C5", name: "AI-Native Product Builder - Cohort 5", progress: 30, students: 68, atRisk: 5, status: "Active" },
    { id: "C3", name: "Frontend Architecture - Cohort 3", progress: 100, students: 35, atRisk: 0, status: "Graduated" },
  ];

  const recentActivity = [
    { id: 1, type: "submission", user: "Alexander Chi", action: "submitted Sprint 3 Deliverable", time: "10 mins ago", status: "pending" },
    { id: 2, type: "signup", user: "Sarah Jenkins", action: "enrolled in Cohort 5", time: "45 mins ago", status: "success" },
    { id: 3, type: "review", user: "Maurice E.", action: "approved Capstone for David K.", time: "2 hours ago", status: "success" },
    { id: 4, type: "alert", user: "System", action: "3 students marked as At-Risk in Cohort 4", time: "5 hours ago", status: "warning" },
  ];

  return (
    <div className="p-8 md:p-14 max-w-[1400px] mx-auto text-[#FFFFFF] space-y-8 pb-32">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-[22px] font-semibold tracking-[-0.02em] text-[#FFFFFF]">Command Center</h1>
        <p className="text-[#D1D5DB] text-[13px] leading-relaxed">System overview, academy health, and revenue metrics.</p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-[#1C1C1E] rounded-2xl p-7 xl:p-8 border border-[#2D2D2D] flex flex-col gap-4 relative overflow-hidden group hover:border-[#2D2D2D] hover:shadow-2xl hover:shadow-black/80 transition-all duration-500">
              
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl bg-white/5 ${metric.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-[#888888]">
                  <span className={metric.trend.startsWith('+') ? 'text-emerald-400' : ''}>{metric.trend}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 z-10">
                <span className="text-3xl font-bold tracking-tight text-[#FFFFFF]">{metric.value}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888]">{metric.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cohort Health Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888]">Cohort Health</h2>
            {cohorts.length > 0 && <button className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B08D57] hover:text-[#FFFFFF] transition-colors">View All</button>}
          </div>
          
          <div className="bg-[#1C1C1E] rounded-2xl border border-[#2D2D2D] overflow-hidden">
            {cohorts.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-[#111111] text-[#888888] text-[10px] uppercase tracking-[0.2em] border-b border-[#2D2D2D] font-semibold">
                  <tr>
                    <th className="px-6 py-4 font-semibold uppercase tracking-widest">Cohort</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-widest">Progress</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-widest">Students</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-widest">At Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D2D2D]">
                  {cohorts.map((cohort, idx) => (
                    <tr key={idx} className="hover:bg-[#1D1D21] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-[#FFFFFF]">{cohort.name}</span>
                          <span className="text-[10px] tracking-[0.2em] uppercase text-[#B08D57] px-2 py-0.5 rounded bg-white/5 border border-[#2D2D2D] w-fit">{cohort.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-[#111111] rounded-full overflow-hidden border border-[#2D2D2D]">
                             <div className="h-full bg-[#B08D57] rounded-full" style={{ width: `${cohort.progress}%` }}></div>
                          </div>
                          <span className="text-[13px] font-medium text-[#888888]">{cohort.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#888888]">{cohort.students}</td>
                      <td className="px-6 py-4">
                         {cohort.atRisk > 0 ? (
                           <div className="flex items-center gap-1.5 text-rose-400">
                             <AlertCircle className="w-4 h-4" />
                             <span className="font-semibold">{cohort.atRisk}</span>
                           </div>
                         ) : (
                           <div className="flex items-center gap-1.5 text-emerald-400">
                             <CheckCircle2 className="w-4 h-4" />
                             <span className="font-semibold">0</span>
                           </div>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                 <div className="w-12 h-12 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#888888]" />
                 </div>
                 <h3 className="text-[14px] font-semibold text-[#FFFFFF] mb-1">No Active Cohorts</h3>
                 <p className="text-[13px] text-[#888888] max-w-[250px] leading-relaxed">
                    Student cohorts will appear here once they are enrolled and tracking begins.
                 </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888]">Activity Stream</h2>
          </div>
          
          <div className="bg-[#1C1C1E] rounded-2xl border border-[#2D2D2D] p-7 xl:p-8">
            {recentActivity.length > 0 ? (
              <>
                <div className="space-y-6">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex gap-4 relative">
                      {/* Timeline connecting line */}
                      {idx !== recentActivity.length - 1 && (
                        <div className="absolute top-8 left-[11px] bottom-[-24px] w-px bg-white/5"></div>
                      )}
                      
                      {/* Activity Icon */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        activity.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        activity.status === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {activity.type === 'submission' ? <Inbox className="w-3 h-3" /> :
                         activity.type === 'signup' ? <Users className="w-3 h-3" /> :
                         activity.type === 'review' ? <CheckCircle2 className="w-3 h-3" /> :
                         <AlertCircle className="w-3 h-3" />}
                      </div>
                      
                      {/* Activity Content */}
                      <div className="flex flex-col gap-1 pb-1">
                        <p className="text-[13px] text-[#D1D5DB]">
                          <span className="text-[#FFFFFF] font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#888888]">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-6 py-2.5 rounded-xl border border-[#2D2D2D] bg-[#111111] text-[10px] font-semibold text-[#888888] hover:text-[#FFFFFF] hover:bg-[#1D1D21] transition-all uppercase tracking-[0.2em]">
                  View All Activity
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                 <div className="w-10 h-10 mb-3 rounded-full bg-white/5 flex items-center justify-center border border-[#2D2D2D]">
                    <TrendingUp className="w-4 h-4 text-[#888888]" />
                 </div>
                 <h3 className="text-[13px] font-medium text-[#FFFFFF] mb-1">Quiet Operations</h3>
                 <p className="text-[13px] text-[#888888] max-w-[200px] leading-relaxed">
                    No recent activity to report across your active cohorts.
                 </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

import { getAuthenticatedUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  Users, 
  Bot, 
  Activity,
  MessageSquare
} from "lucide-react";

export const metadata = {
  title: "Analytics | OpenSch Admin",
};

export default async function AnalyticsDashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  // 1. Gather Global Engagement Metrics
  const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
  
  // Define "active" as logged in within the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const activeStudents = await prisma.user.count({
    where: { 
      role: 'STUDENT',
      lastLogin: { gte: sevenDaysAgo }
    }
  });

  const dormantStudents = totalStudents - activeStudents;
  const activePercentage = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;

  // 2. Gather AI Support Heatmap (Recent Topics)
  // Instead of complex natural language grouping, we get the last 50 questions
  // and do a very basic frequency count of significant words (length > 4)
  const recentCopilotMessages = await prisma.copilotMessage.findMany({
    where: { role: 'user' },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: { content: true }
  });

  const wordFrequency: Record<string, number> = {};
  
  recentCopilotMessages.forEach((msg: { content: string }) => {
    // Strip punctuation, split by space, basic filtering
    const words = msg.content
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(' ')
      .filter(w => w.length > 4 && !['about', 'would', 'could', 'should', 'there', 'their'].includes(w));
      
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
  });

  // Sort and take top 10 heatmap topics
  const topTopics = Object.entries(wordFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([topic, count]) => ({ topic, count }));


  return (
    <div className="p-8 md:p-14 max-w-[1400px] mx-auto text-surface space-y-10 pb-32">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-[22px] font-semibold tracking-[-0.02em] text-surface">Analytics & Intelligence</h1>
        <p className="text-gray-300 text-[13px] leading-relaxed">
          Monitor student engagement and OpenSch Copilot utilization metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-admin-border bg-admin-surface text-surface shadow-2xl p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-[11px] uppercase tracking-wider font-semibold text-admin-muted">Total Students</h3>
            <Users className="h-4 w-4 text-admin-muted" />
          </div>
          <div className="text-3xl font-bold tracking-tight">{totalStudents}</div>
          <p className="text-xs text-admin-muted mt-2">Platform-wide</p>
        </div>
        
        <div className="rounded-2xl border border-admin-border bg-admin-surface text-surface shadow-2xl p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-[11px] uppercase tracking-wider font-semibold text-admin-muted">Active (7 Days)</h3>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold tracking-tight">{activeStudents}</div>
          <p className="text-xs text-admin-muted mt-2">{activePercentage}% of total roster</p>
        </div>

        <div className="rounded-2xl border border-admin-border bg-admin-surface text-surface shadow-2xl p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-[11px] uppercase tracking-wider font-semibold text-admin-muted">Dormant Accounts</h3>
            <Users className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-3xl font-bold tracking-tight">{dormantStudents}</div>
          <p className="text-xs text-admin-muted mt-2">Needs intervention</p>
        </div>

        <div className="rounded-2xl border border-admin-border bg-admin-surface text-surface shadow-2xl p-6 flex flex-col justify-end bg-gradient-to-br from-[#E2B71A]/10 to-transparent">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-[11px] uppercase tracking-wider font-semibold text-[#E2B71A]/80">Copilot Queries</h3>
            <Bot className="h-4 w-4 text-[#E2B71A]" />
          </div>
          <div className="text-3xl font-bold tracking-tight">{recentCopilotMessages.length}</div>
          <p className="text-xs text-[#E2B71A]/60 mt-2">Recent sample size</p>
        </div>
      </div>

      {/* AI Heatmap and Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-admin-border bg-admin-surface text-surface shadow-2xl overflow-hidden">
          <div className="p-6 pb-4 border-b border-admin-border">
            <h3 className="font-semibold tracking-tight text-surface">AI Support Heatmap</h3>
            <p className="text-[13px] text-admin-muted mt-1">
              Most frequently used keywords in Copilot queries across the platform.
            </p>
          </div>
          <div className="p-0">
            {topTopics.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-ink border-b border-admin-border">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-[10px] uppercase tracking-widest text-admin-muted">Topic Keyword</th>
                    <th className="px-6 py-4 font-semibold text-[10px] uppercase tracking-widest text-admin-muted text-right">Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  {topTopics.map((item, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium flex items-center gap-2 text-surface">
                        <MessageSquare className="w-3 h-3 text-admin-muted" />
                        {item.topic}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold bg-[#E2B71A]/10 text-[#E2B71A]">
                          {item.count} queries
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-admin-muted text-sm border-dashed border-t-0 border-admin-border">
                No Copilot queries recorded yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-admin-border bg-admin-surface text-surface shadow-2xl">
          <div className="p-6 flex flex-col h-full justify-center text-center">
            <div className="w-12 h-12 bg-white/5 border border-admin-border rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-5 h-5 text-admin-muted" />
            </div>
            <h3 className="text-lg font-medium mb-1 text-surface">Video Telemetry Descoped</h3>
            <p className="text-[13px] text-admin-muted max-w-[250px] mx-auto leading-relaxed">
              Per executive decision, high-frequency video drop-off tracking was removed to maintain minimal viable complexity.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

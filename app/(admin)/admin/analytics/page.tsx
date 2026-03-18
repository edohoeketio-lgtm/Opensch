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
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics & Intelligence</h1>
        <p className="text-muted-foreground mt-1">
          Monitor student engagement and OpenSch Copilot utilization metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Students</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{totalStudents}</div>
          <p className="text-xs text-muted-foreground mt-1">Platform-wide</p>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active (7 Days)</h3>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold">{activeStudents}</div>
          <p className="text-xs text-muted-foreground mt-1">{activePercentage}% of total roster</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Dormant Accounts</h3>
            <Users className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold">{dormantStudents}</div>
          <p className="text-xs text-muted-foreground mt-1">Needs intervention</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-end bg-gradient-to-br from-[#E2B71A]/10 to-transparent">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Copilot Queries</h3>
            <Bot className="h-4 w-4 text-[#E2B71A]" />
          </div>
          <div className="text-2xl font-bold">{recentCopilotMessages.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Recent sample size</p>
        </div>
      </div>

      {/* AI Heatmap and Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 pb-2 border-b">
            <h3 className="font-semibold tracking-tight">AI Support Heatmap</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Most frequently used keywords in Copilot queries across the platform.
            </p>
          </div>
          <div className="p-0">
            {topTopics.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-3 font-medium text-muted-foreground">Topic Keyword</th>
                    <th className="px-6 py-3 font-medium text-muted-foreground text-right">Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {topTopics.map((item, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium flex items-center gap-2">
                        <MessageSquare className="w-3 h-3 text-muted-foreground" />
                        {item.topic}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-[#E2B71A]/10 text-[#E2B71A]">
                          {item.count} queries
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No Copilot queries recorded yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-col h-full justify-center text-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">Video Telemetry Descoped</h3>
            <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
              Per executive decision, high-frequency video drop-off tracking was removed to maintain minimal viable complexity.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

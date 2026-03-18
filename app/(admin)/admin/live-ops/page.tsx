import { getAdminEvents } from "@/app/actions/events";
import LiveOpsClient from "./LiveOpsClient";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Live Ops HQ | OpenSch Admin",
};

export default async function LiveOpsPage() {
  const events = await getAdminEvents();
  const cohorts = await prisma.cohort.findMany({
    orderBy: { startDate: 'desc' }
  });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-black text-white/90">
      <div className="px-6 py-5 border-b border-white/10 shrink-0">
        <h1 className="text-xl font-medium text-white tracking-tight">Live Ops HQ</h1>
        <p className="text-sm text-white/50 mt-1">Schedule and manage Cohort syncs, Demo Days, and Office Hours.</p>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <LiveOpsClient 
          initialEvents={events} 
          cohorts={cohorts}
        />
      </div>
    </div>
  );
}

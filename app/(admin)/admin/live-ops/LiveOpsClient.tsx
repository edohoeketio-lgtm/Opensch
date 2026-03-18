"use client";

import { useState } from "react";
import { format } from "date-fns";
import { EventType } from "@prisma/client";

const EVENT_TYPES: EventType[] = [
  'OFFICE_HOURS', 'LIVE_LECTURE', 'DEMO_DAY', 'SOCIAL'
];
import { createEvent } from "@/app/actions/events";
import { useRouter } from "next/navigation";

interface LiveOpsClientProps {
  initialEvents: any[];
  cohorts: any[];
}

export default function LiveOpsClient({ initialEvents, cohorts }: LiveOpsClientProps) {
  const [events, setEvents] = useState(initialEvents);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [link, setLink] = useState("");
  const [type, setType] = useState<EventType>(EventType.OFFICE_HOURS);
  const [cohortId, setCohortId] = useState("");

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Parse the local date string "YYYY-MM-DD" and "HH:MM"
      const startObj = new Date(`${date}T${startTime}:00`);
      const endObj = new Date(startObj.getTime() + parseInt(durationMinutes) * 60000);

      const newEvent = await createEvent({
        title,
        description,
        startTime: startObj,
        endTime: endObj,
        type,
        link,
        cohortId: cohortId === "global" ? undefined : cohortId,
      });

      // Quick optimistic append (lacks the full relation payload inherently, so we trigger refresh)
      setEvents(prev => [newEvent, ...prev].sort((a,b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()));
      setIsCreating(false);
      setTitle("");
      setLink("");
      router.refresh();
      
    } catch (err: any) {
      alert(`Failed to create event: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeBadge = (eventType: string) => {
    switch (eventType) {
      case 'OFFICE_HOURS': return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case 'DEMO_DAY': return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case 'LIVE_LECTURE': return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case 'SOCIAL': return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-white/10 text-white/70";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex items-center justify-between bg-white/[0.02] border border-white/10 rounded-xl p-4">
         <div>
            <h2 className="text-white font-medium">Scheduled Events</h2>
            <p className="text-sm text-white/50">There are {events.length} active global and local events.</p>
         </div>
         <button 
           onClick={() => setIsCreating(true)}
           className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
         >
           + Schedule Event
         </button>
      </div>

      {/* Creation Modal */}
      {isCreating && (
        <div className="bg-black/40 border border-white/20 rounded-xl p-6 mb-8 relative">
           <button onClick={() => setIsCreating(false)} className="absolute top-4 right-4 text-white/40 hover:text-white">✕</button>
           <h3 className="text-lg font-medium text-white mb-4">Launch New Sync</h3>
           
           <form onSubmit={handleCreateEvent} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                 <label className="block text-xs text-white/50 mb-1">Event Title</label>
                 <input required value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white" placeholder="e.g. Frontend Architecture Office Hours" />
              </div>
              
              <div>
                 <label className="block text-xs text-white/50 mb-1">Date</label>
                 <input required value={date} onChange={(e) => setDate(e.target.value)} type="date" className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white" />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                 <div>
                   <label className="block text-xs text-white/50 mb-1">Time (Local)</label>
                   <input required value={startTime} onChange={(e) => setStartTime(e.target.value)} type="time" className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white" />
                 </div>
                 <div>
                   <label className="block text-xs text-white/50 mb-1">Duration (Min)</label>
                   <select value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white">
                      <option value="30">30 min</option>
                      <option value="60">60 min</option>
                      <option value="90">90 min</option>
                      <option value="120">120 min</option>
                   </select>
                 </div>
              </div>

              <div>
                 <label className="block text-xs text-white/50 mb-1">Event Type</label>
                 <select value={type} onChange={(e) => setType(e.target.value as EventType)} className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white">
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                 </select>
              </div>

              <div>
                 <label className="block text-xs text-white/50 mb-1">Target Audience (Cohort)</label>
                 <select required value={cohortId} onChange={(e) => setCohortId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white">
                    <option value="" disabled>Select Visibility...</option>
                    <option value="global">Global (All Students)</option>
                    {cohorts.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
              </div>

              <div className="col-span-2">
                 <label className="block text-xs text-white/50 mb-1">Video Meeting Link (Zoom/Meet/Riverside)</label>
                 <input value={link} onChange={(e) => setLink(e.target.value)} type="url" className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white placeholder:text-white/20" placeholder="https://zoom.us/j/..." />
              </div>

              <div className="col-span-2 pt-2">
                 <button disabled={isLoading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50">
                   {isLoading ? 'Booting Server Instance...' : 'Schedule & Notify Students'}
                 </button>
              </div>
           </form>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid gap-4">
         {events.map((ev: any) => {
            const isPast = new Date(ev.endTime) < new Date();
            const attendingCount = ev.rsvps?.filter((r: any) => r.status === 'ATTENDING').length || 0;

            return (
              <div key={ev.id} className={`bg-white/[0.03] border border-white/10 rounded-xl p-5 ${isPast ? 'opacity-60' : ''}`}>
                 <div className="flex items-start justify-between">
                    <div>
                       <div className="flex items-center gap-3 mb-1">
                         <h3 className="text-base font-medium text-white {isPast ? 'line-through decoration-white/30' : ''}">{ev.title}</h3>
                         <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getTypeBadge(ev.type)}`}>
                           {ev.type.replace('_', ' ')}
                         </span>
                         {isPast && <span className="text-xs text-red-400 border border-red-500/20 bg-red-500/10 px-2 rounded">Concluded</span>}
                       </div>
                       
                       <div className="flex items-center gap-4 text-sm text-white/60 mt-2">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span> 
                            {format(new Date(ev.startTime), "MMM d, h:mm a")} - {format(new Date(ev.endTime), "h:mm a")}
                          </span>
                          <span>•</span>
                          <span className="text-white/40">Visible to: {ev.cohort?.name || 'Global'}</span>
                          <span>•</span>
                          <span className="text-white/40 font-mono text-xs">{attendingCount} RSVPs</span>
                       </div>
                    </div>
                    
                    {ev.link && !isPast && (
                      <a href={ev.link} target="_blank" rel="noreferrer" className="shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Launch Call →
                      </a>
                    )}
                 </div>
              </div>
            )
         })}
         
         {events.length === 0 && !isCreating && (
           <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
              <p className="text-white/40">No scheduled events active in the pipeline.</p>
           </div>
         )}
      </div>

    </div>
  );
}

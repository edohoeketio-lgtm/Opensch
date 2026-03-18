"use client";

import { useState } from "react";
import { format } from "date-fns";
import { updateRSVP } from "@/app/actions/events";
type RSVPStatus = 'ATTENDING' | 'DECLINED';

interface CalendarClientProps {
  initialEvents: any[];
}

export default function CalendarClient({ initialEvents }: CalendarClientProps) {
  const [events, setEvents] = useState(initialEvents);

  const handleRSVP = async (eventId: string, status: RSVPStatus) => {
    try {
      await updateRSVP(eventId, status);
      // Optimistically overwrite status inside array mapping (hack for fast UI)
      setEvents(prev => prev.map(ev => {
        if (ev.id === eventId) {
          // A robust setup modifies the `ev.rsvps` array natively here 
          // but for optimistic rendering, state gets rehydrated anyway
          return { ...ev, _optimisticStatus: status };
        }
        return ev;
      }));
    } catch (err: any) {
      alert("Failed to RSVP. Try again.");
    }
  };

  const getRSVPButtonClass = (isActive: boolean, type: 'ATTENDING' | 'DECLINED') => {
    if (type === 'ATTENDING') {
      return isActive ? "bg-white text-black" : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10";
    }
    return isActive ? "bg-red-500/20 text-red-500 border border-red-500/50" : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10";
  };

  return (
    <div className="space-y-6">
      
      {/* Schedule Feed */}
      <div className="space-y-4">
         {events.map((ev: any) => {
            const isPast = new Date(ev.endTime) < new Date();
            const startTime = new Date(ev.startTime);
            
            // Assume single user array logic constraints applied server-side (only auth'd user rsvps pushed in)
            const rsvpRecord = ev.rsvps?.[0];
            const currentStatus = ev._optimisticStatus || rsvpRecord?.status || null;

            return (
              <div key={ev.id} className={`bg-white/[0.02] border border-white/10 rounded-2xl p-6 ${isPast ? 'opacity-40 grayscale' : ''}`}>
                 <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    
                    {/* Event Info */}
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                         <span className="text-xs uppercase font-bold tracking-wider text-white/40 border border-white/10 rounded px-2 py-0.5">
                           {ev.type.replace('_', ' ')}
                         </span>
                         {ev.cohortId === null && <span className="text-xs text-blue-400 bg-blue-500/10 px-2 rounded">Global</span>}
                       </div>
                       
                       <h3 className="text-xl font-medium text-white/90">{ev.title}</h3>
                       {ev.description && <p className="text-sm text-white/60 mt-1">{ev.description}</p>}
                       
                       <div className="flex items-center gap-4 text-sm text-white/50 mt-4">
                          <span className="flex items-center gap-1.5 font-medium text-white/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></span> 
                            {format(startTime, "EEEE, MMMM do · h:mm a")} 
                          </span>
                          <span>•</span>
                          <span>Hosted by {ev.host?.profile?.firstName || 'Faculty'}</span>
                       </div>
                    </div>
                    
                    {/* Action Panel */}
                    {!isPast && (
                      <div className="shrink-0 flex flex-col gap-3 min-w-[200px]">
                         <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between gap-2">
                            <button 
                              onClick={() => handleRSVP(ev.id, 'ATTENDING')}
                              className={`flex-1 text-center py-2 px-3 rounded-lg text-sm font-medium transition-colors ${getRSVPButtonClass(currentStatus === 'ATTENDING', 'ATTENDING')}`}
                            >
                              Attending
                            </button>
                            <button 
                              onClick={() => handleRSVP(ev.id, 'DECLINED')}
                              className={`flex-1 text-center py-2 px-3 rounded-lg text-sm font-medium transition-colors ${getRSVPButtonClass(currentStatus === 'DECLINED', 'DECLINED')}`}
                            >
                              Decline
                            </button>
                         </div>
                         
                         {ev.link && (
                           <a href={ev.link} target="_blank" rel="noreferrer" className="w-full text-center flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors">
                             <VideoIcon />
                             Join Video Call
                           </a>
                         )}
                      </div>
                    )}
                    
                 </div>
              </div>
            )
         })}
         
         {events.length === 0 && (
           <div className="text-center py-16">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon />
              </div>
              <h3 className="text-white font-medium">No Upcoming Events</h3>
              <p className="text-white/40 text-sm mt-1">Enjoy the quiet time. Keep progressing through the modules.</p>
           </div>
         )}
      </div>

    </div>
  );
}

function VideoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  );
}

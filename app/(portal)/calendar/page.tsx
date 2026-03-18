import { getStudentEvents } from "@/app/actions/events";
import CalendarClient from "./CalendarClient";

export const metadata = {
  title: "Calendar | OpenSch Portal",
};

export default async function CalendarPage() {
  const events = await getStudentEvents();

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      <div className="px-6 py-5 border-b border-white/5 shrink-0 flex items-center justify-between">
        <div>
           <h1 className="text-xl font-medium text-white/90">Curriculum Calendar</h1>
           <p className="text-sm text-white/40 mt-1">Global lectures, office hours, and Cohort syncs.</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <CalendarClient initialEvents={events} />
        </div>
      </div>
    </div>
  );
}

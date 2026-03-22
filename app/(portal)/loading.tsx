import { Loader2 } from 'lucide-react';

export default function PortalLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-transparent min-h-screen">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Custom Loader */}
        <div className="relative w-16 h-16 flex items-center justify-center">
           <div className="absolute inset-0 border-2 border-[#2D2D2D] rounded-full"></div>
           <div className="absolute inset-0 border-2 border-t-[#B08D57] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
           <span className="font-bold text-[#0B0B0C] text-sm bg-[#F5F2EB] w-8 h-8 flex items-center justify-center rounded-lg relative z-10 shadow-[0_0_15px_rgba(176,141,87,0.3)]">O</span>
        </div>
        
        <div className="text-center">
           <h3 className="text-[#FFFFFF] font-medium text-sm tracking-wide">Loading Section...</h3>
           <p className="text-[#888888] text-xs mt-1 font-medium">Fetching the latest data for you.</p>
        </div>
      </div>
    </div>
  );
}

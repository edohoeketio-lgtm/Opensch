import Link from 'next/link';
import { Lock, CreditCard, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative min-h-[calc(100vh-4rem)]">
      
      {/* Abstract Background Element (Subtle Gold Tint for Paywall) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
          <div className="w-[800px] h-[800px] bg-[#B08D57]/5 rounded-full blur-[150px] opacity-30 transform -translate-y-1/4"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl text-center">
        
        <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-[#B08D57]/10 border border-[#B08D57]/20 mb-8 shadow-2xl shadow-[#B08D57]/10">
           <Lock className="w-8 h-8 text-[#B08D57]" />
        </div>

        <h1 className="text-3xl md:text-5xl font-semibold tracking-[-0.04em] text-[#FFFFFF] mb-4">
          Access Restricted
        </h1>
        
        <p className="text-[#888888] text-sm md:text-lg max-w-[500px] leading-relaxed mb-10 tracking-tight">
          The module or resource you are attempting to view requires an active enrollment or higher tier subscription.
        </p>

        <div className="bg-[#1C1C1E] border border-[#2D2D2D] rounded-2xl p-6 mb-10 w-full max-w-md shadow-2xl shadow-black/50 text-left relative overflow-hidden group">
            {/* Hover flare */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#FFFFFF]" />
                </div>
                <div>
                    <h3 className="text-[#FFFFFF] font-medium text-sm">Upgrade Required</h3>
                    <p className="text-[#888888] text-xs">Unlock full curriculum access</p>
                </div>
            </div>
            
            <Link 
              href="/pricing"
              className="w-full py-3 rounded-xl bg-[#FFFFFF] text-[#0B0B0C] font-semibold text-sm hover:bg-[#F5F2EB] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 mt-2"
            >
              View Enrollment Options
            </Link>
        </div>

        <Link 
          href="/dashboard"
          className="px-6 py-3 rounded-xl bg-transparent text-[#888888] font-medium text-sm hover:text-[#FFFFFF] transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </Link>
        
      </div>
    </div>
  );
}

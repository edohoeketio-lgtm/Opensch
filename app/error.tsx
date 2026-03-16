"use client"; // Error boundaries must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // We could log this to an error reporting service like Sentry here
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col font-sans selection:bg-white/30">
      
      {/* Ghost Header */}
      <header className="h-16 border-b border-[#2D2D2D] flex items-center px-8 shrink-0 bg-[#111111]/80 backdrop-blur-md absolute top-0 w-full z-10 w-full">
         <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-[#F5F2EB] flex items-center justify-center shrink-0">
                <span className="font-bold text-[#0B0B0C] text-sm">OS</span>
             </div>
             <span className="font-bold tracking-tight text-xl text-[#FFFFFF] leading-none">
                OpenSch
             </span>
         </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative">
        
        {/* Abstract Background Element (Subtle Red Tint for Error state) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
            <div className="w-[800px] h-[800px] bg-rose-500/5 rounded-full blur-[150px] opacity-30 transform -translate-y-1/4"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-2xl text-center">
          
          <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 mb-8 shadow-2xl shadow-rose-900/20">
             <AlertTriangle className="w-8 h-8 text-rose-400" />
          </div>

          <h1 className="text-3xl md:text-5xl font-semibold tracking-[-0.04em] text-[#FFFFFF] mb-4">
            System Fault Detected
          </h1>
          
          <div className="bg-[#1C1C1E] border border-[#2D2D2D] rounded-xl p-4 mb-8 w-full max-w-lg shadow-2xl shadow-black/50 text-left overflow-hidden">
             <p className="text-[12px] font-mono text-[#888888] mb-1 uppercase tracking-widest">Diagnostic Output</p>
             <p className="text-sm font-medium text-rose-400 truncate break-words">
                {error.message || "An unexpected runtime error occurred during execution."}
             </p>
             {error.digest && (
                <p className="text-[11px] text-[#525252] mt-2 font-mono">Digest ID: {error.digest}</p>
             )}
          </div>

          <p className="text-[#888888] text-sm md:text-base max-w-[500px] leading-relaxed mb-10 tracking-tight">
            Our systems have logged the fault and engineering has been notified. You can attempt to manually reset the boundary.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => reset()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FFFFFF] text-[#0B0B0C] font-semibold text-sm hover:bg-[#F5F2EB] hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-white/5 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Force Reset
            </button>
            <Link 
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1C1C1E] text-[#FFFFFF] border border-[#2D2D2D] font-medium text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 text-[#888888]" />
              Return Home
            </Link>
          </div>
          
        </div>
      </main>

    </div>
  );
}

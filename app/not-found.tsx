"use client";

import Link from 'next/link';
import { ChevronRight, Home, Compass } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

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
        
        {/* Abstract Background Element (Subtle) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
            <div className="w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] opacity-20 transform -translate-y-1/4"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-2xl text-center">
          
          <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 border border-[#2D2D2D] mb-8 shadow-2xl shadow-black/50">
             <Compass className="w-8 h-8 text-[#B08D57]" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-semibold tracking-[-0.04em] text-[#FFFFFF] mb-6">
            404
            <span className="block text-2xl md:text-4xl tracking-[-0.02em] text-[#888888] mt-2 font-medium">Page Not Found</span>
          </h1>
          
          <p className="text-[#888888] text-base md:text-lg max-w-[500px] leading-relaxed mb-10 tracking-tight">
            The page you are looking for has been moved, deleted, or possibly never existed to begin with.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => router.back()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FFFFFF] text-[#0B0B0C] font-semibold text-sm hover:bg-[#F5F2EB] hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-white/5 flex items-center justify-center gap-2"
            >
              Return Previous
            </button>
            <Link 
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1C1C1E] text-[#FFFFFF] border border-[#2D2D2D] font-medium text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 text-[#888888]" />
              Go to Homepage
            </Link>
          </div>
          
        </div>
      </main>

    </div>
  );
}

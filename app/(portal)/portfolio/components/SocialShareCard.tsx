import React from 'react';
import { Layers } from 'lucide-react';

interface SocialShareCardProps {
  studentName: string;
  track: string;
  featuredBuild: {
    title: string;
    description: string;
    stack: string[];
    previewImg: string;
    type: string;
  };
}

export const SocialShareCard = React.forwardRef<HTMLDivElement, SocialShareCardProps>(({ studentName, track, featuredBuild }, ref) => {
  return (
    <div 
      ref={ref}
      className="w-[1200px] h-[630px] bg-[#111111] flex flex-col justify-between p-16 font-sans overflow-hidden border border-[#2D2D2D] relative"
      style={{
        // Ensure explicit dimensions for html-to-image capture
        width: '1200px',
        height: '630px',
      }}
    >
      {/* Background Subtle Glows (optional but adds depth) */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      {/* Top Section: Student Identity */}
      <div className="relative z-10 flex items-start justify-between w-full">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#1C1C1E] border border-[#2D2D2D] rounded-sm text-[12px] font-bold tracking-widest uppercase text-[#FFFFFF]">
                {featuredBuild.type}
              </span>
           </div>
           <h1 className="text-[64px] font-semibold text-[#FFFFFF] tracking-tight leading-none mb-3">
             {studentName}
           </h1>
           <p className="text-[24px] text-[#9CA3AF] font-medium tracking-tight">
             {track}
           </p>
        </div>
        
        {/* OpenSch Brand Anchor */}
        <div className="flex items-center gap-4 bg-[#1C1C1E] border border-[#2D2D2D] p-4 rounded-xl">
           <div className="w-12 h-12 rounded bg-[#1C1C1E] border border-[#2D2D2D] flex items-center justify-center">
             <Layers className="w-6 h-6 text-[#FFFFFF]" />
           </div>
           <div className="flex flex-col">
             <span className="text-[14px] font-bold text-[#FFFFFF] tracking-tight leading-tight">Built at OpenSch</span>
             <span className="text-[13px] text-[#888888] font-medium tracking-tight">opensch.com</span>
           </div>
        </div>
      </div>

      {/* Main Content Area: The Artifact */}
      <div className="relative z-10 mt-12 flex gap-12 h-[320px]">
        {/* Left: Project Details */}
        <div className="flex-1 flex flex-col justify-center">
           <h2 className="text-[48px] font-semibold text-[#FFFFFF] tracking-tight leading-tight mb-6">
             {featuredBuild.title}
           </h2>
           <p className="text-[20px] text-[#D1D5DB] leading-relaxed mb-10 max-w-lg line-clamp-3">
             {featuredBuild.description}
           </p>
           
           <div className="flex flex-wrap gap-3">
             {featuredBuild.stack.slice(0,4).map((tech) => (
               <span 
                 key={tech} 
                 className="px-4 py-2 bg-[#1C1C1E] border border-[#2D2D2D] text-[14px] font-bold tracking-widest uppercase text-[#9CA3AF] rounded-sm whitespace-nowrap"
               >
                 {tech}
               </span>
             ))}
           </div>
        </div>

        {/* Right: The Screenshot/Preview (Framed) */}
        <div className="w-[500px] h-full rounded-2xl border border-[#2D2D2D] bg-[#1C1C1E] p-2 flex-shrink-0 shadow-2xl shadow-black">
           <div className="w-full h-full rounded-xl overflow-hidden bg-[#1C1C1E] border border-[#2D2D2D] relative">
              <img 
                src={featuredBuild.previewImg} 
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                alt="Project Preview"
              />
              {/* Subtle overlay to blend into the dark theme if the image is too bright */}
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
           </div>
        </div>
      </div>

      {/* Subtle bottom border to ground it */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
});

SocialShareCard.displayName = 'SocialShareCard';

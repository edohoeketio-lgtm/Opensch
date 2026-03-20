"use client";

import { useState } from 'react';
import { Play, FileText, ArrowRight, X } from 'lucide-react';
import { ResourceType } from '@prisma/client';

interface Resource {
  id: string;
  title: string;
  description: string | null;
  url: string;
  type: ResourceType;
  createdAt: Date;
}

export default function ResourcesClient({ initialResources }: { initialResources: Resource[] }) {
  const [activeFilter, setActiveFilter] = useState<'ALL' | ResourceType>('ALL');
  const [playingVideo, setPlayingVideo] = useState<Resource | null>(null);

  const filteredResources = activeFilter === 'ALL' 
    ? initialResources 
    : initialResources.filter(r => r.type === activeFilter);

  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|user\/|watch\?v=|embed\/|watch\?v%3D)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.type === 'VIDEO') {
       const vidId = getYoutubeVideoId(resource.url);
       if (vidId) {
         setPlayingVideo(resource);
         return;
       }
    }
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex items-center gap-3">
        {['ALL', 'VIDEO', 'ARTICLE'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter as any)}
            className={`px-4 py-2 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase transition-all ${
              activeFilter === filter 
                ? 'bg-[#B08D57] text-[#0B0B0C]' 
                : 'bg-[#1C1C1E] text-[#888888] hover:text-[#FFFFFF] border border-[#2D2D2D]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div 
            key={resource.id}
            onClick={() => handleResourceClick(resource)}
            className="group block p-6 rounded-2xl bg-[#131313] border border-[#2D2D2D] hover:border-[#444] transition-all duration-300 cursor-pointer h-full flex flex-col relative overflow-hidden"
          >
            {/* Subtle Gradient Glow Map */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#B08D57]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Type Badge */}
            <div className="flex items-center gap-2 mb-4">
               {resource.type === 'VIDEO' ? (
                 <Play className="w-3.5 h-3.5 text-[#B08D57]" fill="currentColor" />
               ) : (
                 <FileText className="w-3.5 h-3.5 text-[#B08D57]" />
               )}
               <span className="text-[10px] font-bold tracking-widest text-[#B08D57] uppercase">
                 {resource.type}
               </span>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-[#FFFFFF] mb-3 leading-tight group-hover:text-[#F5F2EB] transition-colors">{resource.title}</h3>
            {resource.description && (
               <p className="text-[#888888] text-sm leading-relaxed mb-8 flex-1">
                 {resource.description}
               </p>
            )}

            {/* CTA */}
            <div className="mt-auto pt-4 flex items-center gap-2 text-[#B08D57] font-bold text-xs uppercase tracking-wider">
               <span>{resource.type === 'VIDEO' ? 'Watch' : 'Read'}</span>
               <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
         <div className="py-20 text-center border border-[#2D2D2D] rounded-2xl bg-[#111111]">
            <p className="text-[#888888] text-sm tracking-wide">No resources found for this filter.</p>
         </div>
      )}

      {/* Cinematic Video Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <button 
            onClick={() => setPlayingVideo(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md"
          >
             <X className="w-6 h-6" />
          </button>
          
          <div className="w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 animate-in zoom-in-95 duration-300">
             <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${getYoutubeVideoId(playingVideo.url)}?autoplay=1&rel=0`} 
                title={playingVideo.title} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
             />
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from 'next/link';
import { ArrowUpRight, Github, ExternalLink, Calendar, Code2, Copy, Download, BookOpen, Layers, Loader2, Share, Star, Upload } from 'lucide-react';
import { useRef, useState, useCallback } from 'react';
import { domToPng } from 'modern-screenshot';
import Cropper from 'react-easy-crop';
import { SocialShareCard } from './components/SocialShareCard';

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { width: number; height: number; x: number; y: number }
): Promise<string> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) return ""

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file!))
    }, 'image/jpeg', 0.95)
  })
}

export default function PortfolioPage() {
  const portfolioRef = useRef<HTMLDivElement>(null);
  const socialCardRef = useRef<HTMLDivElement>(null);
  const [isExportingSocial, setIsExportingSocial] = useState(false);
  const [isExportingPortfolio, setIsExportingPortfolio] = useState(false);
  
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ width: number; height: number; x: number; y: number } | null>(null);

  const student = {
    name: "Maurice Edohoeket",
    track: "AI-Native Product Builder Track",
    cohort: "Cohort 4",
  };

  const [projects, setProjects] = useState([
    {
      id: "p1",
      title: "Academic OS Authentication Flow",
      description: "Designed and engineered the complete authentication microservice utilizing Supabase, Edge Functions, and JWT session handling. Integrated zero-trust Row Level Security (RLS) across public profiles and secured API routes for instructor-grade permissions.",
      stack: ["PostgreSQL", "Next.js 14", "Supabase Auth", "OAuth 2.0"],
      type: "Sprint 3 Capstone",
      status: "Live Production",
      previewImg: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      link: "#"
    },
    {
      id: "p2",
      title: "Real-time Presence System",
      description: "Implemented a low-latency socket layer for tracking active students and instructors across the campus portal.",
      stack: ["Socket.io", "Redis", "Node.js"],
      type: "Sprint 2 Deliverable",
      status: "Passed",
      previewImg: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop",
      link: "#"
    },
    {
      id: "p3",
      title: "Stripe Billing Infrastructure",
      description: "Built the subscription tier upgrade paths using Stripe Checkout and webhooks for real-time entitlement updates.",
      stack: ["Stripe API", "Webhooks", "Zustand"],
      type: "Sprint 4 Capstone",
      status: "Live Production",
      previewImg: "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop",
      link: "#"
    }
  ]);

  const [featuredBuildId, setFeaturedBuildId] = useState("p1");

  const featuredBuild = projects.find(p => p.id === featuredBuildId) || projects[0];
  const supportingBuilds = projects.filter(p => p.id !== featuredBuildId);

  const transcript = [
    { id: 1, title: "The Modern Stack", grade: "A+", date: "Sept 15", domains: "Next.js 14, React Server Components, TailwindCSS" },
    { id: 2, title: "Relational Data Models", grade: "A", date: "Oct 01", domains: "PostgreSQL, Prisma ORM, Supabase" },
    { id: 3, title: "Auth & Security", grade: "A-", date: "Oct 15", domains: "JWT, OAuth, Edge Functions, RLS" },
    { id: 4, title: "AI Integration & Deployment", grade: "IP", date: "In Progress", domains: "LLM Orchestration, Edge Deployment, Observability" },
  ];

  const commendations = [
    { category: "Architectural Clarity", detail: "Demonstrated exceptional ability to structure complex Next.js 14 app routing." },
    { category: "Peer Review Leader", detail: "Consistently provided high-signal technical feedback to peers during code reviews." },
    { category: "Production Standard", detail: "Shipped the OAuth sprint exactly to specification with zero edge-case regressions." },
  ];

  const exportSocialCard = async () => {
    if (!socialCardRef.current) return;
    
    try {
      setIsExportingSocial(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const node = socialCardRef.current;
      const scale = 2; // 2400x1260 - perfect super retina resolution
      
      const dataUrl = await domToPng(node, {
        backgroundColor: '#0B0B0C',
        scale: scale,
        width: 1200,
        height: 630,
        fetch: {
          requestInit: {
            mode: 'cors',
          }
        },
        style: {
          opacity: '1',
          visibility: 'visible',
          transform: 'none',
        }
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${student.name.replace(/\s+/g, '_')}_Achievement.png`;
      link.click();
    } catch (error) {
      console.error('Failed to export achievement:', error);
    } finally {
      setIsExportingSocial(false);
    }
  };

  const exportPortfolio = async () => {
    if (!portfolioRef.current) return;
    
    try {
      setIsExportingPortfolio(true);
      // Let the UI settle just in case
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const node = portfolioRef.current;
      const scale = 2;
      
      const dataUrl = await domToPng(node, {
        backgroundColor: '#0B0B0C',
        scale: scale,
        filter: (n: Node) => {
          // Exclude the action buttons container and interactive elements
          if (n instanceof HTMLElement && (n.id === 'portfolio-actions' || n.id === 'image-upload-label' || n.id === 'feature-controls')) {
            return false;
          }
          return true;
        }
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${student.name.replace(/\s+/g, '_')}_Portfolio.png`;
      link.click();
    } catch (error) {
      console.error('Failed to export record:', error);
    } finally {
      setIsExportingPortfolio(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-transparent font-sans selection:bg-[#F5F2EB] selection:text-white">
      
      {/* Export Wrapper to give the recorded image massive beautiful padding */}
      <div ref={portfolioRef} className="w-full bg-[#111111] py-16 lg:py-24 px-6 lg:px-16">
        
        {/* Container constraints matching Home logic */}
        <div className="max-w-[1200px] mx-auto w-full relative">
        
        {/* 1. Record Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 lg:mb-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#FFFFFF] tracking-tight mb-4 leading-tight">
              {student.name}
            </h1>
            <div className="text-lg text-[#9CA3AF] font-medium tracking-tight flex items-center gap-3">
              <span>{student.track}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>{student.cohort}</span>
            </div>
          </div>

          <div id="portfolio-actions" className="flex items-center gap-4">
             <button 
                onClick={exportSocialCard}
                disabled={isExportingSocial}
                className="h-12 px-6 rounded bg-[#1C1C1E] border border-[#2D2D2D] text-sm font-semibold text-[#FFFFFF] flex items-center gap-2 hover:bg-white/5 transition-colors disabled:opacity-50"
             >
                {isExportingSocial ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share className="w-4 h-4" />}
                {isExportingSocial ? "Generating..." : "Flex Your Wins"}
             </button>
             <button 
                onClick={exportPortfolio}
                disabled={isExportingPortfolio}
                className="h-12 px-6 rounded bg-[#F5F2EB] text-[#050505] text-sm font-bold flex items-center gap-2 hover:bg-white transition-colors disabled:opacity-50"
             >
                {isExportingPortfolio ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {isExportingPortfolio ? "Exporting..." : "Export Record"}
             </button>
          </div>
        </header>

        {/* 2. Featured Project - Centerpiece */}
        <section className="mb-24 lg:mb-32">
          <div className="w-full rounded bg-[#0A0A0C] border border-[#2D2D2D] overflow-hidden flex flex-col lg:flex-row">
            
            {/* Project Context (Left) */}
            <div className="lg:w-[45%] p-10 lg:p-14 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#2D2D2D]">
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="px-2.5 py-1 text-[11px] font-bold tracking-widest uppercase bg-white/5 text-[#FFFFFF] rounded-sm">
                  {featuredBuild.status}
                </span>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#888888]">
                  {featuredBuild.type}
                </span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-semibold text-[#FFFFFF] tracking-tight mb-6 leading-tight">
                {featuredBuild.title}
              </h2>
              
              <p className="text-[#D1D5DB] leading-relaxed mb-10 text-[15px]">
                {featuredBuild.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-12">
                {featuredBuild.stack.map(tech => (
                  <span key={tech} className="px-3 py-1.5 bg-[#1C1C1E] border border-[#2D2D2D] text-[11px] font-bold tracking-widest uppercase text-[#9CA3AF] rounded-sm whitespace-nowrap flex-shrink-0">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button className="w-full sm:w-auto h-12 px-6 rounded bg-[#F5F2EB] text-[#050505] font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-white transition-colors">
                   View Live <ArrowUpRight className="w-4 h-4" />
                </button>
                <button className="w-full sm:w-auto h-12 px-6 rounded bg-transparent border border-[#2D2D2D] text-[#FFFFFF] font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
                   <Github className="w-4 h-4" /> View Source
                </button>
                <Link href="/course/3/module/301/lesson/3011" className="w-full sm:w-auto h-12 px-6 rounded bg-transparent text-[#888888] font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:text-[#FFFFFF] transition-colors">
                   Sprint Context
                </Link>
              </div>
            </div>

            {/* Project Screenshot (Right) - Crisp & Real */}
            <div className="lg:w-[55%] bg-[#1C1C1E] flex items-center justify-center p-8 lg:p-12 relative group">
               <div className="w-full aspect-[4/3] rounded shadow-2xl overflow-hidden border border-[#2D2D2D] bg-[#1C1C1E]">
                  <img 
                    src={featuredBuild.previewImg} 
                    alt="Product Screenshot"
                    className="w-full h-full object-cover"
                  />
               </div>
               
               <input 
                 type="file" 
                 accept="image/*" 
                 className="hidden" 
                 id="image-upload" 
                 onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                     const url = URL.createObjectURL(file);
                     setCropImageSrc(url);
                     // Reset crop properties
                     setCrop({ x: 0, y: 0 });
                     setZoom(1);
                   }
                   // reset input to allow selecting same file again
                   if (e.target) e.target.value = '';
                 }} 
               />
               <label 
                 id="image-upload-label"
                 htmlFor="image-upload"
                 className="absolute bottom-12 right-12 px-4 py-2.5 bg-[#050505]/80 backdrop-blur-md border border-white/20 rounded shadow-2xl text-[11px] font-bold tracking-widest uppercase text-white cursor-pointer hover:bg-black transition-colors z-10 opacity-0 group-hover:opacity-100 flex items-center gap-2"
               >
                 <Upload size={14} /> Custom Screenshot
               </label>
            </div>
          </div>
        </section>

        {/* 3. Supporting Builds */}
        <section className="mb-24 lg:mb-32">
          <div className="flex items-center justify-between mb-10 border-b border-[#2D2D2D] pb-4">
             <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#FFFFFF]">Additional Builds</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportingBuilds.map((build, idx) => (
              <div key={idx} className="rounded-2xl bg-[#1C1C1E] border border-[#2D2D2D] p-8 hover:bg-[#1D1D21] hover:border-[#2D2D2D] transition-all duration-500 cursor-pointer group flex flex-col justify-between hover:-translate-y-0.5 shadow-xl shadow-black/50">
                 <div className="flex-1">
                   <div className="flex items-center justify-between mb-3">
                     <h4 className="text-xl font-bold text-[#FFFFFF] tracking-tight">
                       {build.title}
                     </h4>
                     <button 
                       id="feature-controls"
                       onClick={(e) => { e.preventDefault(); setFeaturedBuildId(build.id); }}
                       className="group-hover:flex hidden items-center gap-1.5 px-3 py-1 bg-[#2D2D2D] rounded-sm border border-[#3D3D3D] text-[10px] uppercase tracking-widest font-bold text-[#E5E7EB] hover:bg-white/10"
                     >
                       <Star className="w-3 h-3 text-[#B08D57]" /> Feature This
                     </button>
                   </div>
                   <p className="text-[14px] text-[#D1D5DB] leading-relaxed mb-8">
                     {build.description}
                   </p>
                 </div>
                 <div className="flex items-end justify-between">
                   <div className="flex flex-wrap gap-2">
                     {build.stack.map(tech => (
                       <span key={tech} className="text-[11px] font-bold tracking-widest uppercase text-[#888888] whitespace-nowrap flex-shrink-0">
                         {tech}
                       </span>
                     ))}
                   </div>
                   <a href={build.link} className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-[#2D2D2D] flex items-center justify-center text-[#FFFFFF] group-hover:bg-[#F5F2EB] group-hover:text-[#050505] transition-colors">
                     <ArrowUpRight className="w-4 h-4" />
                   </a>
                 </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* 4. Institutional Transcript */}
          <section className="lg:col-span-7">
            <div className="flex items-center justify-between mb-10 border-b border-[#2D2D2D] pb-4">
               <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#FFFFFF]">Institutional Transcript</h3>
            </div>
            <div className="flex flex-col space-y-2">
              {transcript.map((item) => (
                <div key={item.id} className="group py-6 flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#2D2D2D] last:border-0 hover:bg-white/[0.02] -mx-4 px-4 rounded transition-colors">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[15px] font-bold text-[#FFFFFF] tracking-tight">
                        {item.title}
                      </span>
                      <span className="text-[11px] font-bold tracking-widest uppercase text-[#888888]">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-[13px] font-medium text-[#9CA3AF]">
                      {item.domains}
                    </p>
                  </div>
                  <div>
                    {item.grade === "IP" ? (
                      <span className="px-3 py-1.5 rounded-sm bg-[#1C1C1E] text-[11px] font-bold tracking-widest uppercase text-[#9CA3AF]">
                        In Progress
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-sm bg-white/5 text-[11px] font-bold tracking-widest uppercase text-[#FFFFFF] border border-[#2D2D2D]">
                        {item.grade}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Distinctions */}
          <section className="lg:col-span-5">
            <div className="flex items-center justify-between mb-10 border-b border-[#2D2D2D] pb-4">
               <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#FFFFFF]">Distinctions</h3>
            </div>
            <div className="flex flex-col space-y-6">
              {commendations.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <h4 className="text-[14px] font-bold text-[#FFFFFF] tracking-tight">
                    {item.category}
                  </h4>
                  <p className="text-[14px] text-[#D1D5DB] leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>

        </div>
      </div>
      
      {/* Hidden Social Media Card Engine */}
      <div className="fixed top-[-9999px] left-[-9999px]">
         <SocialShareCard 
           ref={socialCardRef} 
           studentName={student.name}
           track={student.track}
           featuredBuild={featuredBuild}
         />
      </div>

      {/* Interactive Crop Modal */}
      {cropImageSrc && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 lg:p-12">
          <div className="bg-[#111111] border border-[#2D2D2D] rounded-xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 lg:p-6 border-b border-[#2D2D2D] flex items-center justify-between">
               <h3 className="text-xl font-bold text-[#FFFFFF] tracking-tight">Adjust Screenshot</h3>
               <button onClick={() => setCropImageSrc(null)} className="text-[#888888] hover:text-[#FFFFFF] transition-colors text-sm font-bold uppercase tracking-widest">Cancel</button>
            </div>
            <div className="relative w-full h-[50vh] lg:h-[60vh] bg-[#000000]">
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                showGrid={true}
              />
            </div>
            <div className="p-5 lg:p-6 bg-[#111111] flex flex-col sm:flex-row items-center justify-between gap-6">
               <div className="w-full sm:flex-1 max-w-sm flex items-center gap-4 text-sm font-bold text-[#888888] uppercase tracking-widest">
                  <span>Zoom</span>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-label="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 accent-[#B08D57] h-1"
                  />
               </div>
               <button
                  onClick={async () => {
                    if (cropImageSrc && croppedAreaPixels) {
                      try {
                        const croppedImgUrl = await getCroppedImg(cropImageSrc, croppedAreaPixels);
                        setProjects(projects.map(p => 
                          p.id === featuredBuildId ? {...p, previewImg: croppedImgUrl} : p
                        ));
                        setCropImageSrc(null);
                      } catch (e) {
                        console.error('Failed to crop image', e);
                      }
                    }
                  }}
                  className="w-full sm:w-auto h-12 px-8 rounded bg-[#B08D57] text-[#050505] font-bold text-sm hover:bg-[#C2A578] transition-colors tracking-wide"
               >
                  Save Aspect Ratio
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

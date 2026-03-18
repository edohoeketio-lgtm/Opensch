"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, Image as ImageIcon, Link2, FileText, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function FacultyOnboarding() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    githubHandle: '',
    linkedinUrl: '',
    avatarUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app we'd POST to a profile creation endpoint to save the bio/links.
    // For now, simulate network delay then redirect to the Admin Command Center.
    setTimeout(() => {
      toast.success('Welcome to the Faculty!', { description: 'Your instructor profile has been established.' });
      router.push('/admin');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center relative overflow-hidden py-20 px-4">
      
      {/* Background Ornaments */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#B08D57]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 flex flex-col items-center">
        
        {/* Branding Header */}
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl backdrop-blur-xl">
           <Sparkles className="w-8 h-8 text-[#B08D57]" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#FFFFFF] text-center mb-2">
          Welcome to the Faculty
        </h1>
        <p className="text-[#888888] text-[14px] text-center max-w-sm mb-10 leading-relaxed">
          Your instructor account has been verified. Polish your professional profile to step into the command center.
        </p>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="w-full bg-[#111111]/80 backdrop-blur-xl border border-[#2D2D2D] rounded-3xl p-8 md:p-10 shadow-2xl">
          
          <div className="space-y-6">
            
            {/* Biography */}
            <div className="space-y-2">
               <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#888888] flex items-center gap-2">
                 <FileText className="w-3 h-3" />
                 Professional Biography
               </label>
               <textarea 
                 value={formData.bio}
                 onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                 required
                 rows={4}
                 placeholder="I am a Senior Software Engineer specializing in scalable edge architectures..."
                 className="w-full bg-[#1C1C1E] border border-[#2D2D2D] rounded-xl px-4 py-3 text-[13px] font-medium text-[#FFFFFF] focus:outline-none focus:border-[#B08D57]/50 transition-colors resize-none placeholder:text-[#4A4A5C]"
               />
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#888888] flex items-center gap-2">
                   <Link2 className="w-3 h-3" />
                   LinkedIn URL
                 </label>
                 <input 
                   type="url"
                   value={formData.linkedinUrl}
                   onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                   placeholder="https://linkedin.com/in/..."
                   className="w-full bg-[#1C1C1E] border border-[#2D2D2D] rounded-xl px-4 py-3 text-[13px] font-medium text-[#FFFFFF] focus:outline-none focus:border-[#B08D57]/50 transition-colors placeholder:text-[#4A4A5C]"
                 />
               </div>
               
               <div className="space-y-2">
                 <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#888888] flex items-center gap-2">
                   <ImageIcon className="w-3 h-3" />
                   Avatar Image URL
                 </label>
                 <input 
                   type="url"
                   value={formData.avatarUrl}
                   onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                   placeholder="https://example.com/avatar.jpg"
                   className="w-full bg-[#1C1C1E] border border-[#2D2D2D] rounded-xl px-4 py-3 text-[13px] font-medium text-[#FFFFFF] focus:outline-none focus:border-[#B08D57]/50 transition-colors placeholder:text-[#4A4A5C]"
                 />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#888888] flex items-center gap-2">
                 <Link2 className="w-3 h-3" />
                 GitHub Handle
               </label>
               <input 
                 type="text"
                 value={formData.githubHandle}
                 onChange={(e) => setFormData({ ...formData, githubHandle: e.target.value })}
                 placeholder="@handle"
                 className="w-full bg-[#1C1C1E] border border-[#2D2D2D] rounded-xl px-4 py-3 text-[13px] font-medium text-[#FFFFFF] focus:outline-none focus:border-[#B08D57]/50 transition-colors placeholder:text-[#4A4A5C]"
               />
            </div>

          </div>

          <div className="mt-10">
             <button 
               type="submit"
               disabled={isSubmitting || !formData.bio}
               className="w-full py-3.5 rounded-xl bg-[#FFFFFF] text-[#0B0B0C] text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 group"
             >
               {isSubmitting ? (
                 <>
                   <Loader2 className="w-4 h-4 animate-spin text-[#0B0B0C]" />
                   Establishing Profile...
                 </>
               ) : (
                 <>
                   Enter Command Center
                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </>
               )}
             </button>
             <p className="text-center mt-4 text-[11px] text-[#4A4A5C] font-mono">
                SECURE HANDSHAKE // INVITE-ONLY ACCESS
             </p>
          </div>

        </form>
      </div>
    </div>
  )
}

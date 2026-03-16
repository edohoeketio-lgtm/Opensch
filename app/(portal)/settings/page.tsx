"use client";

import { Save, Camera, Github, Linkedin } from 'lucide-react';
import { useState } from 'react';

export default function ProfileSettingsPage() {
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#FFFFFF] tracking-tight mb-6">Public Profile</h2>
        
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8">
          <div 
            className="w-24 h-24 rounded-full bg-[#1A1A1E] border border-[#2D2D2D] relative overflow-hidden group cursor-pointer"
            onMouseEnter={() => setIsHoveringAvatar(true)}
            onMouseLeave={() => setIsHoveringAvatar(false)}
          >
            <img 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Maurice&backgroundColor=transparent" 
              alt="Avatar" 
              className={`w-full h-full object-cover grayscale transition-opacity duration-300 ${isHoveringAvatar ? 'opacity-30' : 'opacity-90'}`} 
            />
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHoveringAvatar ? 'opacity-100' : 'opacity-0'}`}>
              <Camera className="w-8 h-8 text-[#FFFFFF]" />
            </div>
          </div>
          <div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-xl bg-[#F5F2EB] hover:bg-white text-[#050505] text-xs font-bold uppercase tracking-[0.1em] transition-colors shadow-[0_0_15px_rgba(245,242,235,0.15)]">
                Upload New Image
              </button>
              <button className="px-4 py-2 rounded-xl bg-[#1C1C1E] hover:bg-white/5 border border-[#2D2D2D] text-[#9CA3AF] text-xs font-bold uppercase tracking-[0.1em] transition-colors">
                Remove
              </button>
            </div>
            <p className="text-xs text-[#888888] mt-3">Recommended size: 400x400px. Max 2MB.</p>
          </div>
        </div>

        {/* Profile Form */}
        <form className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">First Name</label>
              <input 
                type="text" 
                defaultValue="Maurice"
                className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#504C46] outline-none transition-all focus:bg-[#1A1A1E]" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">Last Name</label>
              <input 
                type="text" 
                defaultValue="E."
                className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#504C46] outline-none transition-all focus:bg-[#1A1A1E]" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">Current Title / Headline</label>
            <input 
              type="text" 
              defaultValue="Software Engineer"
              placeholder="e.g. Fullstack Developer at TechCorp"
              className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#504C46] outline-none transition-all focus:bg-[#1A1A1E]" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">Bio</label>
            <textarea 
              rows={4}
              placeholder="Tell the community a little bit about yourself..."
              className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#504C46] outline-none transition-all focus:bg-[#1A1A1E] resize-none" 
            />
          </div>

          <div className="pt-6 border-t border-[#2D2D2D] space-y-6">
            <h3 className="text-md font-bold text-[#FFFFFF] tracking-tight">Social Links</h3>
            
            <div className="space-y-4">
              <div className="relative flex items-center">
                <Github className="w-5 h-5 text-[#888888] absolute left-4" />
                <input 
                  type="url" 
                  placeholder="https://github.com/username"
                  className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl pl-12 pr-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#504C46] outline-none transition-all focus:bg-[#1A1A1E]" 
                />
              </div>
              <div className="relative flex items-center">
                <Linkedin className="w-5 h-5 text-[#888888] absolute left-4" />
                <input 
                  type="url" 
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl pl-12 pr-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#504C46] outline-none transition-all focus:bg-[#1A1A1E]" 
                />
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button type="button" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F5F2EB] hover:bg-white text-[#050505] text-xs font-bold uppercase tracking-[0.1em] transition-all shadow-[0_0_15px_rgba(245,242,235,0.15)]">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

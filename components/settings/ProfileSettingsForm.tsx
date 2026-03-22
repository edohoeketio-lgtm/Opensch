"use client";

import { Save, Camera, Github, Linkedin, Loader2, LogOut } from 'lucide-react';
import { useState, useTransition, useRef } from 'react';
import { updateProfile } from '@/app/actions/settings';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AvatarCropModal } from './AvatarCropModal';
import { toast } from 'sonner';

export function ProfileSettingsForm({ profile }: { profile: any }) {
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(profile?.avatarUrl || "https://api.dicebear.com/7.x/notionists/svg?seed=OpenSch&backgroundColor=transparent");
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCropImageSrc(URL.createObjectURL(file));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    setAvatarFile(croppedFile);
    setAvatarPreview(URL.createObjectURL(croppedFile));
    setCropImageSrc(null);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("https://api.dicebear.com/7.x/notionists/svg?seed=OpenSch&backgroundColor=transparent");
  };

  async function actionHandler(formData: FormData) {
    startTransition(async () => {
      let finalAvatarUrl = profile?.avatarUrl;

      if (avatarFile) {
        const supabase = createClient();
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `avatar-${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { error } = await supabase.storage.from('avatars').upload(fileName, avatarFile, { upsert: true });
        
        if (error) {
          toast.error("Failed to upload image: " + error.message);
          return;
        }

        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        finalAvatarUrl = publicUrlData.publicUrl;
      } else if (avatarPreview?.includes("dicebear")) {
        // If they removed their avatar, we save the dummy url
        finalAvatarUrl = "https://api.dicebear.com/7.x/notionists/svg?seed=OpenSch&backgroundColor=transparent";
      }

      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const combinedFullName = [firstName, lastName].filter(Boolean).join(' ');

      const data = {
        fullName: combinedFullName,
        username: formData.get("username") as string,
        experienceLevel: formData.get("experienceLevel") as string,
        timezone: formData.get("timezone") as string,
        bio: formData.get("bio") as string,
        githubHandle: formData.get("githubHandle") as string,
        linkedinUrl: formData.get("linkedinUrl") as string,
        avatarUrl: finalAvatarUrl
      };

      try {
        await updateProfile(data);
        window.dispatchEvent(new Event('profileUpdated'));
        toast.success("Profile updated successfully!");
        router.refresh();
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-[#FFFFFF] tracking-tight mb-6">Personal Profile</h2>
        
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
          <div 
            className="w-24 h-24 rounded-full bg-[#1A1A1E] border border-[#2D2D2D] relative overflow-hidden group cursor-pointer"
            onMouseEnter={() => setIsHoveringAvatar(true)}
            onMouseLeave={() => setIsHoveringAvatar(false)}
            onClick={() => fileInputRef.current?.click()}
          >
            <img 
              src={avatarPreview || profile?.avatarUrl} 
              alt="Avatar" 
              className={`w-full h-full object-cover transition-opacity duration-300 ${isHoveringAvatar ? 'opacity-30' : 'opacity-90'}`} 
            />
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHoveringAvatar ? 'opacity-100' : 'opacity-0'}`}>
              <Camera className="w-8 h-8 text-[#FFFFFF]" />
            </div>
          </div>
          <div>
            <div className="flex gap-3">
              <button onClick={() => fileInputRef.current?.click()} type="button" className="px-4 py-2 rounded-xl bg-[#F5F2EB] hover:bg-white text-[#050505] text-xs font-bold uppercase tracking-[0.1em] transition-colors shadow-[0_0_15px_rgba(245,242,235,0.15)]">
                Upload New Image
              </button>
              <button onClick={handleRemoveAvatar} type="button" className="px-4 py-2 rounded-xl bg-[#1C1C1E] hover:bg-white/5 border border-[#2D2D2D] text-[#9CA3AF] text-xs font-bold uppercase tracking-[0.1em] transition-colors">
                Remove
              </button>
            </div>
            <p className="text-xs text-[#888888] mt-3">Recommended size: 400x400px. Max 2MB.</p>
          </div>
        </div>

        {/* Profile Form */}
        <form action={actionHandler} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">First Name</label>
              <input 
                type="text" 
                name="firstName"
                defaultValue={profile?.fullName?.split(' ')[0] || ""}
                placeholder="First Name"
                className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#504C46] outline-none transition-all focus:bg-[#1A1A1E]" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">Last Name</label>
              <input 
                type="text" 
                name="lastName"
                defaultValue={profile?.fullName?.split(' ').slice(1).join(' ') || ""}
                placeholder="Last Name"
                className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#504C46] outline-none transition-all focus:bg-[#1A1A1E]" 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-[#504C46] font-medium">@</span>
                <input 
                  type="text" 
                  name="username"
                  defaultValue={profile?.username || ""}
                  placeholder="username"
                  className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl pl-9 pr-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#504C46] outline-none transition-all focus:bg-[#1A1A1E]" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">Primary Timezone</label>
              <select name="timezone" defaultValue={profile?.timezone || "UTC+0 (GMT)"} className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-[#FFFFFF] outline-none transition-all focus:bg-[#1A1A1E] appearance-none cursor-pointer">
                <option value="UTC-8 (PST)">UTC-8 (PST)</option>
                <option value="UTC-5 (EST)">UTC-5 (EST)</option>
                <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                <option value="UTC+1 (CET)">UTC+1 (CET)</option>
                <option value="UTC+8 (CST)">UTC+8 (CST)</option>
                <option value="UTC+9 (JST)">UTC+9 (JST)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">Experience Level</label>
              <select name="experienceLevel" defaultValue={profile?.experienceLevel || "Beginner"} className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-[#FFFFFF] outline-none transition-all focus:bg-[#1A1A1E] appearance-none cursor-pointer">
                <option value="Beginner">Beginner (Foundational)</option>
                <option value="Intermediate">Intermediate (Experienced)</option>
                <option value="Advanced">Advanced (Architect)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">Bio</label>
            <textarea 
              name="bio"
              rows={4}
              defaultValue={profile?.bio || ""}
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
                  name="githubHandle"
                  defaultValue={profile?.githubHandle || ""}
                  placeholder="https://github.com/username"
                  className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl pl-12 pr-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#504C46] outline-none transition-all focus:bg-[#1A1A1E]" 
                />
              </div>
              <div className="relative flex items-center">
                <Linkedin className="w-5 h-5 text-[#888888] absolute left-4" />
                <input 
                  type="url" 
                  name="linkedinUrl"
                  defaultValue={profile?.linkedinUrl || ""}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl pl-12 pr-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#504C46] outline-none transition-all focus:bg-[#1A1A1E]" 
                />
              </div>
            </div>
          </div>

          <div className="pt-8 flex items-center gap-4">
            <button disabled={isPending} type="submit" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F5F2EB] hover:bg-white text-[#050505] text-xs font-bold uppercase tracking-[0.1em] transition-all shadow-[0_0_15px_rgba(245,242,235,0.15)] disabled:opacity-50">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isPending ? "Saving..." : "Save Changes"}
            </button>

            <button 
              type="button" 
              disabled={isSigningOut}
              onClick={() => {
                setIsSigningOut(true);
                import('@/app/actions/auth').then(m => m.logOut());
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold uppercase tracking-[0.1em] transition-all border border-red-500/20 hover:border-red-500/30 disabled:opacity-50"
            >
              {isSigningOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              {isSigningOut ? "Signing Out..." : "Sign Out"}
            </button>

            {isPending && <span className="text-sm font-medium text-admin-muted animate-pulse ml-2">Syncing...</span>}
          </div>
        </form>
      </div>
    </div>

    {cropImageSrc && (
      <AvatarCropModal 
         imageSrc={cropImageSrc}
         onClose={() => setCropImageSrc(null)}
         onCropComplete={handleCropComplete}
      />
    )}
    </>
  );
}

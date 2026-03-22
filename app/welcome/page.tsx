"use client";

import { useEffect, useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Camera, ArrowRight, CheckCircle2 } from 'lucide-react';
import { updateProfile } from '@/app/actions/settings';
import { AvatarCropModal } from '@/components/settings/AvatarCropModal';

export default function WelcomePage() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'ready' | 'error'>('verifying');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  // Profile fields state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [timezone, setTimezone] = useState('UTC+0 (GMT)');
  const [bio, setBio] = useState('');

  // Avatar states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("https://api.dicebear.com/7.x/notionists/svg?seed=OpenSch&backgroundColor=transparent");
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated (including parsing implicit URL hashes automatically via the browser client)
    const supabase = createClient();
    
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setErrorMsg(error.message);
        setStatus('error');
        return;
      }
      if (data.session) {
        setStatus('ready');
      } else {
        // Fallback: Check if there's a hash mismatch (though createClient usually handles it)
        const hash = window.location.hash;
        if (hash && hash.includes('error=')) {
          setErrorMsg('The invite link is invalid or expired.');
          setStatus('error');
        } else if (!hash.includes('access_token')) {
          setErrorMsg('No active session found. Please request a new invite link.');
          setStatus('error');
        } else {
          // Manually intercept and parse the implicit flow tokens
          const hashStr = hash.substring(1);
          const params = new URLSearchParams(hashStr);
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          
          if (access_token && refresh_token) {
            supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
              if (error) {
                setErrorMsg(error.message);
                setStatus('error');
              } else {
                setStatus('ready');
                // Clean the URL bar so the tokens don't sit there
                window.history.replaceState(null, '', window.location.pathname);
              }
            });
          } else {
             setErrorMsg('Invalid token format from invite link.');
             setStatus('error');
          }
        }
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setStatus('ready');
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCropImageSrc(URL.createObjectURL(e.target.files[0]));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    setAvatarFile(croppedFile);
    setAvatarPreview(URL.createObjectURL(croppedFile));
    setCropImageSrc(null);
  };

  async function handleOnboardingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !bio) {
      alert("Please fill out all required fields.");
      return;
    }

    startTransition(async () => {
      let finalAvatarUrl = avatarPreview;
      
      const supabase = createClient();
      
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `avatar-${Date.now()}-${Math.random()}.${fileExt}`;
        const { error } = await supabase.storage.from('avatars').upload(fileName, avatarFile, { upsert: true });
        
        if (error) {
          alert("Failed to upload image: " + error.message);
          return;
        }
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        finalAvatarUrl = publicUrlData.publicUrl;
      }

      try {
        await updateProfile({
          fullName: `${firstName.trim()} ${lastName.trim()}`,
          timezone,
          bio,
          avatarUrl: finalAvatarUrl,
          experienceLevel: "Intermediate", // Defaulting for simple onboarding
        });
        
        // Push straight to the dashboard
        router.push('/dashboard');
        router.refresh();
      } catch (err: any) {
        alert(err.message || 'Failed to update profile.');
      }
    });
  }

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-[#FFFFFF] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-[#FFFFFF] tracking-tight">Verifying Invitation...</h2>
        <p className="text-[#888888] mt-2">Securely setting up your session</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#FFFFFF] tracking-tight mb-2">Invite Expired</h2>
        <p className="text-[#888888] mb-8">{errorMsg}</p>
        <button 
          onClick={() => router.push('/login')}
          className="px-6 py-3 rounded-xl bg-[#F5F2EB] hover:bg-white text-[#050505] font-bold uppercase tracking-[0.1em] transition-all"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-2xl bg-[#0A0A0A] border border-[#2D2D2D] rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Decorative ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-[#F5F2EB]/5 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#FFFFFF] tracking-tight mb-3">Welcome to the Faculty</h1>
            <p className="text-[#9CA3AF]">Let's complete your profile before you enter the command center.</p>
          </div>

          <form onSubmit={handleOnboardingSubmit} className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <div 
                className="w-28 h-28 rounded-full bg-[#1A1A1E] border-2 border-[#2D2D2D] relative overflow-hidden group cursor-pointer transition-transform hover:scale-105"
                onMouseEnter={() => setIsHoveringAvatar(true)}
                onMouseLeave={() => setIsHoveringAvatar(false)}
                onClick={() => fileInputRef.current?.click()}
              >
                <img 
                  src={avatarPreview} 
                  alt="Avatar" 
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isHoveringAvatar ? 'opacity-30' : 'opacity-100'}`} 
                />
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHoveringAvatar ? 'opacity-100' : 'opacity-0'}`}>
                  <Camera className="w-8 h-8 text-[#FFFFFF]" />
                </div>
              </div>
              <p className="text-xs uppercase tracking-[0.1em] font-bold text-[#888888]">Upload Profile Photo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">First Name *</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Jane"
                  required
                  className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#504C46] outline-none transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">Last Name *</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#504C46] outline-none transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">Primary Timezone</label>
              <select 
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-[#FFFFFF] outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="UTC-8 (PST)">UTC-8 (PST)</option>
                <option value="UTC-5 (EST)">UTC-5 (EST)</option>
                <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                <option value="UTC+1 (CET)">UTC+1 (CET)</option>
                <option value="UTC+8 (CST)">UTC+8 (CST)</option>
                <option value="UTC+9 (JST)">UTC+9 (JST)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">Short Bio *</label>
              <textarea 
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="What is your background and expertise?"
                required
                className="w-full bg-[#1C1C1E] border border-transparent focus:border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-[#FFFFFF] placeholder:text-[#504C46] outline-none transition-all resize-none" 
              />
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#F5F2EB] hover:bg-white text-[#050505] text-sm font-bold uppercase tracking-[0.1em] transition-all shadow-[0_0_20px_rgba(245,242,235,0.15)] disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving Profile...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
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
    </div>
  );
}

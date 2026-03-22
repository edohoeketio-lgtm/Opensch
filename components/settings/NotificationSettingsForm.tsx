"use client";

import { Save, AppWindow, Mail, Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { updateNotificationPreferences } from '@/app/actions/settings';
import { toast } from 'sonner';

export function NotificationSettingsForm({ profile }: { profile: any }) {
  const [isPending, startTransition] = useTransition();

  const prefs = profile?.notificationSettings || {};

  async function actionHandler(formData: FormData) {
    startTransition(async () => {
      const preferences: Record<string, boolean> = {};
      
      // We manually construct our allowed keys to true/false based on checkbox presence
      ['email_product', 'email_cohort', 'email_replies', 'email_mentions',
       'app_replies', 'app_mentions', 'app_graded'].forEach(key => {
         preferences[key] = formData.get(key) === "on";
      });

      try {
        await updateNotificationPreferences(preferences);
        toast.success("Notification preferences updated!");
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-bold text-[#FFFFFF] tracking-tight mb-6">Notification Preferences</h2>
        
        <form action={actionHandler} className="space-y-8">
          <div>
             <div className="flex items-center gap-3 mb-4 pb-2 border-b border-[#2D2D2D]">
                <Mail className="w-5 h-5 text-[#B08D57]" />
                <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-[0.1em]">Email Notifications</h3>
             </div>
             
             <div className="space-y-4 max-w-2xl">
                <label className="flex items-start justify-between cursor-pointer group">
                   <div>
                      <div className="text-sm font-bold text-[#FFFFFF] tracking-tight group-hover:text-blue-400 transition-colors">Product Updates</div>
                      <div className="text-xs text-[#9CA3AF] mt-0.5">Get notified about new features and platform improvements.</div>
                   </div>
                   <div className="relative inline-flex items-center mx-4 mt-1">
                      <input type="checkbox" name="email_product" className="sr-only peer" defaultChecked={prefs.email_product ?? false} />
                      <div className="w-9 h-5 bg-[#1C1C1E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] border border-[#2D2D2D] after:bg-[#A7A29A] peer-checked:after:bg-[#050505] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F5F2EB] peer-checked:border-[#F5F2EB]"></div>
                   </div>
                </label>

                <label className="flex items-start justify-between cursor-pointer group">
                   <div>
                      <div className="text-sm font-bold text-[#FFFFFF] tracking-tight group-hover:text-blue-400 transition-colors">Cohort Announcements</div>
                      <div className="text-xs text-[#9CA3AF] mt-0.5">Important updates from your instructor or TA.</div>
                   </div>
                   <div className="relative inline-flex items-center mx-4 mt-1">
                      <input type="checkbox" name="email_cohort" className="sr-only peer" defaultChecked={prefs.email_cohort ?? true} />
                      <div className="w-9 h-5 bg-[#1C1C1E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] border border-[#2D2D2D] after:bg-[#A7A29A] peer-checked:after:bg-[#050505] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F5F2EB] peer-checked:border-[#F5F2EB]"></div>
                   </div>
                </label>

                <label className="flex items-start justify-between cursor-pointer group">
                   <div>
                      <div className="text-sm font-bold text-[#FFFFFF] tracking-tight group-hover:text-blue-400 transition-colors">Forum Replies</div>
                      <div className="text-xs text-[#9CA3AF] mt-0.5">When someone replies directly to your post in the Campus Forum.</div>
                   </div>
                   <div className="relative inline-flex items-center mx-4 mt-1">
                      <input type="checkbox" name="email_replies" className="sr-only peer" defaultChecked={prefs.email_replies ?? true} />
                      <div className="w-9 h-5 bg-[#1C1C1E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] border border-[#2D2D2D] after:bg-[#A7A29A] peer-checked:after:bg-[#050505] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F5F2EB] peer-checked:border-[#F5F2EB]"></div>
                   </div>
                </label>

                <label className="flex items-start justify-between cursor-pointer group">
                   <div>
                      <div className="text-sm font-bold text-[#FFFFFF] tracking-tight group-hover:text-blue-400 transition-colors">Mentions</div>
                      <div className="text-xs text-[#9CA3AF] mt-0.5">When someone @mentions you anywhere on the platform.</div>
                   </div>
                   <div className="relative inline-flex items-center mx-4 mt-1">
                      <input type="checkbox" name="email_mentions" className="sr-only peer" defaultChecked={prefs.email_mentions ?? true} />
                      <div className="w-9 h-5 bg-[#1C1C1E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] border border-[#2D2D2D] after:bg-[#A7A29A] peer-checked:after:bg-[#050505] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F5F2EB] peer-checked:border-[#F5F2EB]"></div>
                   </div>
                </label>
             </div>
          </div>

          <div>
             <div className="flex items-center gap-3 mb-4 pb-2 border-b border-[#2D2D2D]">
                <AppWindow className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-[0.1em]">In-App Alerts</h3>
             </div>
             
             <div className="space-y-4 max-w-2xl">
                <label className="flex items-start justify-between cursor-pointer group">
                   <div>
                      <div className="text-sm font-bold text-[#FFFFFF] tracking-tight group-hover:text-blue-400 transition-colors">Forum Replies</div>
                      <div className="text-xs text-[#9CA3AF] mt-0.5">Receive a bell notification when someone replies to you.</div>
                   </div>
                   <div className="relative inline-flex items-center mx-4 mt-1">
                      <input type="checkbox" name="app_replies" className="sr-only peer" defaultChecked={prefs.app_replies ?? true} />
                      <div className="w-9 h-5 bg-[#1C1C1E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] border border-[#2D2D2D] after:bg-[#A7A29A] peer-checked:after:bg-[#050505] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F5F2EB] peer-checked:border-[#F5F2EB]"></div>
                   </div>
                </label>

                <label className="flex items-start justify-between cursor-pointer group">
                   <div>
                      <div className="text-sm font-bold text-[#FFFFFF] tracking-tight group-hover:text-blue-400 transition-colors">Direct Mentions</div>
                      <div className="text-xs text-[#9CA3AF] mt-0.5">Receive a bell notification for @mentions.</div>
                   </div>
                   <div className="relative inline-flex items-center mx-4 mt-1">
                      <input type="checkbox" name="app_mentions" className="sr-only peer" defaultChecked={prefs.app_mentions ?? true} />
                      <div className="w-9 h-5 bg-[#1C1C1E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] border border-[#2D2D2D] after:bg-[#A7A29A] peer-checked:after:bg-[#050505] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F5F2EB] peer-checked:border-[#F5F2EB]"></div>
                   </div>
                </label>

                <label className="flex items-start justify-between cursor-pointer group">
                   <div>
                      <div className="text-sm font-bold text-[#FFFFFF] tracking-tight group-hover:text-blue-400 transition-colors">Deliverable Graded</div>
                      <div className="text-xs text-[#9CA3AF] mt-0.5">Get notified immediately when an instructor grades your work.</div>
                   </div>
                   <div className="relative inline-flex items-center mx-4 mt-1">
                      <input type="checkbox" name="app_graded" className="sr-only peer" defaultChecked={prefs.app_graded ?? true} />
                      <div className="w-9 h-5 bg-[#1C1C1E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] border border-[#2D2D2D] after:bg-[#A7A29A] peer-checked:after:bg-[#050505] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F5F2EB] peer-checked:border-[#F5F2EB]"></div>
                   </div>
                </label>
             </div>
          </div>

          <div className="pt-8 flex items-center gap-4">
            <button disabled={isPending} type="submit" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F5F2EB] hover:bg-white text-[#050505] text-xs font-bold uppercase tracking-[0.1em] transition-all shadow-[0_0_15px_rgba(245,242,235,0.15)] disabled:opacity-50">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isPending ? "Saving..." : "Save Preferences"}
            </button>
            {isPending && <span className="text-sm font-medium text-admin-muted animate-pulse">Syncing...</span>}
          </div>
        </form>

      </div>
    </div>
  );
}

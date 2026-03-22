"use client";

import { Save, Lock, Mail, Users, HardHat, Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { updateGlobalSettings } from '@/app/actions/settings';
import { toast } from 'sonner';

export function GlobalSettingsForm({ settings }: { settings: any }) {
  const [isPending, startTransition] = useTransition();

  async function actionHandler(formData: FormData) {
    startTransition(async () => {
      const data = {
        platformName: formData.get("platformName") as string,
        supportEmail: formData.get("supportEmail") as string,
        allowStudentRegistration: formData.get("allowStudentRegistration") === "on",
        allowInstructorRegistration: formData.get("allowInstructorRegistration") === "on",
        enforceMfa: formData.get("enforceMfa") === "on",
        requireProfileCompletion: formData.get("requireProfileCompletion") === "on",
        maintenanceMode: formData.get("maintenanceMode") === "on",
        currentCohortWeek: parseInt(formData.get("currentCohortWeek") as string) || 1,
      };

      try {
        await updateGlobalSettings(data);
        toast.success("Global settings saved successfully!");
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-surface tracking-tight mb-6 flex items-center gap-2">
          Global Settings
          <span className="text-[10px] uppercase tracking-wider bg-admin-border px-2 py-0.5 rounded-full text-admin-muted">Admin Only</span>
        </h2>
        
        <form action={actionHandler} className="space-y-8 max-w-2xl">
          
          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-xs font-semibold uppercase tracking-[0.1em] text-admin-muted">Platform Name</label>
                 <input 
                   type="text" 
                   name="platformName"
                   defaultValue={settings?.platformName || "OpenSch"}
                   className="w-full bg-admin-surface border border-admin-border focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-surface placeholder:text-gray-600 outline-none transition-all" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-semibold uppercase tracking-[0.1em] text-admin-muted">Support Email</label>
                 <div className="relative">
                   <Mail className="absolute left-4 top-3.5 w-4 h-4 text-admin-muted" />
                   <input 
                     type="email" 
                     name="supportEmail"
                     defaultValue={settings?.supportEmail || "support@opensch.com"}
                     className="w-full bg-admin-surface border border-admin-border focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-surface placeholder:text-gray-600 outline-none transition-all" 
                   />
                 </div>
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-6 pt-6">
               <div className="space-y-2">
                 <label className="text-xs font-semibold uppercase tracking-[0.1em] text-admin-muted">Academic Journey (Active Week)</label>
                 <select 
                   name="currentCohortWeek"
                   defaultValue={settings?.currentCohortWeek || 1}
                   className="w-full bg-admin-surface border border-admin-border focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-surface outline-none transition-all"
                 >
                   <option value="1">Week 1: The Rapid Prototype</option>
                   <option value="2">Week 2: System Intelligence</option>
                   <option value="3">Week 3: Resilience & Protocols</option>
                   <option value="4">Week 4: Polish, QA, and Scale</option>
                 </select>
               </div>
             </div>
          </div>

          <div className="pt-6 border-t border-admin-border space-y-6">
            <div className="flex items-center gap-3 mb-4 pb-2">
               <Users className="w-5 h-5 text-indigo-400" />
               <h3 className="text-sm font-bold text-surface uppercase tracking-[0.1em]">Registration Controls</h3>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-start justify-between cursor-pointer group">
                 <div>
                    <div className="text-sm font-bold text-surface tracking-tight group-hover:text-indigo-400 transition-colors">Open Student Registration</div>
                    <div className="text-xs text-admin-muted mt-0.5">Allow public sign-ups for new students without an invite.</div>
                 </div>
                 <div className="relative inline-flex items-center mx-4 mt-1">
                    <input type="checkbox" name="allowStudentRegistration" className="sr-only peer" defaultChecked={settings?.allowStudentRegistration} />
                    <div className="w-9 h-5 bg-admin-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] border border-admin-border after:bg-admin-muted peer-checked:after:bg-[#050505] after:border-gray-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white peer-checked:border-white"></div>
                 </div>
              </label>

              <label className="flex items-start justify-between cursor-pointer group">
                 <div>
                    <div className="text-sm font-bold text-surface tracking-tight group-hover:text-indigo-400 transition-colors">Open Instructor Registration</div>
                    <div className="text-xs text-admin-muted mt-0.5">Allow public sign-ups for new instructors. Usually off.</div>
                 </div>
                 <div className="relative inline-flex items-center mx-4 mt-1">
                    <input type="checkbox" name="allowInstructorRegistration" className="sr-only peer" defaultChecked={settings?.allowInstructorRegistration} />
                    <div className="w-9 h-5 bg-admin-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] border border-admin-border after:bg-admin-muted peer-checked:after:bg-[#050505] after:border-gray-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white peer-checked:border-white"></div>
                 </div>
              </label>

              <label className="flex items-start justify-between cursor-pointer group">
                 <div>
                    <div className="text-sm font-bold text-surface tracking-tight group-hover:text-indigo-400 transition-colors">Require Profile Completion</div>
                    <div className="text-xs text-admin-muted mt-0.5">Force users to complete their bio and timezone on first login.</div>
                 </div>
                 <div className="relative inline-flex items-center mx-4 mt-1">
                    <input type="checkbox" name="requireProfileCompletion" className="sr-only peer" defaultChecked={settings?.requireProfileCompletion} />
                    <div className="w-9 h-5 bg-admin-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] border border-admin-border after:bg-admin-muted peer-checked:after:bg-[#050505] after:border-gray-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white peer-checked:border-white"></div>
                 </div>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-admin-border space-y-6">
            <div className="flex items-center gap-3 mb-4 pb-2">
               <Lock className="w-5 h-5 text-rose-400" />
               <h3 className="text-sm font-bold text-surface uppercase tracking-[0.1em]">Security & System</h3>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-start justify-between cursor-pointer group">
                 <div>
                    <div className="text-sm font-bold text-surface tracking-tight group-hover:text-rose-400 transition-colors">Enforce MFA Sitewide</div>
                    <div className="text-xs text-admin-muted mt-0.5">Require all Admin and Instructor accounts to use 2FA.</div>
                 </div>
                 <div className="relative inline-flex items-center mx-4 mt-1">
                    <input type="checkbox" name="enforceMfa" className="sr-only peer" defaultChecked={settings?.enforceMfa} />
                    <div className="w-9 h-5 bg-admin-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] border border-admin-border after:bg-admin-muted peer-checked:after:bg-[#050505] after:border-gray-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white peer-checked:border-white"></div>
                 </div>
              </label>
              
              <label className="flex items-start justify-between cursor-pointer group p-4 border border-rose-500/20 bg-rose-500/5 rounded-xl mt-4">
                 <div className="flex items-center gap-3">
                    <HardHat className="w-8 h-8 text-rose-500" />
                    <div>
                       <div className="text-sm font-bold text-rose-400 tracking-tight">Maintenance Mode</div>
                       <div className="text-xs text-admin-muted mt-0.5">Block all non-admin traffic immediately with a maintenance page.</div>
                    </div>
                 </div>
                 <div className="relative inline-flex items-center mx-4 mt-1 shrink-0">
                    <input type="checkbox" name="maintenanceMode" className="sr-only peer" defaultChecked={settings?.maintenanceMode} />
                    <div className="w-9 h-5 bg-admin-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] border border-admin-border after:bg-admin-muted peer-checked:after:bg-[#050505] after:border-gray-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500 peer-checked:border-rose-500"></div>
                 </div>
              </label>
            </div>
          </div>

          <div className="pt-8 flex items-center gap-4">
            <button disabled={isPending} type="submit" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-gray-100 text-[#050505] text-xs font-bold uppercase tracking-[0.1em] transition-all disabled:opacity-50">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isPending ? "Syncing configs..." : "Save System Config"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

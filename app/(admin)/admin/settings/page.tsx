import { Settings, Wrench } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="p-8 md:p-14 max-w-[1400px] mx-auto text-surface space-y-10 pb-32 h-full flex flex-col">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-[22px] font-semibold tracking-[-0.02em] text-surface flex items-center gap-2">
          Global Settings
        </h1>
        <p className="text-gray-300 text-[13px] leading-relaxed">Configure administrative settings, billing, and system preferences.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-admin-surface border border-admin-border rounded-2xl">
         <div className="w-16 h-16 rounded-full bg-white/5 border border-admin-border flex items-center justify-center mb-6">
            <Wrench className="w-8 h-8 text-admin-muted" />
         </div>
         <h2 className="text-lg font-semibold text-surface mb-2">Settings are under construction</h2>
         <p className="text-[13px] text-admin-muted max-w-sm text-center">
            We are migrating the global settings panel to the new Admin design system. Check back soon.
         </p>
      </div>
    </div>
  );
}

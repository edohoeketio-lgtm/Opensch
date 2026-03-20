import { getAuthenticatedUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { GlobalSettingsForm } from '@/components/settings/GlobalSettingsForm';
import { ProfileSettingsForm } from '@/components/settings/ProfileSettingsForm';
import { Settings } from 'lucide-react';

export default async function AdminSettingsPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login');

  let content;

  if (user.role === 'ADMIN') {
    let settings = await prisma.globalSettings.findFirst();
    if (!settings) {
       settings = await prisma.globalSettings.create({ data: {} });
    }
    content = <GlobalSettingsForm settings={settings} />;
  } else {
    // Instructor settings = personal profile & notifications
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    });
    content = (
      <div className="space-y-8">
        <div className="bg-admin-surface border border-admin-border rounded-2xl p-8 max-w-3xl">
           <ProfileSettingsForm profile={profile} />
        </div>
        <div className="bg-admin-surface border border-admin-border rounded-2xl p-8 max-w-3xl">
           <NotificationSettingsForm profile={profile} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-14 max-w-[1400px] mx-auto text-surface space-y-10 pb-32 h-full flex flex-col">
      <div className="flex flex-col gap-1 mb-4">
        <h1 className="text-xl md:text-[22px] font-semibold tracking-[-0.02em] text-surface flex items-center gap-2">
          {user.role === 'ADMIN' ? "Admin Settings" : "Instructor Settings"}
        </h1>
        <p className="text-gray-300 text-[13px] leading-relaxed">
           {user.role === 'ADMIN' 
             ? "Configure system-wide administrative controls and behaviors." 
             : "Manage your personal instructor profile and preferences."}
        </p>
      </div>

      <div className="flex-1">
        {content}
      </div>
    </div>
  );
}

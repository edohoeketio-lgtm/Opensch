import { getAuthenticatedUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { NotificationSettingsForm } from '@/components/settings/NotificationSettingsForm';

export default async function NotificationSettingsPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login');

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  });

  return (
    <NotificationSettingsForm profile={profile} />
  );
}

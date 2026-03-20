import { getAuthenticatedUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ProfileSettingsForm } from '@/components/settings/ProfileSettingsForm';

export default async function ProfileSettingsPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login');

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  });

  return (
    <ProfileSettingsForm profile={profile} />
  );
}

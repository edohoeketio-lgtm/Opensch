import { getBroadcasts } from '@/app/actions/broadcasts';
import BroadcastClient from './BroadcastClient';
import { getAuthenticatedUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function BroadcastsPage() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const broadcasts = await getBroadcasts();

  return <BroadcastClient initialBroadcasts={broadcasts} />;
}

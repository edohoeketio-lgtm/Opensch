import { getBroadcasts } from '@/app/actions/broadcasts';
import BroadcastClient from './BroadcastClient';

export default async function BroadcastsPage() {
  const broadcasts = await getBroadcasts();

  return <BroadcastClient initialBroadcasts={broadcasts} />;
}

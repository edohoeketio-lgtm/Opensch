import prisma from '@/lib/prisma';
import InstructorsClient, { UI_Instructor } from './InstructorsClient';
import { getAuthenticatedUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function FacultyManagementPage() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }
  const canInvite = user?.role === 'ADMIN';
  const facultyRecords = await prisma.user.findMany({
    where: {
      role: { in: ['INSTRUCTOR', 'ADMIN'] }
    },
    include: {
      profile: true,
      cohort: true, // Assuming Users can be explicitly mapped to a cohort
    }
  });

  const facultyIds = facultyRecords.map(f => f.id);

  // Group load balancing stats
  const stats = await prisma.submission.groupBy({
    by: ['reviewerId', 'status'],
    where: { 
      reviewerId: { in: facultyIds } 
    },
    _count: {
      _all: true
    }
  });

  const uiFaculty: UI_Instructor[] = facultyRecords.map(f => {
    // Process stats for this specific instructor
    const fStats = stats.filter(s => s.reviewerId === f.id);
    
    // Determine pending load (In Review or AI Drafted but claimed)
    const pendingLoad = fStats.find(s => s.status === 'PENDING' || s.status === 'IN_REVIEW' || s.status === 'AI_DRAFTED')?._count._all || 0;
    
    // Determine passed load (Cleared)
    const passedLoad = fStats.find(s => s.status === 'PASSED')?._count._all || 0;

    return {
      id: f.id,
      name: f.profile?.fullName || (f.role === 'ADMIN' ? 'Admin' : 'New Instructor'),
      email: f.email,
      role: f.role,
      cohort: f.cohort?.name || null,
      workload: {
        pending: pendingLoad,
        inReview: 0,
        passed: passedLoad
      }
    };
  });

  return <InstructorsClient faculty={uiFaculty} canInvite={canInvite} />;
}

import prisma from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ studentId?: string }> }) {
  const params = await searchParams;
  let studentName = null;
  let impersonating = false;

  try {
    if (params.studentId) {
      impersonating = true;
      // Single optimal query catching relations to power the dashboard metrics
      const student = await prisma.user.findUnique({
        where: { id: params.studentId },
        include: { profile: true }
      });
      if (student) {
        studentName = student.profile?.isPublic ? student.email.split('@')[0] : 'Private Student';
      } else {
        // ID didn't match real db
        studentName = `Mock Student [${params.studentId}]`;
      }
    }
  } catch (error) {
    // Graceful fallback for local environments missing full seeded database
    if (params.studentId) {
      impersonating = true;
      studentName = 'Alex Thompson (Mock)';
    }
  }

  return <DashboardClient studentName={studentName} isImpersonating={impersonating} studentId={params.studentId || null} />;
}

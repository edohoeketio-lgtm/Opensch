import { getOrCreateCourse } from '@/app/actions/curriculum';
import { getAuthenticatedUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import CurriculumClient from './CurriculumClient';

export const dynamic = 'force-dynamic';

export default async function CurriculumPage() {
  const course = await getOrCreateCourse();
  const user = await getAuthenticatedUser();
  
  let progressMap: Record<string, boolean> = {};
  if (user) {
    const progress = await prisma.progressState.findMany({
      where: { userId: user.id }
    });
    progress.forEach(p => {
      progressMap[p.lessonId] = p.isCompleted;
    });
  }

  return <CurriculumClient course={course} progressMap={progressMap} />;
}

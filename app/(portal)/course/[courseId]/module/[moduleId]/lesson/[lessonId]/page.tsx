import { InteractiveVideoPlayer } from './InteractiveVideoPlayer';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';

export default async function LessonClassroomPage({
  params,
  searchParams
}: {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
  searchParams: Promise<{ studentId?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Validate that lessonId is a proper UUID before querying Postgres
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(resolvedParams.lessonId)) {
    const { redirect } = await import('next/navigation');
    redirect('/dashboard');
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: resolvedParams.lessonId }
  });
  if (!lesson) return notFound();

  const user = await getAuthenticatedUser();
  const isInstructor = user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';
  const targetUserId = resolvedSearchParams.studentId || user?.id;
  let isCompleted = false;
  if (targetUserId) {
    const progress = await prisma.progressState.findUnique({
      where: {
        userId_lessonId: {
          userId: targetUserId,
          lessonId: lesson.id
        }
      }
    });
    isCompleted = progress?.isCompleted || false;
  }

  // Determine next lesson or next module's first lesson
  let nextLessonUrl: string | null = null;
  let isLastLesson = false;

  const currentModule = await prisma.module.findUnique({ 
    where: { id: resolvedParams.moduleId },
    include: {
      sections: {
        include: { lessons: { orderBy: { order: 'asc' } } },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!currentModule) return notFound();

  const currentModuleLessons = currentModule.sections.flatMap((s: any) => s.lessons);

  const currentIndex = currentModuleLessons.findIndex((l: any) => l.id === lesson.id);
  
  if (currentIndex !== -1 && currentIndex < currentModuleLessons.length - 1) {
    const nextLesson = currentModuleLessons[currentIndex + 1];
    nextLessonUrl = `/course/${resolvedParams.courseId}/module/${resolvedParams.moduleId}/lesson/${nextLesson.id}`;
  } else {
    isLastLesson = true;
    const nextModule = await prisma.module.findFirst({
      where: { courseId: currentModule.courseId, order: { gt: currentModule.order } },
      orderBy: { order: 'asc' },
      include: { 
        sections: { 
          include: { lessons: { orderBy: { order: 'asc' } } },
          orderBy: { order: 'asc' }
        } 
      }
    });

    if (nextModule) {
      const nextModuleLessons = nextModule.sections.flatMap((s: any) => s.lessons);
      if (nextModuleLessons.length > 0) {
        nextLessonUrl = `/course/${resolvedParams.courseId}/module/${nextModule.id}/lesson/${nextModuleLessons[0].id}`;
      } else {
        nextLessonUrl = `/dashboard`; // End of course
      }
    } else {
      nextLessonUrl = `/dashboard`; // End of course
    }
  }

  return (
    <InteractiveVideoPlayer 
       sprintTitle={lesson.title} 
       lessonId={resolvedParams.lessonId}
       lessonOrder={lesson.order}
       videoUrl={lesson.muxPlaybackId}
       quizData={(lesson as any).quizData}
       isReadOnly={isInstructor || !!resolvedSearchParams.studentId}
       transcriptSegments={(lesson as any).transcriptSegments}
       transcriptCleanText={(lesson as any).transcriptCleanText}
       description={lesson.description}
       isLastLesson={isLastLesson}
       nextLessonUrl={nextLessonUrl}
       isCompleted={isCompleted}
    />
  );
}

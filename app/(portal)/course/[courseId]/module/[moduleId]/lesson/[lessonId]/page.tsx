import { InteractiveVideoPlayer } from './InteractiveVideoPlayer';

export default async function LessonClassroomPage({
  params,
  searchParams
}: {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
  searchParams: Promise<{ studentId?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <InteractiveVideoPlayer 
       sprintTitle="Implementing OAuth Providers" 
       lessonId={resolvedParams.lessonId}
       isReadOnly={!!resolvedSearchParams.studentId}
    />
  );
}

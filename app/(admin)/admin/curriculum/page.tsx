import { getOrCreateCourse } from '@/app/actions/curriculum';
import CurriculumClient from './CurriculumClient';

export default async function CurriculumPage() {
  const course = await getOrCreateCourse();
  if (!course) return <div>Failed to load or create OpenSch course.</div>;
  
  // Map Prisma models to the UI expected shapes
  const mappedModules = course.modules.map(mod => ({
    id: mod.id,
    title: mod.title,
    description: mod.description || '',
    lessons: mod.lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || '',
      type: (lesson.muxPlaybackId ? 'video' : 'article') as 'video' | 'article' | 'sprint',
      duration: '--', 
      status: lesson.isPublished ? 'published' : 'draft',
      muxPlaybackId: lesson.muxPlaybackId || ''
    }))
  }));

  return <CurriculumClient initialModules={mappedModules} courseId={course.id} />;
}

import { getOrCreateCourse } from '@/app/actions/curriculum';
import CurriculumClient from './CurriculumClient';

export default async function CurriculumPage() {
  const course = await getOrCreateCourse();
  if (!course) return <div>Failed to load or create OpenSch course.</div>;
  
  // Map Prisma models to the UI expected shapes
  const mappedModules = course.modules.map((mod: any) => ({
    id: mod.id,
    title: mod.title,
    description: mod.description || '',
    sections: mod.sections.map((section: any) => ({
      id: section.id,
      title: section.title,
      lessons: section.lessons.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || '',
        type: (lesson.muxPlaybackId ? 'video' : 'article') as 'video' | 'article' | 'sprint',
        duration: '--', 
        status: lesson.isPublished ? 'published' : 'draft',
        muxPlaybackId: lesson.muxPlaybackId || '',
        quizData: lesson.quizData || []
      }))
    }))
  }));

  return <CurriculumClient initialModules={mappedModules} courseId={course.id} />;
}

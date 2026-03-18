"use server";

import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getOrCreateCourse() {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("Unauthorized access. You must be logged in to access the curriculum.");
  }

  const includeQuery = {
    modules: {
      include: {
        lessons: {
          orderBy: { order: 'asc' as const }
        }
      },
      orderBy: { order: 'asc' as const }
    }
  };

  let course = await prisma.course.findFirst({
    include: includeQuery
  });

  if (!course) {
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!admin) throw new Error("No admin found to own the course");
    
    const newCourse = await prisma.course.create({
      data: {
        title: "OpenSch Core Curriculum",
        description: "Main cohort curriculum",
        slug: "core-curriculum",
        instructorId: admin.id
      }
    });

    course = await prisma.course.findUnique({
      where: { id: newCourse.id },
      include: includeQuery
    });
  }

  return course!;
}

export async function createModule(courseId: string, title: string, order: number) {
  const user = await getAuthenticatedUser();
  if (!user || user.role === 'STUDENT') throw new Error("Forbidden");
  await prisma.module.create({
    data: {
      courseId,
      title,
      description: "Click settings to configure module details.",
      order
    }
  });
  revalidatePath('/admin/curriculum');
}

export async function createLesson(moduleId: string, title: string, order: number, type: 'video' | 'article' | 'sprint') {
  const user = await getAuthenticatedUser();
  if (!user || user.role === 'STUDENT') throw new Error("Forbidden");
  await prisma.lesson.create({
    data: {
      moduleId,
      title,
      description: "Write your lesson content here...",
      order,
      // We don't have a specific `type` enum on Lesson so we just treat it loosely 
      // based on muxPlaybackId being present or absent for video/article in the UI,
      // but let's just initialize
    }
  });
  revalidatePath('/admin/curriculum');
}

export async function updateLessonDetails(lessonId: string, title: string, description: string, muxPlaybackId?: string) {
  const user = await getAuthenticatedUser();
  if (!user || user.role === 'STUDENT') throw new Error("Forbidden");
  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      title,
      description,
      muxPlaybackId
    }
  });
  revalidatePath('/admin/curriculum');
}

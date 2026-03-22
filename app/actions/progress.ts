"use server";

import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function markLessonComplete(lessonId: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const progress = await prisma.progressState.upsert({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId: lessonId
      }
    },
    update: {
      isCompleted: true,
      lastWatchedAt: new Date()
    },
    create: {
      userId: user.id,
      lessonId: lessonId,
      isCompleted: true,
      watchedSeconds: 0,
      lastWatchedAt: new Date()
    }
  });

  revalidatePath('/', 'layout');
  return progress;
}

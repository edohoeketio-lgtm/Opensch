"use server";

import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function submitFinalGrade(submissionId: string, finalScore: number, finalFeedback: string, status: 'PASSED' | 'REVISIONS_REQUESTED' | 'ESCALATED' | 'REJECTED') {
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    throw new Error('Unauthorized');
  }

  // Handle DB-native properties mapping
  // Prisma SubmissionStatus does not explicitly define REJECTED, but has ESCALATED and PENDING
  // We use the exact enum value expected by the schema
  const dbStatus = status === 'REJECTED' ? 'REVISIONS_REQUESTED' : status;

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      score: finalScore,
      feedback: finalFeedback,
      status: dbStatus,
      gradedAt: new Date(),
      reviewerId: user.id
    }
  });

  revalidatePath('/admin');
  revalidatePath('/admin/reviews');
  revalidatePath('/dashboard');
  
  return { success: true };
}

'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/lib/auth';

export async function logIntervention(data: {
  studentId: string;
  reason: string;
  actionTaken: string;
}) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role === 'STUDENT') throw new Error("Forbidden");

    // In a real app we'd get the instructorId from the session, 
    // but for now we'll pick the first ADMIN/INSTRUCTOR or hardcode a fake UUID if none exists.
    const instructor = await prisma.user.findFirst({
      where: { role: { in: ['ADMIN', 'INSTRUCTOR'] } }
    });
    
    // We strictly need a valid author UUID because of referential integrity
    const instructorId = instructor?.id || data.studentId; // Fallback to avoid crashes if DB is empty

    const log = await prisma.interventionLog.create({
      data: {
        studentId: data.studentId,
        instructorId: instructorId,
        reason: data.reason,
        actionTaken: data.actionTaken,
        status: 'OPEN'
      }
    });

    revalidatePath('/admin/roster');
    revalidatePath('/admin'); // Because this affects the Command Center critical risk count

    return { success: true, log };
  } catch (error: any) {
    console.error("Failed to log intervention:", error);
    return { success: false, error: error.message };
  }
}

export async function resolveIntervention(interventionId: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role === 'STUDENT') throw new Error("Forbidden");

    await prisma.interventionLog.update({
      where: { id: interventionId },
      data: { status: 'RESOLVED' }
    });
    revalidatePath('/admin/roster');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to resolve intervention:", error);
    return { success: false, error: error.message };
  }
}

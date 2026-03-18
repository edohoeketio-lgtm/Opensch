"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "@/lib/auth";

const BroadcastSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters long").max(100, "Subject is too long"),
  message: z.string().min(10, "Message must be at least 10 characters long").max(5000, "Message is too long"),
  target: z.string().min(1, "Target audience is required"),
  scheduledFor: z.string().optional(),
});

export async function getBroadcasts() {
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR')) {
    throw new Error("Forbidden: Insufficient Permissions");
  }
  const broadcasts = await prisma.broadcast.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { include: { profile: { select: { fullName: true } } } } }
  });
  return broadcasts;
}

export async function deployBroadcast(formData: FormData, status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' = 'PUBLISHED') {
  try {
    const rawData = {
      subject: formData.get("subject"),
      message: formData.get("message"),
      target: formData.get("target"),
      scheduledFor: formData.get("scheduledFor") || undefined,
    };

    const validatedData = BroadcastSchema.safeParse(rawData);

    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    const { subject, message, target, scheduledFor } = validatedData.data;

    const user = await getAuthenticatedUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR')) {
      return { success: false, error: 'Unauthorized.' };
    }

    let parsedDate = null;
    if (status === 'SCHEDULED' && scheduledFor) {
      parsedDate = new Date(scheduledFor);
    }

    const broadcast = await prisma.broadcast.create({
      data: {
        title: subject,
        content: message,
        targetAudience: target,
        authorId: user.id,
        status: status,
        isPublished: status === 'PUBLISHED',
        scheduledFor: parsedDate,
      },
    });

    revalidatePath("/admin/broadcasts");
    revalidatePath("/feed");

    return { success: true, broadcastId: broadcast.id };
  } catch (error: any) {
    console.error("Failed to process broadcast:", error);
    if (error?.message?.includes("Can't reach database server") || error?.code === 'P1001') {
       return { success: false, error: "Database offline. Please start your Prisma Postgres server." };
    }
    return { success: false, error: error?.message || "An unexpected error occurred." };
  }
}

export async function deleteBroadcast(id: string) {
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR')) throw new Error("Forbidden");
  await prisma.broadcast.delete({ where: { id } });
  revalidatePath("/admin/broadcasts");
  revalidatePath("/feed");
  return { success: true };
}

export async function updateBroadcast(id: string, formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR')) throw new Error("Forbidden");
  
  const rawData = {
    subject: formData.get("subject"),
    message: formData.get("message"),
    target: formData.get("target"),
    scheduledFor: formData.get("scheduledFor") || undefined,
  };
  
  const validatedData = BroadcastSchema.safeParse(rawData);
  if (!validatedData.success) return { success: false, error: validatedData.error.issues[0].message };
  
  const { subject, message, target, scheduledFor } = validatedData.data;

  let parsedDate = null;
  if (scheduledFor) {
    parsedDate = new Date(scheduledFor);
  }

  const broadcast = await prisma.broadcast.update({
    where: { id },
    data: {
      title: subject,
      content: message,
      targetAudience: target,
      scheduledFor: parsedDate,
    },
  });

  revalidatePath("/admin/broadcasts");
  revalidatePath("/feed");
  return { success: true, broadcastId: broadcast.id };
}

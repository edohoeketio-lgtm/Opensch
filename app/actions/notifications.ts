"use server";

import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getNotifications(limit: number = 10) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: user.id, isRead: false },
  });

  return { notifications, unreadCount };
}

export async function markNotificationRead(notificationId: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.notification.updateMany({
    where: { id: notificationId, userId: user.id },
    data: { isRead: true },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function markAllNotificationsRead() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}

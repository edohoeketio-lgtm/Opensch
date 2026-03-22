"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function updateProfile(data: {
  fullName?: string;
  username?: string;
  timezone?: string;
  experienceLevel?: string;
  bio?: string;
  githubHandle?: string;
  linkedinUrl?: string;
  avatarUrl?: string;
}) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: data,
    create: {
      userId: user.id,
      ...data,
    },
  });

  revalidatePath('/settings');
  revalidatePath('/admin/settings');
  return { success: true, profile };
}

export async function updateNotificationPreferences(preferences: Record<string, boolean>) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: { notificationSettings: preferences },
    create: {
      userId: user.id,
      notificationSettings: preferences,
    },
  });

  revalidatePath('/settings/notifications');
  revalidatePath('/admin/settings/notifications');
  return { success: true, profile };
}

export async function getGlobalSettings() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'ADMIN') throw new Error("Unauthorized");

  let settings = await prisma.globalSettings.findFirst();
  if (!settings) {
    settings = await prisma.globalSettings.create({ data: {} });
  }
  return settings;
}

export async function updateGlobalSettings(data: {
  platformName?: string;
  supportEmail?: string;
  allowStudentRegistration?: boolean;
  allowInstructorRegistration?: boolean;
  enforceMfa?: boolean;
  requireProfileCompletion?: boolean;
  maintenanceMode?: boolean;
  currentCohortWeek?: number;
}) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'ADMIN') throw new Error("Unauthorized");

  const settings = await prisma.globalSettings.findFirst();
  if (settings) {
    await prisma.globalSettings.update({
      where: { id: settings.id },
      data: { ...data, updatedByUserId: user.id },
    });
  } else {
    await prisma.globalSettings.create({
      data: { ...data, updatedByUserId: user.id },
    });
  }


  revalidatePath('/admin/settings');
  return { success: true };
}

export async function getMyProfile() {
  const user = await getAuthenticatedUser();
  if (!user) return null;
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { fullName: true, avatarUrl: true }
  });
  return { 
    fullName: profile?.fullName || null, 
    avatarUrl: profile?.avatarUrl || "https://api.dicebear.com/7.x/notionists/svg?seed=OpenSch&backgroundColor=transparent", 
    role: user.role 
  };
}

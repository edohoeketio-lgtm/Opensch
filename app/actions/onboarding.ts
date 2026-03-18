"use server"

import { getAuthenticatedUser } from "@/lib/auth"
import prisma from "@/lib/prisma" 
import { revalidatePath } from "next/cache"

export async function syncOnboardingProfile(formData: {
  fullName: string
  username: string
  githubUrl: string
  bio: string
  timezone: string
  experienceLevel: string
}) {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error('Unauthorized')
  }

  // 1. Ensure User exists in local Prisma tables 
  // (We use pure Prisma now, no foreign auth linking)
  const existingUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!existingUser) {
     throw new Error("User record not found in database.");
  }

  // 2. Upsert the Profile record with the comprehensive onboarding data
  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      fullName: formData.fullName,
      username: formData.username,
      githubHandle: formData.githubUrl,
      bio: formData.bio,
      timezone: formData.timezone,
      experienceLevel: formData.experienceLevel
    },
    create: {
      userId: user.id,
      fullName: formData.fullName,
      username: formData.username,
      githubHandle: formData.githubUrl,
      bio: formData.bio,
      timezone: formData.timezone,
      experienceLevel: formData.experienceLevel
    }
  })

  revalidatePath("/")
  return { success: true }
}

import { cookies } from "next/headers";
import { cache } from "react";
import prisma from "./prisma";

/**
 * MOCK AUTHENTICATION UTILITY
 * Since no external Auth provider (Supabase Auth, Clerk, NextAuth) is currently installed,
 * this utility simulates a secure server-side session extraction.
 */
export const getAuthenticatedUser = cache(async () => {
  // In a real app, this would be:
  // const supabase = createServerComponentClient({ cookies })
  // const { data: { session } } = await supabase.auth.getSession()
  // return session?.user

  // MOCK ROLE SWITCHING VIA COOKIE
  const cookieStore = await cookies();
  const mockEmail = cookieStore.get('opensch_mock_email')?.value;
  let user = null;

  if (mockEmail) {
    user = await prisma.user.findUnique({
      where: { email: mockEmail },
      include: { profile: true }
    });
  }

  // Fallback to generating isolated unique student if no user found
  if (!user) {
    const fallbackEmail = mockEmail || "student@opensch.com";
    user = await prisma.user.upsert({
      where: { email: fallbackEmail },
      update: {
        role: "ADMIN"
      },
      create: {
        email: fallbackEmail,
        role: "ADMIN",
      },
      include: { profile: true }
    });
  }

  // Only update lastLogin if older than 5 minutes to prevent DB thrashing
  if (user) {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (!user.lastLogin || user.lastLogin < fiveMinutesAgo) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
        include: { profile: true }
      });
    }
  }

  return user;
});

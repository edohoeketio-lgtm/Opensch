import { cookies } from "next/headers";
import prisma from "./prisma";

/**
 * MOCK AUTHENTICATION UTILITY
 * Since no external Auth provider (Supabase Auth, Clerk, NextAuth) is currently installed,
 * this utility simulates a secure server-side session extraction.
 */
export async function getAuthenticatedUser() {
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
      where: { email: mockEmail }
    });
  }

  // Fallback to default student if no cookie or user not found
  if (!user) {
    user = await prisma.user.upsert({
      where: { email: "student@opensch.com" },
      update: {
        role: "ADMIN"
      },
      create: {
        email: "student@opensch.com",
        role: "ADMIN",
      }
    });
  }

  if (user) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
      include: { profile: true }
    });
  }

  return user;
}

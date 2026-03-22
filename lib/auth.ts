import { cookies } from "next/headers";
import { cache } from "react";
import prisma from "./prisma";

/**
 * MOCK AUTHENTICATION UTILITY
 * Since no external Auth provider (Supabase Auth, Clerk, NextAuth) is currently installed,
 * this utility simulates a secure server-side session extraction.
 */
import { createServerClient } from '@supabase/ssr';

export const getAuthenticatedUser = cache(async () => {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll() {}
    }
  });

  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  if (!authUser || !authUser.email) {
    return null;
  }

  const userEmail = authUser.email;

  let user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { profile: true }
  });

  // If user authenticated via Supabase but isn't in Prisma DB yet, create them.
  if (!user) {
    // Super Admin Check
    const isSuperAdmin = userEmail.toLowerCase() === (process.env.SUPER_ADMIN_EMAIL || '').toLowerCase();
    
    user = await prisma.user.create({
      data: {
        email: userEmail,
        role: isSuperAdmin ? "ADMIN" : "STUDENT",
        profile: {
          create: {
            fullName: userEmail.split('@')[0], 
            avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=OpenSch&backgroundColor=transparent`
          }
        }
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

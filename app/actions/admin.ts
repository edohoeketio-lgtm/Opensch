"use server"

import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function inviteInstructor(email: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return { error: 'Auth Context Lost: Could not identify session via cookies. Please refresh.' };
    }
    if (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR') {
      return { error: `Permission Denied: Current role is ${user.role}` };
    }

    if (!email || !email.includes('@')) {
      return { error: 'Invalid email address' };
    }

    // Check if user already exists in Prisma
    let newInstructor = await prisma.user.findUnique({
      where: { email }
    });

    let message = 'Instructor invited and emailed successfully.';
    let isNewCreation = false;

    if (newInstructor) {
      if (newInstructor.role === 'INSTRUCTOR') {
        message = 'Invite link resent successfully.';
      } else {
        newInstructor = await prisma.user.update({
          where: { email },
          data: { role: 'INSTRUCTOR' }
        });
      }
    } else {
      isNewCreation = true;
      newInstructor = await prisma.user.create({
        data: {
          email,
          role: 'INSTRUCTOR',
        }
      });
    }

    const { createClient } = await import('@supabase/supabase-js');
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      if (isNewCreation) {
        await prisma.user.delete({ where: { email } });
      }
      console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing.');
      return { error: 'Server configuration error: Missing Service Role' };
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://opensch.vercel.app';
    
    let inviteErrorResponse = null;

    const dispatchInvite = async () => {
      const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${siteUrl}/welcome`
      });
      return error;
    };

    inviteErrorResponse = await dispatchInvite();

    if (inviteErrorResponse && (inviteErrorResponse as any).code === 'email_exists') {
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
      const existingAuthUser = users.find(u => u.email === email);
      if (existingAuthUser) {
         await supabaseAdmin.auth.admin.deleteUser(existingAuthUser.id);
         inviteErrorResponse = await dispatchInvite();
      }
    }

    if (inviteErrorResponse) {
      if (isNewCreation) {
        await prisma.user.delete({ where: { email } });
      }
      console.error('Supabase Admin Invite error:', inviteErrorResponse);
      return { error: `Supabase Admin API Rejected: ${inviteErrorResponse.message}` };
    }

    revalidatePath('/admin/instructors');

    return { 
      success: true, 
      message,
      emailed: true 
    };

  } catch (error: any) {
    console.error('Invite error:', error);
    return { error: error.message || 'Internal Server Error' };
  }
}

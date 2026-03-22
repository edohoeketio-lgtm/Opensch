import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Check if user already exists
    let newInstructor = await prisma.user.findUnique({
      where: { email }
    });

    let message = 'Instructor invited and emailed successfully.';

    let isNewCreation = false;

    if (newInstructor) {
      if (newInstructor.role === 'INSTRUCTOR') {
        // Instead of erroring out if they already exist, we treat this as a "Resend Invite" action.
        message = 'Invite link resent successfully.';
      } else {
        // Upgrade existing standard user to instructor
        newInstructor = await prisma.user.update({
          where: { email },
          data: { role: 'INSTRUCTOR' }
        });
      }
    } else {
      isNewCreation = true;
      // Create new instructor
      newInstructor = await prisma.user.create({
        data: {
          email,
          role: 'INSTRUCTOR',
        }
      });
    }

    // Dispatch real magic link strictly through standard Supabase Auth Admin API
    // This securely bypasses PKCE browser session verification because it is meant
    // for server-to-server invitation dispatch scenarios.
    const { createClient } = await import('@supabase/supabase-js');
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      if (isNewCreation) {
        await prisma.user.delete({ where: { email } });
      }
      console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
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

    // Workaround for resending invites:
    // If the user already exists in Auth, `inviteUserByEmail` will fail with "User already registered".
    // Since our app relies purely on Email matching for identity, and not Auth ID, we can safely 
    // delete the shadow auth account and recreate it to force Supabase to dispatch a fresh invite email.
    if (inviteErrorResponse && (inviteErrorResponse as any).code === 'email_exists') {
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
      const existingAuthUser = users.find(u => u.email === email);
      if (existingAuthUser) {
         await supabaseAdmin.auth.admin.deleteUser(existingAuthUser.id);
         // Try dispatching again now that the auth record is wiped
         inviteErrorResponse = await dispatchInvite();
      }
    }

    if (inviteErrorResponse) {
      if (isNewCreation) {
        await prisma.user.delete({ where: { email } });
      }
      console.error('Supabase Admin Invite error:', inviteErrorResponse);
      return NextResponse.json({ error: inviteErrorResponse.message || 'Failed to securely dispatch invite via Supabase API' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: message, // Uses dynamic message defined above
      emailed: true // Flag to tell the UI the link was dispatched natively
    });

  } catch (error) {
    console.error('Invite error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

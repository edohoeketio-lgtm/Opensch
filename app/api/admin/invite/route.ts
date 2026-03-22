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
    
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/onboarding`
    });

    if (inviteError) {
      if (isNewCreation) {
        await prisma.user.delete({ where: { email } });
      }
      console.error('Supabase Admin Invite error:', inviteError);
      return NextResponse.json({ error: 'Failed to securely dispatch invite via Supabase API' }, { status: 500 });
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

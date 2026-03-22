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
      // Create new instructor
      newInstructor = await prisma.user.create({
        data: {
          email,
          role: 'INSTRUCTOR',
        }
      });
    }

    // Dispatch real magic link strictly through standard Supabase Auth
    // This allows us to safely bypass requiring the Service Role Key while achieving the exact same result!
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAnon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://opensch.vercel.app';
    
    const { error: otpError } = await supabaseAnon.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?next=/onboarding`,
        shouldCreateUser: true
      }
    });

    if (otpError) {
      console.error('Supabase OTP Dispatch error:', otpError);
      return NextResponse.json({ error: 'Failed to securely dispatch invite via Supabase' }, { status: 500 });
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

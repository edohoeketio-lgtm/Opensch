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

    if (newInstructor) {
      if (newInstructor.role === 'INSTRUCTOR') {
        return NextResponse.json({ error: 'User is already an instructor' }, { status: 400 });
      }
      
      // Upgrade existing user
      newInstructor = await prisma.user.update({
        where: { email },
        data: { role: 'INSTRUCTOR' }
      });
    } else {
      // Create new instructor
      newInstructor = await prisma.user.create({
        data: {
          email,
          role: 'INSTRUCTOR',
        }
      });
    }

    // Generate real magic link via Supabase Admin API
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Required for admin invite generation.' }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://opensch.vercel.app';
    
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${siteUrl}/onboarding/faculty`
      }
    });

    if (linkError || !linkData?.properties?.action_link) {
      console.error('Supabase generateLink error:', linkError);
      return NextResponse.json({ error: 'Failed to generate secure invite link from Supabase' }, { status: 500 });
    }

    const magicLink = linkData.properties.action_link;

    return NextResponse.json({ 
      success: true, 
      message: 'Instructor invited successfully.',
      magicLink 
    });

  } catch (error) {
    console.error('Invite error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

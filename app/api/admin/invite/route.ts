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

    // Generate mock magic link (in a real app, this connects to Supabase Admin Auth)
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://opensch.vercel.app';
    const magicLink = `${siteUrl}/api/auth/mock-magic-link?email=${encodeURIComponent(email)}&redirect=/onboarding/faculty`;

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
